const spicedPg = require("spiced-pg");

const db = spicedPg(
    // left hand side for heroku || right hand side for localhost //
    process.env.DATABASE_URL || "postgres:jharding@localhost/socialnetwork"
);

module.exports.createUser = function (first, last, email, password) {
    const query = `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) returning id;`;
    const params = [first, last, email, password];
    return db.query(query, params);
};
