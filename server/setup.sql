

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sender_id INT REFERENCES users(id),
    message VARCHAR(255),
    link VARCHAR(255) NOT NULL UNIQUE,
    tags TEXT [],
    votes INT default 0
);

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS codes;
DROP TABLE IF EXISTS posts;

EXTRACT('hour' from TO_TIMESTAMP('4/23/2021 5:16:09 PM', 'MM/DD/YYYY HH12:MI:SS PM'))



        "date": "26/03/2020",
        "time": "08:22",
        "user": "Alex Rennie",
        "message": "#vintagecheddar",
        "links": [
            "https://soundcloud.com/dj-andy-spencer/classic-positiva-records-mix-vol-1"
        ],
        "hashtags": ["#vintagecheddar"]
    },

-- CREATE TABLE messages(
--     id SERIAL PRIMARY KEY,
--     sender_id INT REFERENCES users(id) NOT NULL,
--     recipient_id INT REFERENCES users(id),
--     message VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


SELECT COUNT(*) FROM posts
WHERE EXTRACT(ISODOW FROM posted_at) IN (5)
AND (extract('hour' from posted_at) >=
(EXTRACT('hour' from TO_TIMESTAMP('4/23/2021 5:53:00 PM', 'MM/DD/YYYY HH12:MI:SS PM')) - 2)
AND extract('hour' from posted_at) <= 
(EXTRACT('hour' from TO_TIMESTAMP('4/23/2021 5:53:00 PM', 'MM/DD/YYYY HH12:MI:SS PM')) + 2));

INSERT INTO posts (posted_at, message, link, tags)
VALUES (TO_TIMESTAMP($1, 'DD/MM/YYYY HH24:MI'), $2, $3, $4)
ON CONFLICT ON CONSTRAINT posts_link_key
DO UPDATE SET votes = votes + 1 WHERE link = $3;