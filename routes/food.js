const express = require('express');
const router = express.Router();
const Food = require('../Model/food');
const cloudinary = require('../middlewares/cloudinary');
const upload = require('../middlewares/multer');
const isAdmin = require('../middlewares/isAdmin')
const isAuth = require('../middlewares/isAuth');
const food = require('../Model/food');


router.post("/add-food",upload.single("image"), async (req,res)=> {
try {
    var result = await cloudinary.uploader.upload (req.file.path);
    var newFood=  new food ({
        name:req.body.name,
        price:req.body.price,
        category: req.body.category,
        profile_img: result.secure_url,
        cloudinary_id: result.public_id,
    })
    console.log(newFood)
    await newFood.save()
    res.status(200).send({msg:"food added",newFood})
} catch (error) {
 res.status(400).send({msg:"food not added",error:error,})
}
})

router.get("/get-foods",[isAdmin],async (req,res)=>{
    try {
        const foods = await Food.find({})
        res.status(200).send({foods})
    } catch (error) {
        res.status(400).send({error})
    }
})

router.get("/allfood", async (req,res)=>{
    try {
        const listfood = await Food.find()
        res.status(200).send({msg:"list of foods",listfood})
  
    } catch (error) {
        res.status(400).send({msg :"food not found",error})
    }
})

router.put("/:id",[isAuth,isAdmin],upload.single("image"),async (req,res)=>{
    try {
        let food = await Food.findById(req.params.id)
     if(!food){
        res.status(404).send({error:"food not found"})
     }
     if(food.cloudinary_id){
        await cloudinary.uploader.destroy(food.cloudinary_id)
     }
     let result;
     if(req.file){
        if(food.cloudinary_id){
            await cloudinary.uploader.destroy(food.cloudinary_id)
        }
        result = await cloudinary.uploader.upload (req.file.path);
     }
     const data={
         name:req.body.name || food.name,
         price:req.body.price || food.price,
         category: req.body.category || food.category,
         profile_img: result ? result.secure_url : food.profile_img,
         cloudinary_id: result ? result.public_id : food.cloudinary_id,
     }
     const updatefood= await Food.findByIdAndUpdate(req.params.id,data, { new: true });     res.status(200).send({msg:"food updated",food})
    res.status(200).send({msg:"food updated",food})
    
    } catch (error) {
        res.status(400).send({msg:"food not updated",error})
    }
})

router.delete("/:id",[isAuth,isAdmin],async (req,res)=>{
    try {
        let food = await Food.findById(req.params.id)
        if(!food){
            res.status(404).send({error:"food not found"})
        }
        if(food.cloudinary_id){
            await cloudinary.uploader.destroy(food.cloudinary_id)
        }
        await food.deleteOne()
        res.status(200).send({msg:"food deleted"})
    } catch (error) {
        res.status(400).send({error})
    }
})

router.get("/:id",async (req,res)=>{
    try {
const foodToGet=await Food.findOne({_id:req.params.id})
res.status(200).send({msg:"food found",foodToGet})

} catch (error) {
    res.status(400).send({msg:"food not found",error})
}
})
module.exports = router;