const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// add multer for image / binary data upload?
const multer = require('multer');
// import check-aush middleware
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});


const fileFilter = (req, file, cb) => {
    // reject a fall
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true)
    } else {
        cb(null, false);
    }

};

const upload = multer({storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: fileFilter
    });



// import from model > product.jjs
const Product = require('../models/product');


// Handle requess
router.get('/', ProductController.products_get_all 
);

// pass middleware - handler before (req, res, next)
router.post('/',  checkAuth, upload.single('productImage'), ProductController.products_create
);


router.get('/:productId', ProductController.products_get_product);

router.patch("/:productId", checkAuth, ProductController.products_update);

router.delete('/:productId', checkAuth, ProductController.products_delete );

module.exports = router;