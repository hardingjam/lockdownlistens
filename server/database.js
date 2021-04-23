const spicedPg = require("spiced-pg");

const db = spicedPg(
    // left hand side for heroku || right hand side for localhost //
    process.env.DATABASE_URL || "postgres:jharding@localhost/lockdownlistens"
);

module.exports.initialPopulate = function (timestamp, message, link, tags) {
    console.log("tags going in", tags);
    const query = `INSERT INTO posts (posted_at, message, link, tags)
                    VALUES (TO_TIMESTAMP($1, 'DD/MM/YYYY HH24:MI'), $2, $3, $4) LIMIT 20;`;
    const params = [timestamp, message, link, tags];
    return db.query(query, params).then(({ rows }) => {
        return rows;
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
    console.log("search params:", timeOfDay, dayOfWeek, fuzzFactor);
    const query = `SELECT * FROM posts
                    WHERE EXTRACT(ISODOW FROM posted_at) IN ($1)
                    AND (extract('hour' from posted_at) >=
                    (EXTRACT('hour' from TO_TIMESTAMP($2, 'MM/DD/YYYY HH12:MI:SS PM')) - $3)
                    AND extract('hour' from posted_at) <= 
                    (EXTRACT('hour' from TO_TIMESTAMP($2, 'MM/DD/YYYY HH12:MI:SS PM')) + $3));`;
    const params = [dayOfWeek, timeOfDay, fuzzFactor];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.submitPost = function (link, message, tags) {
    const query = `INSERT INTO posts (link, message, tags)
                    VALUES ($1, $2, $3)
                    RETURNING *`;
    const params = [link, message, tags];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
    });
};
