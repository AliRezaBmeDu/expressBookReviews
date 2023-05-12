const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const ISBN = req.params.isbn;
    return res.send(books[ISBN])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  console.log(author)
  const result = {}
  const ISBN = Object.keys(books)
  for (let i=0; i<ISBN.length; i++){
      const isbn = ISBN[i]
      
      if ( books[isbn].author === author){
          result[isbn] = books[isbn]
      }
  }
  console.log(result)
  if(Object.keys(result).length > 0){
      return res.send(JSON.stringify(result, null, 4))
  }
  return res.status(404).json({message: "author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  console.log(title)
  const ISBN = Object.keys(books)
  for (let i=0; i<ISBN.length; i++){
      isbn = ISBN[i]
      if ( books[isbn].title === title){
          return res.send(books[isbn])
      }
  }
  return res.status(404).json({message: "title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews)
});

//getting the list of books in the shop using Promise Callback
let bookList =  new Promise((resolve,reject)=>{
    resolve(books);
  })

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  bookList.then(
    (book)=>res.send(JSON.stringify(book, null, 4)),
    (error) => res.send("reqquest rejected")
  );  
});

// getting the book details based on ISBN using Promise Callbacks

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const theBook = books[isbn]
    let bookIsbn = new Promise((resolve,reject) => {
        if(theBook){
            resolve(theBook)
        }else{
            reject("Book not found")
        }
    })
    bookIsbn.then(
        (book)=>res.send(JSON.stringify(book, null, 4)),
        (error) => res.send(error)
    )
 });

//getting the book details based on author using Promise callbacks

public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = []
    let getAuthor = new Promise((resolve,reject)=>{
        const ISBN = Object.keys(books)
        for (let i=0; i<ISBN.length; i++){
                const isbn = ISBN[i]
                if ( books[isbn].author === author){
                    booksByAuthor.push(books[isbn])
                }
            }
        resolve(booksByAuthor)
    })
    getAuthor.then(
    book =>res.send(JSON.stringify(book, null, 4))
  );
});

// getting the book details based on Title using Promise callbacks

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = []
    let getTitle = new Promise((resolve,reject)=>{
        const ISBN = Object.keys(books)
        for (let i=0; i<ISBN.length; i++){
                const isbn = ISBN[i]
                if ( books[isbn].title === title){
                    booksByTitle.push(books[isbn])
                }
            }
        resolve(booksByTitle)
    })
    getTitle.then(
    book =>res.send(JSON.stringify(book, null, 4))
  );
});


module.exports.general = public_users;
