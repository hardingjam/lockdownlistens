const express = require("express");
const app = express();
const compression = require("compression");
// shrinking files
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const { scrape } = require("./scrape");
const {
    createUser,
    getPassword,
    storeCode,
    checkForEmail,
    checkCode,
    updatePassword,
    fetchUser,
    updateProfPic,
    updateBio,
    fetchNewUsers,
    findMatchingUsers,
    checkFriendStatus,
    makeFriendRequest,
    acceptRequest,
    endFriendship,
    getBegFriends,
    acceptFriend,
    getPublicChat,
    newChatMessage,
    getUsersByIds,
    getBoard,
} = require("./database");
const multer = require("multer");
// handles uploading
const uidSafe = require("uid-safe");
// ???
const { upload } = require("./s3");
// my AWS S3 config
const { s3Url } = require("./config");

const { sendEmail } = require("./ses");
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

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const detectUrls = function (str) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return str.match(urlRegex);
};

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        console.log("cookie exists : ", req.session.userId);
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/password/start", (req, res) => {
    console.log("checking email");
    console.log("req.body:", req.body);
    const { email } = req.body;
    checkForEmail(email)
        .then(({ rows }) => {
            if (rows.length) {
                storeCode(rows[0].email, secretCode).then(({ rows }) => {
                    sendEmail(email, rows[0].code, "Your Wave Password")
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) =>
                            console.log("error sending email: ", err)
                        );
                });
            } else {
                console.log("No rows");
                res.json({ success: false });
            }
        })
        .catch((err) => console.log(err));
});

app.post("/password/verify", (req, res) => {
    console.log("comparing codes");
    const { code, email, password } = req.body;
    console.log(req.body);
    checkCode(email, code)
        .then(({ rows }) => {
            console.log(rows[0]);
            if (rows.length) {
                console.log("correct code");
                hash(password).then((hash) => {
                    updatePassword(hash, email)
                        .then(({ rows }) => {
                            res.json({
                                success: true,
                                name: rows[0].first_name,
                            });
                        })
                        .catch((err) => console.log(err));
                });
            } else {
                console.log("incorrect code");
                res.json({ success: false });
            }
        })
        .catch((err) => console.log(err));
});

app.post("/login", (req, res) => {
    console.log("posted to Login");
    const { email, password } = req.body;
    getPassword(email)
        .then(({ rows }) => {
            if (rows.length) {
                compare(password, rows[0].password).then((match) => {
                    if (match) {
                        req.session.userId = rows[0].id;
                        console.log(
                            "user ID after successful login: ",
                            req.session.userId
                        );
                        res.json({ success: true });
                    } else {
                        console.log("bad password");
                        res.json({ success: false });
                    }
                });
            } else {
                console.log("no email address");
                res.json({ success: false });
            }
        })
        .catch((err) => console.log(err));
});

app.post("/register", async (req, res) => {
    const { first, last, email, password } = req.body;
    try {
        let hashed = await hash(password);
        let newUser = await createUser(first, last, email, hashed);
        req.session.userId = newUser.id;
        res.json({
            success: true,
        });
    } catch (err) {
        console.log("error in async registration: ", err);
    }
});

app.get("/home", async (req, res) => {
    try {
        let data = await fetchUser(req.session.userId);
        res.json(data);
    } catch {
        console.log("error loading homepage");
    }
});

app.post("/upload", uploader.single("file"), upload, async (req, res) => {
    try {
        let data = await updateProfPic(
            s3Url + req.file.filename,
            req.body.userId
        );
        res.json(data);
    } catch (err) {
        console.log(err);
    }
});

app.post("/bio", async (req, res) => {
    try {
        const data = await updateBio(req.session.userId, req.body.draftBio);
        res.json(data);
    } catch (err) {
        console.log(err);
    }
});

app.get("/user/:id/view", async (req, res) => {
    try {
        if (req.params.id == req.session.userId) {
            res.json({ ownProfile: true });
        }
        const data = await fetchUser(req.params.id);

        res.json(data);
        if (!data) {
            console.log("no user exists");
            res.json({ invalid: true });
        }
    } catch (err) {
        console.log("no user exists");
    }
});

app.get("/find/people", async (req, res) => {
    console.log("finding");
    const data = await fetchNewUsers();
    res.json(data);
});

app.get("/find/people/:query", async (req, res) => {
    const data = await findMatchingUsers(req.params.query);
    res.json(data);
});

app.get("/friendship/:friendId", async (req, res) => {
    const targetUser = req.params.friendId;
    const currentUser = req.session.userId;

    const data = await checkFriendStatus(targetUser, currentUser);
    if (!data.length) {
        res.json(data);
    } else {
        res.json([req.session.userId, data]);
    }
});

app.post("/friendship/:friendId/", async (req, res) => {
    const targetUser = req.params.friendId;
    const currentUser = req.session.userId;

    if (req.body.buttonText == "Send Friend Request") {
        try {
            await makeFriendRequest(targetUser, currentUser);
            res.json({ madeRequest: true });
        } catch (err) {
            console.log("error in makeFriendRequest: ", err);
        }
    } else if (req.body.buttonText == "Accept Friend Request") {
        try {
            await acceptRequest(currentUser);
            res.json({ acceptedRequest: true });
        } catch (err) {
            console.log("error in acceptRequest: ", err);
        }
    } else if (
        req.body.buttonText == "End Friendship" ||
        req.body.buttonText == "Cancel Friend Request"
    ) {
        try {
            await endFriendship(targetUser, currentUser);
            res.json({ endedFriendship: true });
        } catch (err) {
            console.log("error in endFriendship:", err);
        }
    }
});

app.get("/beg-friends", async (req, res) => {
    const data = await getBegFriends(req.session.userId);
    res.json(data);
});

app.post("/accept-friend/:id", async (req, res) => {
    const data = await acceptFriend(req.params.id, req.session.userId);
    console.log(data);
    res.json(data);
});

app.post("/unfriend/:id", async (req, res) => {
    const data = await endFriendship(req.session.userId, req.params.id);
    console.log(data);
    res.json(data);
});

app.get("/board/:id", async (req, res) => {
    const data = await getBoard(req.params.id);
    console.log(data);
    scrape(data);
    res.json(data);
});

/* ===== NEVER DELETE OR COMMENT OUT THIS ROUTE ===== */

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

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
    // we only do sockets when a user is logged in
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const socketUserId = socket.request.session.userId;
    onlineUsers[socket.id] = socketUserId;

    const uniqueIds = Object.values(onlineUsers).filter(function (id, i, self) {
        return self.indexOf(id) == i;
    });

    const users = await getUsersByIds(uniqueIds);

    io.sockets.emit("userJoined", users);

    const data = await getPublicChat();
    io.sockets.emit("firstMessages", data);

    socket.on("Sent new message", async (newMessage) => {
        const data = await newChatMessage(socketUserId, newMessage);
        io.sockets.emit("addChatMessage", data);
    });

    socket.on("disconnect", () => {
        io.sockets.emit("userLeft", onlineUsers[socket.id]);
        delete onlineUsers[socket.id];
    });
});
