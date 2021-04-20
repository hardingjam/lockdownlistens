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
    const query = `SELECT first_name, last_name, pic_url, bio, id
                    FROM users
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

module.exports.updateBio = function (id, bio) {
    const query = `UPDATE users
                    SET bio = $2
                    WHERE id = $1
                    RETURNING bio;`;
    const params = [id, bio];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
    });
};

module.exports.fetchNewUsers = function () {
    const query = `SELECT first_name, last_name, bio, pic_url, id 
                    FROM users ORDER BY id DESC LIMIT 3;`;
    return db.query(query).then(({ rows }) => {
        return rows;
    });
};

module.exports.findMatchingUsers = function (search) {
    const query = `SELECT first_name, last_name, bio, pic_url, id
                    FROM users 
                    WHERE CONCAT(first_name, last_name) ILIKE $1;`;
    const params = [search + "%"];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.checkFriendStatus = function (targetUser, currentUser) {
    const query = `SELECT * FROM friendships
                    WHERE (recipient_id = $1 AND sender_id = $2) 
                    OR (recipient_id = $2 AND sender_id = $1);`;
    const params = [targetUser, currentUser];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.makeFriendRequest = function (targetUser, currentUser) {
    const query = `INSERT INTO friendships (recipient_id, sender_id)
                    VALUES ($1, $2)
                    RETURNING sender_id;`;
    const params = [targetUser, currentUser];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.acceptRequest = function (currentUser) {
    const query = `UPDATE friendships
                    SET accepted = true
                    WHERE recipient_id = $1
                    RETURNING accepted;`;
    const params = [currentUser];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.endFriendship = function (currentUser, targetUser) {
    const query = `DELETE FROM friendships
                    WHERE (recipient_id = $1 AND sender_id = $2) 
                    OR (recipient_id = $2 AND sender_id = $1)
                    RETURNING sender_id;`;
    const params = [currentUser, targetUser];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
        // DID THIS BREAK THE CANCEL REQUEST FUNCTION?
    });
};

module.exports.getBegFriends = function (id) {
    const query = `SELECT users.id, first_name, last_name, pic_url, bio, accepted
                    FROM friendships
                    JOIN users
                    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
                    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
                    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [id];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.acceptFriend = function (senderId, recipientId) {
    const query = `UPDATE friendships
                    SET accepted = true
                    WHERE sender_id = $1
                    AND recipient_id = $2
                    RETURNING sender_id;`;
    const params = [senderId, recipientId];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
    });
};

module.exports.getPublicChat = function () {
    const query = `SELECT messages.id, messages.sender_id, messages.message, first_name, last_name, pic_url 
                    FROM users
                    JOIN messages ON (messages.sender_id = users.id)
                    ORDER BY messages.id DESC LIMIT 10;`;
    return db.query(query).then(({ rows }) => {
        return rows;
    });
};

module.exports.newChatMessage = function (senderId, message) {
    const query = `WITH inserted AS (
                    INSERT INTO messages (sender_id, message) 
                    VALUES ($1, $2) 
                    RETURNING id, sender_id, message)
                    SELECT inserted.*, users.first_name, users.last_name, users.pic_url
                    FROM inserted
                    INNER JOIN users ON inserted.sender_id = users.id;`;
    const params = [senderId, message];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
    });
};

module.exports.getUsersByIds = function (arrayOfIds) {
    const query = `SELECT id, first_name, last_name, pic_url FROM users WHERE id = ANY($1)`;
    const params = [arrayOfIds];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.getBoard = function (userId) {
    const query = `SELECT users.first_name, users.last_name, users.pic_url,
                    board_posts.post, board_posts.id, board_posts.created_at, board_posts.sender_id
                    FROM board_posts
                    JOIN users ON (users.id = board_posts.sender_id)
                    WHERE board_posts.recipient_id = $1
                    ORDER BY board_posts.id DESC LIMIT 10;`;
    const params = [userId];
    return db.query(query, params).then(({ rows }) => {
        return rows;
    });
};

module.exports.addPost = function (post, userId, recipientId) {
    const query = `WITH inserted AS (
                    INSERT INTO board_posts (post, sender_id, recipient_id)
                    VALUES ($1, $2, $3) 
                    RETURNING *)
                    SELECT inserted.*, users.first_name, users.last_name, users.pic_url
                    FROM inserted
                    INNER JOIN users ON inserted.sender_id = users.id;`;
    const params = [post, userId, recipientId];
    return db.query(query, params).then(({ rows }) => {
        return rows[0];
    });
};
