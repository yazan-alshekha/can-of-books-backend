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

// Middleware (to parse the request body)
app.use(express.json());


// import model
const BookModel = require('./modul/Book.js');


// connect to dataBase
mongoose.connect(process.env.mongo_link, { useNewUrlParser: true });

// api routes
app.get('/book', getBookData);
app.post('/addBook', addingBookHandler);
app.delete('/deleteBook/:id', deleteBookHandler);
app.put('/update', updateBook);



function seadDataCollection() {
  // title: String,
  // description: String,
  // email: String,
  let data1 = new BookModel({
    email: "yazan.alshekha@outlook.com",
    title: "the another life",
    description: "knsdkfnskfnslfsfjjgknfbnb",
    availability: "unavailable",
  });

  let data2 = new BookModel({
    email: "samsung.sh9955@gmail.com",
    title: "green land",
    description: "knsdkfnskfnslfsfjjgknfbnb",
    availability: "available",
  });

  let data3 = new BookModel({
    email: "samsung.sh9955@gmail.com",
    title: "the another life",
    description: "knsdkfnskfnslfsfjjgknfbnb",
    availability: "available",
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
  response.send('test')
})


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

// helper function 
async function getAllData(ownerName) {
  let BooksArr = [];
  await BookModel.find({email:ownerName}, (err, user) => {
    if (err)
      console.log(err);
    else {
      BooksArr=user;
    }
  });

  return BooksArr;
}


// getAllData('samsung.sh9955@gmail.com').then(data => console.log(data));


async function addingBookHandler(req, res) {
  console.log("addBook");

  let { bookTitlename, description, ownerName, availability } = req.body;
  console.log(bookTitlename, description, ownerName, availability);
  await BookModel.create({ title: bookTitlename, description, email: ownerName, availability });

  // let data = await getAllData(ownerName);

  // BookModel.find({ email: ownerName }, (err, user) => {
  //   if (err)
  //     console.log(err);
  //   else
  //     res.send(user);
  // });
  getAllData(ownerName).then((data)=> res.send(data));
}


function deleteBookHandler(req, res) {
  let ownerName1 = req.query.ownerName;
  let id = req.params.id;
  // console.log(id,ownerName1);
  BookModel.remove({ _id: id }, (err, bookData) => {
    if (err) {
      console.log('error in deleting data');
    }
    else {
      // BookModel.find({ email: ownerName1 }, (err, bookData) => {
      //   res.send(bookData);
      // });
      getAllData(ownerName1).then((data)=> res.send(data));
    }

  });

}

async function updateBook(req, res) {
  let { id, title, description, email, availability } = req.body;

  await BookModel.findByIdAndUpdate(id, { title, description, availability }, (err, bookData) => {
    if (err) {
      console.log(err);
    }
  });

  // BookModel.find({ email }, (err, books) => {
  //   if (err)
  //     console.log('error in get data (updateBook function)');
  //   else
  //     res.send(books);
  // });
  getAllData(email).then((data)=> res.send(data));
}


