const express = require("express");
const app = express();
const compression = require("compression");

const path = require("path");
const cookieSession = require("cookie-session");

const { scrape } = require("./scrape");

const { v4: uuidv4 } = require("uuid");
const {
    getResultsByTimeOfDay,
    submitPost,
    getResultsBySearch,
} = require("./database");

const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const csurf = require("csurf");

// creating the initial handshake between socket and our server (cannot use Express for this)
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith(
                "https://lockdownlistens.herokuapp.com/"
            ) || req.headers.referer.startsWith("http://localhost:3000/")
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

// Only use this in production:

// app.use((req, res, next) => {
//     if (req.headers["x-forwarded-proto"].startsWith("https")) {
//         return next();
//     }
//     return res.redirect(`https://${req.hostname}${req.url}`);
// });

/* ====== ROUTES ====== */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.post("/timezone/", (req, res) => {
    req.body;
    req.session.tz = req.body.timezone;
    req.session.userId = uuidv4();
    "userId", req.session.userId;
    res.json({ success: true });
});

app.get("/listen-now", (req, res) => {
    "tz in listen now:", req.session.tz;
    if (!req.session.tz) {
        res.redirect("/");
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

app.get("/api/search/", async (req, res) => {
    const { day, time } = req.query;
    day, time;
    let dayRange = [0, 2];
    if (day == "Weds-Thurs") {
        dayRange = [3, 4];
    } else if (day == "Fri-Sat") {
        dayRange = [5, 6];
    }
    let hourRange = [4, 12];
    if (time == "Afternoon") {
        hourRange = [12, 17];
    }
    if (time == "Evening") {
        hourRange = [17, 18];
    }
    if (time == "Night") {
        hourRange = [17, 24];
    }

    const data = await getResultsBySearch(dayRange, hourRange);
    const resp = await scrape(data);
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
    req.session.tz;
    if (!req.session.tz) {
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

server.listen(process.env.PORT || 3001, function () {
    ("I'm listening.");
});

/* SOCKETS */

let rooms = {};
let onlineUsers = {};

io.on("connection", async (socket) => {
    onlineUsers[socket.id] = socket.id;
    // to individual socketid (private message)
    io.to(socket.id).emit("your socket", socket.id);
    console.log("new socket:", socket.id);

    socket.on("createRoom", (data) => {
        const { roomName, userName, playerUrl } = data;
        if (rooms[roomName]) {
            ("room already exisits");
            // emit a roomExists, or a noRoomExists depending on the outcome.
            return io.to(socket.id).emit("room exists");
        }
        console.log("room created:", roomName, "userName", userName);
        rooms[roomName] = {
            roomName,
            playerUrl,
            host: socket.id,
            users: [
                {
                    id: socket.id,
                    name: userName,
                    admin: true,
                    icon: "🍸",
                },
            ],
        };
        // include a display name here.
        socket.join(roomName);
        console.log(Object.keys(rooms));
        io.to(roomName).emit("new room member", rooms[roomName]);
    });

    socket.on("hostProgress", (data) => {
        const { progress, roomName } = data;
        rooms[roomName] = {
            ...rooms[roomName],
            hostProgress: progress,
        };
    });

    socket.on("syncWithHost", (roomName) => {
        roomName;
        io.to(socket.id).emit("sync with host", rooms[roomName].hostProgress);
    });

    socket.on("joinRoom", (data) => {
        const { roomName, userName } = data;
        if (!rooms[roomName]) {
            ("room does not exist, you can create it");
            return io.to(socket.id).emit("no such room");
        }
        rooms[roomName];

        rooms[roomName] = {
            ...rooms[roomName],
            users: [
                ...rooms[roomName].users,
                { id: socket.id, name: userName, icon: "🍸" },
            ],
        };
        socket.join(roomName);

        io.to(socket.id).emit("update playerUrl", rooms[roomName].playerUrl);
        io.to(roomName).emit("new room member", rooms[roomName]);
    });

    socket.on("updateUrl", (data) => {
        const { playerUrl, roomName } = data;
        rooms[roomName] = {
            ...rooms[roomName],
            playerUrl: playerUrl,
        };
        io.to(roomName).emit("update playerUrl", playerUrl);
    });

    socket.on("toggleReady", (data) => {
        "data.myRoom:", data.myRoom;
        "socket-side room", rooms[data.myRoom.roomName];
        // rooms[data.myRoom.roomName] = data.myRoom;
        // write a function here to update the server-side
        io.to(data.myRoom.roomName).emit("ready or not", data.activeUser);
    });

    socket.on("playForAll", (data) => {
        "playing in:", data;
        rooms[data.roomName];
        io.to(data.roomName).emit("play for all");
    });

    socket.on("setUserIcon", (data) => {
        console.log("new icon:", data);
        const { roomName, activeUser, userIcon } = data;
        rooms[roomName] = {
            ...rooms[roomName],
            users: rooms[roomName].users.map((user) => {
                if (user.id == activeUser) {
                    return {
                        ...user,
                        icon: userIcon,
                    };
                } else {
                    return user;
                }
            }),
        };
        io.to(roomName).emit("user updated icon", rooms[roomName]);
    });

    socket.on("hostPaused", (roomName) => {
        rooms[roomName] = {
            ...rooms[roomName],
            hostPlaying: false,
        };
        io.to(roomName).emit("host toggled playing", rooms[roomName]);
    });

    socket.on("hostPlayed", (roomName) => {
        rooms[roomName] = {
            ...rooms[roomName],
            hostPlaying: true,
        };
        io.to(roomName).emit("host toggled playing", rooms[roomName]);
    });

    socket.on("disconnect", () => {
        Object.values(rooms).forEach((room) => {
            if (room.users.length) {
                room.users = room.users.filter((user) => user.id !== socket.id);
            }
        });
        rooms;
        io.emit("userleft", onlineUsers[socket.id]);
        delete onlineUsers[socket.id];
    });
});
