const express = require("express");
const Router = express.Router();
const {check,body ,validationResult } = require('express-validator');
const config = require("config");
const bycrpt = require("bcryptjs");
//Schema
const Category = require("../models/Category");

const mongoose = require('mongoose');

//for image 
const crypto = require('crypto');
const path = require('path')
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
// const dbConnection =require('../config/db');
const connection =require('../connection')
///////////////////////////////////////

//post Gategory
Router.post('/')




























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

Router.post('/articles/:category_id',upload.single('image'),[
     check('title','Title is required').not().isEmpty(),
check('description','description is required').not().isEmpty(),
check('image','image is required').not().isEmpty(),

],async(req,res)=>{
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
const category=await Category.findOne({_id:req.params.category_id})

        category.sub_category.articles.unshift(newarticle);
        await category.save();
        res.jsonca(category)
        
    } catch (error) {


        console.error(err.message);
        res.status(500).send('Server Error');

        
    }


}




)




module.exports=Router;