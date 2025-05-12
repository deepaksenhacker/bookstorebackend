import express from "express";
import ProtectedRoute from "../jwt/jwtProtect.js";
import bookmodel from "../db/models/bookmodel.js";
import cloudinary from "../lib/cloudinary.js";

const router  = express.Router();


router.post('/upload-book', ProtectedRoute, async (req, res) => {
    const { bookname, caption, author, image, ratting } = req.body;
    try {
      if (!bookname || !caption || !author || !image || !ratting) {
        return res.status(400).json({ error: "Please fill all the fields" });
      }
  
      const uploadres = await cloudinary.uploader.upload(image, {
        folder: 'booksimages' // Specify the folder name here
      });
      const imageurl = uploadres.secure_url;
      const pub_id = uploadres.public_id;
  
      const book = new bookmodel({
        bookname,
        caption,
        author,
        ratting,
        byuser: req.userId,
        image: imageurl,
        public_id:pub_id
      });
      await book.save();
  
      res.status(201).json({ success: "Book is Uploaded!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  });

// display books


router.get('/books',ProtectedRoute,async(req,res)=>{
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page-1)*limit;
        
        const books =await bookmodel.find().sort({createdAt:-1}).skip(skip).limit(limit).populate('byuser');

        res.status(200).json({books});
    } catch (error) {
        res.status(400).json({error:'Internel Error'});
    }
})

// deleting the book

router.post('/delete/book/:id',ProtectedRoute,async(req,res)=>{
    const id = req.params.id;
    try {
        const existing = await bookmodel.findOne({_id:id,byuser:req.userId});
        if(!existing){
            return res.status(400).json({error:"Book is not found !"});
        }
        try{
            await cloudinary.uploader.destroy(existing.public_id);      
        }catch(error){
            res.status(400).json({error:error});
        }
        await existing.deleteOne();
        res.status(200).json({success:"Deleting Successfully !"});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error});
    }
});


// updating 

router.put('/update/:id',ProtectedRoute,async(req,res)=>{
    const { bookname, caption,ratting } = req.body;
    try {
        if(!bookname || !caption || !ratting){
          return res.status(400).json({error:"Any update not found !"});
        }
        const existingBook = await bookmodel.findById({_id:req.params.id});
        if (!existingBook) {
          return res.status(400).json({error:"Book is not found !"});
          }

        const bname = bookname?bookname:existingBook.bookname;
        const desc = caption?caption:existingBook.caption;
        const rate = ratting?ratting:existingBook.ratting;
        
        await bookmodel.updateOne({_id:existingBook._id},{$set:{bookname:bname,caption:desc,ratting:rate}});
        res.status(200).json({success:`${bookname} Book updated !`});

    } catch (error) {
        res.status(400).json({error:"Internel Problem !"});
        console.log(error);
      }
})


export default router;