const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all =  (req, res, next) => {
    Product.find()
    .select('-__v')
    .exec()
    .then(docs => {
        // create response object
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                // Meta data to pass along
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                       // url: req.protocol + '://' + req.get('host')+'/products/' + doc._id
                        url: req.protocol + '://' + req.get('host') + req.originalUrl + doc._id
                    }
                };
            })
        };
        // if (docs.length >= 0) {
            res.status(200).json(response);
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
}

exports.products_create = (req, res, next) => {
    console.log(req.file);
    //  now using Product constructure from models file
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    // .save() is from mongoose
    //  

    product
        .save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product object successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + req.originalUrl + result._id
                }
            },
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

}

exports.products_get_product = (req, res, next) =>{
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

}

 exports.products_update = (req, res, next) => {
    const id = req.params.productId;
    const updateObject = req.body;
    Product.update({ _id: id }, { $set: updateObject })
      .exec()
      .then(result => {
        res.status(200).json({
            message: "Product updated",
             request: {
                 type: 'GET',
                 url: req.protocol + '://' + req.get('host') + req.originalUrl + id
             } 
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }

 exports.products_delete = (req, res, next) =>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: req.protocol + '://' + req.get('host'),
                    body: {name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}