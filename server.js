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
// const { search } = require("superagent");
server.set("view engine", "ejs");
server.use(express.urlencoded({ extended: true }));
//////////////////////// ROUTES ///////////////////////
server.get("/", (req, res) => {
  res.send("Hello there!");
});

//////////////////// ROUTE ONE ///////////////////////
server.get("/index", (req, res) => {
  res.render("pages/index.ejs");
});

//////////////////// ROUTE TWO ///////////////////////
server.get("/search/new", (req, res) => {
  res.render("pages/searches/new.ejs");
});

//////////////////// ROUTE THREE ///////////////////////
server.post("/searches", (req, res) => {
    let S1 = req.body.S2;
    let variablle = req.body.mmd;
    if (S1 == 'Author'){
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
        console.log(bookInfo);
      });
    }
});

let bookAll = [];
function Book(info) {
  this.thumnail = info.volumeInfo.imageLinks.thumbnail;
  this.BookTitle = info.volumeInfo.title;
  this.AuthorName = info.volumeInfo.authors;
  this.BookDescription = info.volumeInfo.description;
  bookAll.push(this);
}


// catch errors
server.get("*", (req, res) => {
  res.status(404).send("the page is not found");
});

// this is will tell the port to listen to this server I think
server.listen(PORT, () => {
  console.log(`do not kill me please ${PORT}`);
});
