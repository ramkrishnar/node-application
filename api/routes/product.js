const express=require('express')
const oracledb=require('oracledb')
const route=express.Router();
var nav=  [{link:'/products/allemp',title:'AllEmpolyees'},
{link:'/orders/single',title:'Employee'},
{link:'/orders/save',title:'SaveEmployee'},
{link:'/orders/user',title:'GetUser'},{link:'/orders/update',title:'update'}]

function handledatabaseoperation(req,res,callback){
    oracledb.getConnection(
        {  
            host: "localhost/xe",  
            user: "system",  
            password: "root"  
          },function(err,connection){
              if(err){
                  console.log(err);
              }
              console.log('database connected')
              callback(req,res,connection)
          })
}
route.get('/allemp',function(req,res,next){
    handledatabaseoperation(req,res,function (request, response, connection){
        connection.execute(
            `SELECT id,name,sal from
            user_info `,[],{outFormat:oracledb.ARRAY},
            function(err, result) {
                if (err) {
                    console.log('Error in execution of select statement'+err.message);
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({
                    status: 500,
                    message: "Error getting the departments",
                    detailed_message: err.message
                    })
                    );
                }
                
                var data=result.rows
                console.log(data)
                
                res.render('employee',{data:data
                , nav:
                nav
                })
            }
        )
})
});
route.get('/:eid',function(req,res,next){
    var eid=req.params.eid;
    handledatabaseoperation(req,res,function (request, response, connection){
        connection.execute(
            `SELECT id,name,sal from
             user_info WHERE id= :id`,
            [eid],{outFormat:oracledb.ARRAY},
            function(err, result) {
                if (err) {
                  console.error(err.message);
                  doRelease(connection);
                  return;
                }
                console.log(result.rows);
                console.log('db response is ready '+result.rows);
               
                var data=result.rows
           
               
                console.log(data[0]);
                res.render('index',{data:data,
                nav:
               nav})
                doRelease(connection);
              });
  

     });
      
    });
    
    route.get('/list',function(req,res,next){
        var name=req.body.name
        console.log(name);
        handledatabaseoperation(req,res,function (request, response, connection){
            connection.execute(
                `SELECT id,name,sal from
                 user_info WHERE name= :name`,
                [name],{outFormat:oracledb.ARRAY},
                function(err, result) {
                    if (err) {
                      console.error(err.message);
                      doRelease(connection);
                      return;
                    }
                    console.log(result.rows);
                    console.log('db response is ready '+result.rows);
                   
                    var data=result.rows
               
                   
                    console.log(data[0]);
                    res.render('index',{data:data,
                    nav:
                    nav})
                    doRelease(connection);
                  });
      
    
         });
          
        });


function doRelease(connection)
{
connection.release(
function(err) {
if (err) {
console.error(err.message);
}
});
}






































route.post('/',(req,res)=>{
 
    const product={
        name:req.body.name,
        price:req.body.price
    };
    res.status(201).json({message:'request from post',
    
createproduct:product.name})
})

route.get('/',(req,res)=>{
    const id=req.params.productid;
    if(id=='special'){
        res.status(200).json({message:'special id',
    id:id})
    }
    else{
        res.status(200).json({msg:'new id',
    id:id})
    }
})
route.patch('/',(req,res)=>{
    res.status(200).json({msg:'product updated'})
})
route.delete('/',(req,res)=>{
    res.status(200).json({msg:'product deleted'})
})
module.exports=route;
