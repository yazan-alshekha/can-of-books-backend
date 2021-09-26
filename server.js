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
mongoose.connect(process.env.mongo_link_globally, { useNewUrlParser: true });

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
    title: "green ",
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


app.get('/seadData',(req,res)=>{
  seadDataCollection() ;
  console.log('sead data are done ');
  res.send('done');
})


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
 function getAllData(ownerName) {
  // let BooksArr = [];
  return BookModel.find({ email: ownerName }, (err, user) => {
    if (err)
      console.log(err);
    else {
      // console.log(user,'user data');
      return user;
    }
  })

}


// getAllData('samsung.sh9955@gmail.com').then(data => console.log(data));


async function addingBookHandler(req, res) {
  console.log("addBook");

  let { bookTitlename, description, ownerName, availability } = req.body;
  console.log(bookTitlename, description, ownerName, availability);
  await BookModel.create({ title: bookTitlename, description, email: ownerName, availability });

  let userData= await getAllData(ownerName);
    console.log(userData,'create  api');
    res.json(userData);
}


function deleteBookHandler(req, res) {
  let ownerName = req.query.ownerName;
  let id = req.params.id;
  // console.log(id,ownerName1);
  BookModel.findByIdAndDelete( id ,async (err, bookData) => {
    if (err) {
      console.log('error in deleting data');
      res.status(500).send("an error occured");
    }
    // let catsList= await BookModel.find({email: ownerName});
    let userData= await getAllData(ownerName);
    console.log(userData,'delete api');
    res.json(userData);

  });

}

// const deleteCatController=  (req,res)=>{
//   let id=req.params.id;
//   catModel.findByIdAndDelete(id,async (err,data)=>{
//       if(err){
//           res.status(500).send("an error occured");
//       }
//       let catsList= await catModel.find({});
//       res.json(catsList);
         
//   })
// }





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
  let userData= await getAllData(email);
    console.log(userData,'update api');
    res.json(userData);
}


