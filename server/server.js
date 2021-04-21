const express = require("express");
const app = express();
const compression = require("compression");
// shrinking files
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const { scrape } = require("./scrape");

const uidSafe = require("uid-safe");
// ???

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

app.use(express.static(path.join(__dirname, "..", "client", "public")));
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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

/* ===== NEVER DELETE OR COMMENT OUT THIS ROUTE ===== */

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/");
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
