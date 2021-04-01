const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const { createUser } = require("./database");
const csurf = require("csurf");

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

app.use(
    // express.urlencoded({
    //     extended: false,
    // })
    express.json()
);

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        console.log(req.session.userId);
        console.log("cookie exists");
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

app.post("/register", (req, res) => {
    console.log(req.body);

    const { first, last, email, password } = req.body;
    hash(password).then((hash) => {
        createUser(first, last, email, hash)
            .then(({ rows }) => {
                req.session.userId = rows[0].id;
                console.log(req.session.userId);
                res.json({
                    success: true,
                });
            })
            .catch((err) => console.log("err in db send", err));
    });
});

/* ===== NEVER DELETE OR COMMENT OUT THIS ROUTE ===== */
app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
        // send index.html on every GET request.
    }
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// inside of "./server", we put all our server side code.
// SQL, DB, POST/GET ROUTES ETC.
