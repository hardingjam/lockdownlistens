    CREATE TABLE users(
     id SERIAL PRIMARY KEY,
     first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     bio VARCHAR(255),
     pic_url VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

CREATE TABLE codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships( 
  id SERIAL PRIMARY KEY, 
  sender_id INT REFERENCES users(id) NOT NULL, 
  recipient_id INT REFERENCES users(id) NOT NULL, 
  accepted BOOLEAN DEFAULT false);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id),
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE board_posts(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id),
    post VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO board_posts (sender_id, recipient_id, post) VALUES (4, 1, 'https://ichef.bbci.co.uk/news/976/cpsprodpb/11E09/production/_118052237_redonda3.jpg') RETURNING *;