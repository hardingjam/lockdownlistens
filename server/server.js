const express = require("express");
const app = express();
const compression = require("compression");

const path = require("path");
const cookieSession = require("cookie-session");

const { scrape } = require("./scrape");

// const { v4: uuidv4 } = require("uuid");
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

app.use(express.static(path.join(__dirname, "..", "client")));

const cookieSessionMiddleware = cookieSession({
    secret: `Don't tell a soul.`,
    maxAge: 1000 * 60 * 60 * 24,
});

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
    req.session.tz = req.body.timezone;
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
    if (curHr > 20 && curHr <= 23) {
        partOfDay = "night";
    }
    if (curHr >= 0 && curHr <= 4) {
        partOfDay = "night";
    } else if (curHr > 4 && curHr < 12) {
        partOfDay = "morning";
    } else if (curHr >= 12 && curHr <= 17) {
        partOfDay = "afternoon";
    } else {
        partOfDay = "evening";
    }
    console.log(curHr, partOfDay);
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
    console.log("searching");
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

    io.to(socket.id).emit("your socket", socket.id);
    // console.log("new socket:", socket.id);

    socket.on("createOrJoinRoom", (data) => {
        const { roomName, userName, playerUrl } = data;
        if (rooms[roomName]) {
            console.log("room already exisits");
            rooms[roomName] = {
                ...rooms[roomName],
                users: [
                    ...rooms[roomName].users,
                    { id: socket.id, name: userName, icon: "🍸" },
                ],
            };
            socket.join(roomName);

            io.to(socket.id).emit(
                "update playerUrl",
                rooms[roomName].playerUrl
            );

            io.to(socket.id).emit(
                "sync with host",
                rooms[roomName].hostProgress
            );

            io.to(roomName).emit("new room member", rooms[roomName]);
        } else {
            console.log("room created:", roomName, "userName", userName);
            rooms[roomName] = {
                roomName,
                playerUrl,
                host: socket.id,
                hostName: userName,
                messages: [],
                users: [
                    {
                        id: socket.id,
                        name: userName,
                        icon: "🍸",
                    },
                ],
            };
            socket.join(roomName);
            io.to(roomName).emit("new room member", rooms[roomName]);
        }
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
            // if the room does not exist, create it here.

            return io.to(socket.id).emit("no such room");
        }

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
        console.log("updating playerURL");
        const { playerUrl, roomName } = data;
        rooms[roomName] = {
            ...rooms[roomName],
            playerUrl: playerUrl,
        };
        console.log(rooms[roomName]);
        io.to(roomName).emit("update playerUrl", playerUrl);
    });

    socket.on("newChatMessage", (data) => {
        const { roomName, user, message } = data;
        rooms[roomName] = {
            ...rooms[roomName],
            messages: [...rooms[roomName].messages, { user, message }],
        };
        io.to(roomName).emit("new chat message", { user, message });
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

    // socket.on("hostPaused", (roomName) => {
    //     rooms[roomName] = {
    //         ...rooms[roomName],
    //         hostPlaying: false,
    //     };
    //     io.to(roomName).emit("host toggled playing", rooms[roomName]);
    // });

    // socket.on("hostPlayed", (roomName) => {
    //     rooms[roomName] = {
    //         ...rooms[roomName],
    //         hostPlaying: true,
    //     };
    //     io.to(roomName).emit("host toggled playing", rooms[roomName]);
    // });

    socket.on("roomChanged", (data) => {
        rooms[data.roomName] = data;
    });

    socket.on("disconnect", () => {
        console.log("Scocket is connecting");
        // console.log(rooms);
        // This function only runs properly if room.host is updated in sockets object.
        Object.values(rooms).forEach((room) => {
            if (room.host === socket.id) {
                io.to(room.roomName).emit(
                    "host left the room",
                    room.roomName,
                    socket.id
                );
            }
            if (room.users.length) {
                room.users = room.users.filter((user) => user.id !== socket.id);
            }
        });
        io.emit("user left", onlineUsers[socket.id]);
    });
});
