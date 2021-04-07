const spicedPg = require("spiced-pg");

const db = spicedPg(
    // left hand side for heroku || right hand side for localhost //
    process.env.DATABASE_URL || "postgres:jharding@localhost/socialnetwork"
);

module.exports.createUser = function (first, last, email, password) {
    const query = `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) returning *;`;
    const params = [first, last, email, password];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
    });
};

module.exports.getPassword = function (email) {
    const query = `SELECT password, id FROM users WHERE email = $1;`;
    const params = [email];
    return db.query(query, params);
};

module.exports.storeCode = function (email, code) {
    const query = `INSERT INTO codes (email, code) VALUES ($1, $2) returning code;`;
    const params = [email, code];
    return db.query(query, params);
};

module.exports.checkForEmail = function (email) {
    const query = `SELECT email FROM users WHERE email = $1;`;
    const params = [email];
    return db.query(query, params);
};

module.exports.checkCode = function (email, code) {
    const query = `SELECT * FROM codes
                 WHERE email = $1
                 AND code = $2
                AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    const params = [email, code];
    return db.query(query, params);
};

module.exports.updatePassword = function (password, email) {
    const query = `UPDATE users
                    SET password = $1
                    WHERE email = $2
                    RETURNING first_name;`;
    const params = [password, email];
    return db.query(query, params);
};

module.exports.fetchUser = function (id) {
    const query = `SELECT * FROM users
                    WHERE id = $1;`;
    const params = [id];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
    });
};

module.exports.updateProfPic = function (picUrl, userId) {
    const query = `UPDATE users 
                    SET pic_url = $1
                    WHERE id = $2
                    RETURNING pic_url;`;
    const params = [picUrl, userId];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
    });
};
