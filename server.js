"use strict";

// this is for using express library
const express = require("express");
// this is DOTENV (read our enviroment) this is for using dotenv library
require("dotenv").config();
// this will help us to get data from APIs and store them
const superagent = require("superagent");
// this is for the PORT it is sotred in .env file which is hidden online
const PORT = process.env.PORT || process.env.PORTTWO;
// this is for using express library
const server = express();
// this for the public folder and static
server.use(express.static("./public"));
// this is for templating from express server
const ejs = require("ejs");
// middleware
server.set("view engine", "ejs");
server.use(express.urlencoded({ extended: true }));
//////////////////////// HOME PAGE ///////////////////////
server.get("/", (req, res) => {
  res.render("pages/index.ejs");
});

//////////////////// SEARCH PAGE ///////////////////////
server.get("/search/new", (req, res) => {
  res.render("pages/searches/new.ejs");
});

//////////////////// VIEW PAGE ///////////////////////
server.post("/searches", (req, res) => {
    let S1 = req.body.S2;
    let variablle = req.body.inputName;
    if (S1 == 'author'){
      const url = `https://www.googleapis.com/books/v1/volumes?q=${variablle}+inauthor`;
      superagent.get(url).then((bookData) => {
        let bookInfo = bookData.body.items.map((item) => {
          let newObj = new Book(item);
          return newObj;
        });
        res.render("pages/searches/show", { bookDetails : bookInfo});
      });
    } else{
      const url = `https://www.googleapis.com/books/v1/volumes?q=${variablle}+intitle`;
      superagent.get(url).then((bookData) => {
        let bookInfo = bookData.body.items.map((item) => {
          let newObj = new Book(item);
          return newObj;
        });
        res.render("pages/searches/show", { bookDetails : bookInfo});
        // console.log(bookInfo);
      });
    }
});

function Book(info) {
  this.thumnail = info.volumeInfo.imageLinks.thumbnail;
  this.BookTitle = info.volumeInfo.title;
  this.AuthorName = info.volumeInfo.authors;
  this.BookDescription = info.volumeInfo.description;
}
//////////////////// ERROR PAGE ///////////////////////
server.get("*", (req, res) => {
  res.render('pages/error');
});

// this is will tell the port to listen to this server I think
server.listen(PORT, () => {
  console.log(`do not kill me please ${PORT}`);
});
