DROP TABLE IF EXISTS booksdb;

CREATE TABLE IF NOT EXISTS booksdb (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    ISBN VARCHAR(255),
    image_url TEXT,
    description TEXT,
    bookshell VARCHAR(500)
);