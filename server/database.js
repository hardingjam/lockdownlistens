const spicedPg = require("spiced-pg");

const db = spicedPg(
    // left hand side for heroku || right hand side for localhost //
    process.env.DATABASE_URL || "postgres:jharding@localhost/lockdownlistens"
);

module.exports.initialPopulate = function (timestamp, message, link, tags) {
    console.log("tags going in", tags);
    const query = `INSERT INTO posts (posted_at, message, link, tags)
                    VALUES (TO_TIMESTAMP($1, 'DD/MM/YYYY HH24:MI'), $2, $3, $4);`;
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
