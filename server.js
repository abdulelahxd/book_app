"use strict";

require("dotenv").config();

const express = require("express");
const superagent = require("superagent");
const ejs = require("ejs");
const pg = require("pg");

const server = express();
const PORT = process.env.PORT || process.env.PORTTWO;
const client = new pg.Client(process.env.DATABASE_URL);

// middleware
server.use(express.static("./public"));
server.set("view engine", "ejs");
server.use(express.urlencoded({ extended: true }));

//////////////////////// HOME PAGE ///////////////////////
server.get("/", (req, res) => {
  let SQL = `SELECT * FROM booksdb;`;
  client.query(SQL).then((data) => {
    res.render("pages/index", { bookInfo: data.rows, counter : data.rowCount });
  });
});

//////////////////// SEARCH PAGE ///////////////////////
server.get("/search/new", (req, res) => {
  res.render("pages/searches/new");
});

//////////////////// VIEW PAGE ///////////////////////
server.post("/searches", (req, res) => {
  // input field
  let input = req.body.inputName;
  let url = "";
  if (req.body.search === "title") {
    url = `https://www.googleapis.com/books/v1/volumes?q=${input}+intitle`;
  }
  else {
    url = `https://www.googleapis.com/books/v1/volumes?q=${input}+inauthor`;
  }
  superagent.get(url).then((bookData) => {
    let bookInfo = bookData.body.items.map((item) => {
      let newObj = new Book(item);
      return newObj;
    });
    res.render("pages/searches/show", { bookDetails: bookInfo });
  });
});

function Book(info) {
  this.thumnail = info.volumeInfo.imageLinks.thumbnail ? info.volumeInfo.imageLinks.thumbnail : "https://i.ytimg.com/vi/uiCm88Me_3U/maxresdefault.jpg";
  this.BookTitle = info.volumeInfo.title ? info.volumeInfo.title : "No Name Avaliable";
  this.ISBN = info.volumeInfo.industryIdentifiers[0].identifier ? info.volumeInfo.industryIdentifiers[0].identifier : "Not Exists";
  this.AuthorName = info.volumeInfo.authors ? info.volumeInfo.authors : "Not Found";
  this.BookDescription = info.volumeInfo.description ? info.volumeInfo.BookDescription : "No Description Found";
  this.Bookshell = info.volumeInfo.categories ? info.volumeInfo.categories : "Not under a class";
}
//////////////////// DETAILS ABOUT BOOK PAGE ///////////////////////
server.get('/books/:id',showMoreDetails);

function showMoreDetails(req,res) {
  let SQL = `SELECT * FROM booksdb WHERE id=$1;`;
  let values = [req.params.id];
  client.query(SQL, values).then( data=>{
    res.render("pages/books/show", { Details : data.rows[0]});
  });
}

//////////////////// ERROR PAGE ///////////////////////
server.get("*", (req, res) => {
  res.render("pages/error");
});

// this is will tell the port to listen to this server I think
client.connect().then(()=>{
  server.listen(PORT, () => {
    console.log(`do not kill me please ${PORT}`);
  });
});