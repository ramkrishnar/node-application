const http=require('http');
const app=require('./app')

var log4js = require('log4js');
log4js.configure('./config/log4js.json');
const port=process.env.port || 3000;
const server =http.createServer(app);
server.listen(port);