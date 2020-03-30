const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    // field : objectTYPE
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
});


module.exports = mongoose.model('Product', productSchema);
