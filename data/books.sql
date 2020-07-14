DROP TABLE IF EXISTS booksdb;

CREATE TABLE IF NOT EXISTS booksdb (
    id SERIAL PRIMARY KEY,
    author VARCHAR(500),
    title VARCHAR(500),
    ISBN VARCHAR(500),
    image_url TEXT,
    description TEXT,
    bookshell VARCHAR(500)
);