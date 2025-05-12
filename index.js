import express from 'express';
import morgan from 'morgan';
import user from './routes/users.js'
import books from './routes/books.js'
import dbConnect from './db/db.js';
dbConnect();
const app =express();

app.use(express.urlencoded({extended:true}))

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/users',user);
app.use('/api/books',books);
app.get('/',(req,res)=>{
    res.send("Service is started")
})

app.listen(3000,()=>{
    console.log('Running On localhost:3000/');
})
