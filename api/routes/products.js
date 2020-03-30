const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// import from model > product.jjs
const Product = require('../models/product');


// Handle requess
router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        // if (docs.length >= 0) {
            res.status(200).json(docs);
        // } else {
        //     res.status(404).json({
        //         message: 'No enntries found'
        //     });
        // }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });

    });
});


router.post('/', (req, res, next) => {
    // use .body object attached to the req object by body parser
    
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price,
    // };
    //  now using Product constructure from models file
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    // .save() is from mongoose
    //  
    product
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST reqquests to /products',
            createdProduct: product,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});


router.get('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("from the cloud-database",doc);
            if(doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No Valid Entry for provided ID'})
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });

});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateObject = req.body;
  Product.update({ _id: id }, { $set: updateObject })
    .exec()
    .then(result => {
      res
        .status(200)
        .json({ message: "Product updated succesfully", product: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;