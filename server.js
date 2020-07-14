"use strict";

require("dotenv").config();

const express = require("express");
const superagent = require("superagent");
const ejs = require("ejs");
const pg = require("pg");
const methodOverride = require('method-override');

const server = express();
const PORT = process.env.PORT || 3030;
const client = new pg.Client(process.env.DATABASE_URL);
// middleware
server.use(express.static("./public"));
server.set("view engine", "ejs");
server.use(express.urlencoded({ extended: true }));
// for delete and update
server.use(methodOverride('_method'));
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
    res.render("pages/books/detail", { Details : data.rows[0]});
  });
}

server.post('/books',addToDB);
function addToDB(req, res){

  const item = req.body;
  let SQL = `INSERT INTO booksdb (author, title, ISBN, image_url, description, bookshell) VALUES($1, $2, $3, $4, $5, $6);`
  let SQL2 = `SELECT * FROM booksdb;`;
  const safeValues = [item.author, item.bookTitle, item.ISBN, item.thumnail, item.description, item.bookshell];
  client.query(SQL, safeValues)
  .then( data=>{
    client.query(SQL2).then(data2=>{
      res.render("pages/books/show", { Details : data2.rows[data2.rows.length-1]});
    });
  });
}

server.get('/show', storedBookShow);

function storedBookShow(req, res) {
    res.render('pages/books/show');
}

server.get('/deleteItem/:id', deletBook)

function deletBook(req, res) {
  const bookId = req.params.id;
  let SQL = `DELETE FROM booksdb WHERE id=${bookId}`
  client.query(SQL)
  .then( data=>{
    res.redirect("/");
  });
}
//////////////////////UPDATE/////////////////////////
server.put('/updateItem/:id', updateBook)

function updateBook(req, res) {
  let {author, bookTitle, ISBN, thumnail, description, bookshell} = req.body;
  let SQL = `UPDATE booksdb SET author=$1, title=$2, ISBN=$3, image_url=$4, description=$5, bookshell=$6;`;
  let safeValues = [author, bookTitle, ISBN, thumnail, description, bookshell];

  client.query(SQL,safeValues)
  .then( data=>{
    res.redirect("/");
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