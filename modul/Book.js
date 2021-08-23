'use strict';
const mongoose = require('mongoose');

// create schema
const Book = new mongoose.Schema({
    title: String,
    description: String,
    email: String,
});

const bookModel = mongoose.model('Book', Book);



module.exports = bookModel;