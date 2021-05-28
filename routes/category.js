const express = require("express");
const Router = express.Router();
const mongoose = require('mongoose');

const {check,body ,validationResult } = require('express-validator');
const config = require("config");
const bycrpt = require("bcryptjs");
//Schema
const Category = require("../models/Category");


//for image 
const crypto = require('crypto');
const path = require('path')
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
// const dbConnection =require('../config/db');
const connection =require('../connection');
const { equal } = require("assert");
///////////////////////////////////////

//post Gategory
Router.post( '/',
//  [check('name', 'Name is required ').not().isEmpty()],
    async  (req, res) => {
    //   const error = validationResult(req);
    //   if (!error.isEmpty()) {
    //     return res.status(400).json({ error: error.array() });
    //   }
  
      const {name} = req.body;
  
      try {
          let category = await Category.findOne({ name });
          if (category) {
              res.status(400).json({ error: [{ msg: 'Category is already exists' }] });
          }  
          else{
            category = new Category({
                name: name
              });
              await category.save(); 
    
    
              res.send(category);
              

          }
          //create new category
        
      } catch (err) {
          console.log(err.message);
          res.status(500).send('Server Error');
      }
  }
);  





Router.post('/subGategory/:id', async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const newsub={
        name
    }
    try {
      const category = await Category.findOne({ _id: id });
      if (!category) {
        res.status(400).json({ error: [{ msg: 'Category not exists' }] });
      }
      else{
          
        
        category.sub_category.unshift(newsub);
        await category.save();
        res.send(category);
      }
   
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  });
  





















/////////////

const storage = new GridFsStorage({
    url: "mongodb+srv://omar1234:omar@banoun.lrzmb.mongodb.net/main?retryWrites=true&w=majority",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
})
const upload = multer({ storage });
let gfs;
connection.once('open', () => {
    gfs = Grid(connection.db, mongoose.mongo)
    gfs.collection('uploads')
});






//post api/category/articles/:category_id
//add   sub_category articles

Router.post('/articles/:category_id/:sub_id',upload.single('image'),
[
check('title','Title is required').not().isEmpty(),
check('description','description is required').not().isEmpty(),
// check('image','image is required').not().isEmpty(),

],



async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    

const {title,description}=req.body

const newarticle={
    title,
    description,
 image:req.file
}


    try {
const category=await Category.findOne({_id:req.params.category_id});
if (!category) {
    res.send("Category not exists")
  }
//   const subcateg = await Category.aggregate([
//     {
//        $project: {
//         sub_category: {
//              $filter: {
//                 input: "$sub_category",
//                 as: "item",
//                 cond: { $gte: [ "$$item._id", req.params.sub_id] }
//              }
//           }
//        }
//     }
//  ])


//    const subcateg =await Category.findOne({_id:req.params.category_id}).select({'sub_category':1}).where('sub_category._id').equals(req.params.sub_id)

// const category =await Category.findOne({_id:req.params.category_id});

if(category)

for(i=0;i<category.sub_category.length;i++){

    if(category.sub_category[i]._id==req.params.sub_id){
        category.sub_category[i].articles.push(newarticle)

    }
}




//   console.log(category);
//   console.log(newarticle);
// await subcateg.sub_category[0].articles.push(newarticle);
await category.save(); 
res.json(category);




    }
    
    
    catch (err) {


        console.error(err.message);
        res.status(500).send('Server Error');

        
    }


}

)








//post api/category/book/:category_id
//add   sub_category book

Router.post('/book/:category_id/:book_id',upload.single('image'),
[
check('title','Title is required').not().isEmpty(),
check('description','description is required').not().isEmpty(),
check('link','description is link').not().isEmpty(),

// check('image','image is required').not().isEmpty(),

],



async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    

const {title,description,link}=req.body

const newbook={
    title,
    description,
    link,
 image:req.file
}
try {
const category=await Category.findOne({_id:req.params.category_id});
if (!category) {
    res.send("Category not exists")
  }
for(i=0;i<category.sub_category.length;i++){

    if(category.sub_category[i]._id==req.params.book_id){
        category.sub_category[i].books.push(newbook)
    }
}
await category.save(); 
res.json(category);
    }
    catch (err) {


        console.error(err.message);
        res.status(500).send('Server Error');

        
    }


}

)









module.exports=Router;