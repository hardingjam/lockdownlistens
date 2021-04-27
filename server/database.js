const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL || "postgres:jharding@localhost/lockdownlistens"
);

const herokudb = spicedPg(
    "postgres://uqbyrenrijufdp:d09af078db1059214ea06a18a2697c9be60cf25504ef6dbca18690b878ec4d63@ec2-54-220-170-192.eu-west-1.compute.amazonaws.com:5432/ddibs9drp11kg9"
);

module.exports.initialPopulate = function (timestamp, message, link, tags) {
    const query = `INSERT INTO posts (posted_at, message, link, tags)
                    VALUES (TO_TIMESTAMP($1, 'DD/MM/YYYY HH24:MI'), $2, $3, $4)
                    ON CONFLICT ON CONSTRAINT posts_link_key
                    DO UPDATE SET votes = posts.votes + 1 WHERE posts.link = $3;`;
    const params = [timestamp, message, link, tags];
    return herokudb.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.setupHeroku = function () {
    const query = `CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(255),
    link VARCHAR(255) NOT NULL UNIQUE,
    tags TEXT [],
    votes INT default 0
    );`;
    return herokudb.query(query).then((data) => {
        return data;
    });
};

module.exports.getResultsByDayOfWeek = function (dayOfWeek) {
    const query = `SELECT * FROM posts
                    WHERE EXTRACT(ISODOW FROM posted_at) IN ($1);`;
    const params = [dayOfWeek];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.getResultsByTimeOfDay = function (
    dayOfWeek,
    timeOfDay,
    fuzzFactor
) {
    const query = `SELECT * FROM posts
                    WHERE EXTRACT(DOW FROM posted_at) IN ($1)
                    AND (extract('hour' from posted_at) >=
                    (EXTRACT('hour' from TO_TIMESTAMP($2, 'MM/DD/YYYY HH12:MI:SS PM')) - $3)
                    AND extract('hour' from posted_at) <= 
                    (EXTRACT('hour' from TO_TIMESTAMP($2, 'MM/DD/YYYY HH12:MI:SS PM')) + $3))
                    ORDER BY RANDOM();`;
    const params = [dayOfWeek, timeOfDay, fuzzFactor];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.submitPost = function (link, message, tags) {
    const query = `INSERT INTO posts (link, message, tags)
                    VALUES ($1, $2, $3)
                    ON CONFLICT ON CONSTRAINT posts_link_key
                    DO UPDATE SET votes = posts.votes + 1 WHERE posts.link = $1
                    RETURNING *;`;
    const params = [link, message, tags];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};
