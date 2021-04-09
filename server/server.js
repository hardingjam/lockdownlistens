const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
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
} = require("./database");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { upload } = require("./s3");
const { s3Url } = require("./config");

const { sendEmail } = require("./ses");
// to, body, subject

const csurf = require("csurf");

const cryptoRandomString = require("crypto-random-string");

const secretCode = cryptoRandomString({
    length: 6,
});

// ===== MIDDLEWARE ==== //

app.use(compression());
// should be used in every server we ever create.
// this is a middleware that reduces the size of the responses we send, automatically

app.use(express.static(path.join(__dirname, "..", "client", "public")));
// we are looking in ../client/public

app.use(
    cookieSession({
        secret: "I love you",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

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
        console.log(req.params.id);
        if (req.params.id == req.session.userId) {
            res.json({ ownProfile: true });
        }
        const data = await fetchUser(req.params.id);
        console.log(data);
        res.json(data);
        if (!data) {
            console.log("no user exists");
            res.json({ invalid: true });
        }
    } catch (err) {
        console.log("no user exists");
    }
});

/* ===== NEVER DELETE OR COMMENT OUT THIS ROUTE ===== */
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// inside of "./server", we put all our server side code.
// SQL, DB, POST/GET ROUTES ETC.
