const express = require('express');
const morgan=require('morgan')
const path=require('path')
const bodyParser = require('body-parser');
const oracledb=require('oracledb')
const log4js = require('log4js');

const app = express();
const productroutes=require('./api/routes/product')
const ordersRoutes=require('./api/routes/orders')
app.set('views','./src/views')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
var log = log4js.getLogger("app");
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/products',productroutes);
app.use('/orders',ordersRoutes);
app.use((req,res,next)=>{
const error=new Error('not found');
    error.status=404
    next(error)
})
module.exports=app;

