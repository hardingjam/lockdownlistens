const express = require("express");
const app = express();
const compression = require("compression");
// shrinking files
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const { scrape } = require("./scrape");
const uidSafe = require("uid-safe");
const { getResultsByDayOfWeek, getResultsByTimeOfDay } = require("./database");
// ???
const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

var timesOfDay = [
    [0, 4, "Night"],
    [5, 11, "Morning"],
    [12, 16, "Afternoon"],
    [17, 21, "Evening"][(22, 24, "Night")],
];

// to, body, subject
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
// create PW recovery codes
const secretCode = cryptoRandomString({
    length: 6,
});
// creating the initial handshake between socket and our server (cannot use Express for this)
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        // allowRequest is socket.io's way of filtering out traffic from unauthorized sites.
        callback(
            null,
            req.headers.referer.startsWith(
                // is this right?
                "http://localhost:3000" || "https://localhost:3000"
            )
        ),
});

// ===== MIDDLEWARE ==== //

app.use(compression());
// should be used in every server we ever create.
// this is a middleware that reduces the size of the responses we send, automatically

app.use(express.static(path.join(__dirname, "..", "client")));
// we are looking in ../client/public

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});
// cookiesession is split into two steps, instead of one app.use call. This is bc we are using it twice.
// Here, we are giving socket access to the cookieSession.
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.json());

app.use(
    express.urlencoded({
        extended: false,
    })
);

/* ====== ROUTES ====== */

app.get("/", (req, res) => {
    if (req.session.time) {
        res.redirect("/listen-now");
    }
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.get("/listen-now/", async (req, res) => {
    const time = req.query.timeNow.replace(",", "");
    const dayOfWeek = new Date().getDay();
    const curHr = new Date(time).getHours();
    let partOfDay;
    if (curHr < 4 && curHr > 21) {
        partOfDay = "night";
    } else if (curHr > 4 && curHr < 12) {
        partOfDay = "morning";
    } else if (curHr > 12 && curHr < 17) {
        partOfDay = "afternoon";
    } else {
        partOfDay = "evening";
    }
    let fuzzFactor = 1;
    let data = await getResultsByTimeOfDay(dayOfWeek, time, fuzzFactor);
    while (data.length < 20) {
        fuzzFactor++;
        console.log("looking again");
        data = await getResultsByTimeOfDay(dayOfWeek, time, fuzzFactor);
    }
    console.log(data.length);
    let resp = {};
    resp.results = await scrape(data);
    const weekDay = week[dayOfWeek - 1];
    resp = {
        ...resp,
        partOfDay,
        weekDay,
    };
    res.json(resp);
});

/* ===== NEVER DELETE OR COMMENT OUT THIS ROUTE ===== */

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

/* SOCKETS */

let onlineUsers = {};
io.on("connection", async (socket) => {
    // we only do sockets when a user is logged in
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const socketUserId = socket.request.session.userId;
    onlineUsers[socket.id] = socketUserId;

    const uniqueIds = Object.values(onlineUsers).filter(function (id, i, self) {
        return self.indexOf(id) == i;
    });

    socket.on("disconnect", () => {
        io.sockets.emit("userLeft", onlineUsers[socket.id]);
        delete onlineUsers[socket.id];
    });
});
