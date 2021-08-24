'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();
app.use(cors());

const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// import model
const BookModel = require('./modul/Book.js');


// connect to dataBase
mongoose.connect("mongodb://localhost:27017/BookDataBase", { useNewUrlParser: true });




function seadDataCollection() {
  // title: String,
  // description: String,
  // email: String,
  let data1 = new BookModel({
    email: "yazan.alshekha@outlook.com",
    title: "the another life",
    description: "knsdkfnskfnslfsfjjgknfbnb"
  });

  let data2 = new BookModel({
    email: "yazan@ltuc.com",
    title: "the another life",
    description: "knsdkfnskfnslfsfjjgknfbnb"
  });

  let data3 = new BookModel({
    email: "yazan@ltuc.com",
    title: "the another life",
    description: "knsdkfnskfnslfsfjjgknfbnb"
  });

  data1.save();
  data2.save();
  data3.save();

}
//use  npm start just to sead data one time to dataBase 
//  seadDataCollection() 



app.get('/test', (request, response) => {

  // TODO: 
  // STEP 1: get the jwt from the headers
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
  // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end

})


app.get('/book', getBookData);

function getBookData(req, res) {
  let userName = req.query.userName;
  console.log(userName);
  BookModel.find({ email: userName }, (err, user) => {
    if (err)
      console.log(err);
    else
      res.send(user);
  });

}
