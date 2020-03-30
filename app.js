const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const productRoutes = require('./api/routes/products');
const soilProfileRoutes = require('./api/routes/soil-profiles');
const orderRoutes = require('./api/routes/orders');

// process.env.MONGO_ATLAS_PW is 'server-side; stored in nodemon.json
mongoose.connect('mongodb+srv://admin-tut:' +
 process.env.MONGO_ATLAS_SP + 
 '@test-db-gb1b3.mongodb.net/test?retryWrites=true&w=majority',
 {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 });

// add cors headers
// * can be specific urls
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // send options request
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }

next()
});

// pass thru middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// routes to pages
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);


// removed to add the routs above.
//
// app.use((req, res, next ) => {
//     res.status(200).json({
//         message: "Hello IRf!"
//     });
// });

// Error handler, catchaall
app.use((req, res, next) => {
    const error = new Error('Not 1found');
    error.status = 404;
    next(error)
    
});

// handle errors from anywhere in app
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });

});

module.exports = app;
