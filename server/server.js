const express = require("express");
const app = express();
const compression = require("compression");
// shrinking files
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const { scrape } = require("./scrape");
const uidSafe = require("uid-safe");
const { v4: uuidv4 } = require("uuid");
const { getResultsByTimeOfDay, submitPost } = require("./database");

// ???
const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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
    maxAge: 1000 * 60 * 60 * 24,
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
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.post("/timezone/", (req, res) => {
    req.session.userId = uuidv4();
    console.log(req.session.userId);
    res.json({ success: true });
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.get("/api/listen-now/", async (req, res) => {
    const time = req.query.timeNow.replace(",", "");
    const dayOfWeek = new Date(time).getUTCDay();
    const curHr = new Date(time).getHours();
    let partOfDay;
    if (curHr < 4 && curHr > 21) {
        partOfDay = "night";
    } else if (curHr > 4 && curHr < 12) {
        partOfDay = "morning";
    } else if (curHr >= 12 && curHr < 17) {
        partOfDay = "afternoon";
    } else {
        partOfDay = "evening";
    }
    let fuzzFactor = 1;
    let data = await getResultsByTimeOfDay(dayOfWeek, time, fuzzFactor);
    while (data.length < 15) {
        fuzzFactor++;
        data = await getResultsByTimeOfDay(dayOfWeek, time, fuzzFactor);
    }
    let resp = {};
    resp.results = await scrape(data);
    const weekDay = week[dayOfWeek];
    resp = {
        ...resp,
        partOfDay,
        weekDay,
    };
    res.json(resp);
});

app.post("/submit/", async (req, res) => {
    const { link, message, tags } = req.body;
    const data = await submitPost(link, message, tags);
    const resp = await scrape(data);
    res.json(resp);
});

/* ===== NEVER DELETE OR COMMENT OUT THIS ROUTE ===== */

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

/* SOCKETS */

let onlineUsers = {};

io.on("connection", async (socket) => {
    const socketUserId = socket.request.session.userId;
    console.log("socketUserId", socketUserId);
    onlineUsers[socket.id] = socketUserId;

    io.sockets.emit("userJoined", onlineUsers);

    socket.on("joinRoom", (roomName) => {
        console.log("joining room", roomName);
        socket.join(roomName);
        // do i need the callback here in order to see who's in the room?
    });

    // socket.on("toggleReady", ({ user, room, isReady }) => {
    //     const payload = {
    //         user,
    //         room,
    //         isReady,
    //     };
    //     socket.to(room).emit("readyOrNot", payload);
    // });

    socket.on("disconnect", () => {
        io.sockets.emit("userLeft", onlineUsers[socket.id]);
        delete onlineUsers[socket.id];
    });
});
