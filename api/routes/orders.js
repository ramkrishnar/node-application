const express=require('express')
const router=express.Router();
const oracledb=require('oracledb')
var http = require('http');
var log = require('log4js').getLogger("orders");
var nav= [{link:'/products/allemp',title:'AllEmpolyees'},
{link:'/orders/single',title:'Employee'},
{link:'/orders/save',title:'SaveEmployee'},
{link:'/orders/user',title:'GetUser'},
{link:'/orders/update',title:'update'}]
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
              log.debug('database connected')
              callback(req,res,connection)
          })
}



router.post('/list',function(req,res,next){
    const name=req.body.name;
    console.log(req.body.name);
   
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
                log.debug('employee list from dabase')
                var data=result.rows
           
               
                console.log(data[0]);
                res.render('index',{data:data,
                nav:nav
              })
            
                doRelease(connection);
              });
  

     });
    
    });
    router.post('/saveemp',function(req,res,next){
        var id=req.body.id;
        var name=req.body.name;
        var sal=req.body.sal;

        handledatabaseoperation(req,res,function(request,response,connection){
            connection.execute(`insert into user_info values(:0,:1,:2)`,
            [id,name,sal],{ autoCommit: true },
            function(err,result){
                if (err) {
                    console.error("insert2",err.message); 
                   
                } else{
                console.log("Rows inserted " + result.rowsAffected);
                res.redirect('/orders/save');
                }
            }
        
        )
        })
    })
    router.post('/updateEmp', function(req,res,next){
        var id=req.body.id;
        var name=req.body.name;
        var sal=req.body.sal;
        console.log(id+name+sal);
handledatabaseoperation(req,res,function(request,response,connection){
    connection.execute(
        `update user_info set name=:name,sal=:sal where id=:id `,
        {'id':id,'name':name,'sal':sal},{autoCommit:true},
        function(err,result){
            if(err){
                console.log(err.message);
            }else{
                console.log(result.rowsAffected+'updated');
                res.redirect('/orders/update');
            }
        }
    )
})

    })

    router.get('/save',function(req,res,next){
        res.render('saveEmployee',{
          nav:
          nav
        })
    })


router.get('/update',function(req,res,next){

    res.render('updateEmp',{nav:
        nav})
})




router.post('/getupdate',function(req,res,next){
    var id=req.body.id
    
    console.log('sssss'+id);
    handledatabaseoperation(req,res,function(request,response,connection){
        connection.execute(`select id,name,sal from user_info where id=:id`,[id],{outFormat:oracledb.OBJECT},
        function(err, result) {
            if (err) {
              console.error(err.message);
              doRelease(connection);
              return;
            }
            console.log(result.rows);
            console.log('db response is ready '+result.rows);
            log.debug('employee list from dabase')
             data=result.rows[0];
             res.render('getupdate',{data:data,nav:
                nav})
           
            console.log(data.ID);
    })
    });
   
})




var test={};
 router.get('/user',
function(req,res,next){
    var data = ''; 
   
    http.request('http://localhost:8888/getusers',
    function OnResponse(response) { 
      log.debug('spring boot connected');
      log.error('cross-browser effect occured');
           response.on('data', function(chunk) { 
                data += chunk; 
                console.log(typeof(data))
                body=JSON.parse(data);
                test=body;
                console.log(body)
                console.log(typeof(data))
                res.render('users',{ data:body,
                    nav:
                        nav
                })
           });
        
        
        }
).end()


console.log(test)
})

router.delete('/deleteEmp',function(req,res,next){
var id=req.body.id
    handledatabaseoperation(req,res,function(request,response,connection){
        connection.execute(`delete from user_info where id=:id`,[id],function(err,result){
res.redirect('orders/delete');
        });
    })
})
router.get('/delete',function(req,res,next){
   res.render('')
    })
    function doRelease(connection)
    {
    connection.release(
    function(err) {
    if (err) {
    console.error(err.message);
    }
    });
    }
    


    function OnResponse(response) { 
        var data = ''; //This will store the page we're downloading.
           response.on('data', function(chunk) { //Executed whenever a chunk is received.
                data += chunk; 
                console.log(data)//Append each chunk to the data variable.
           });
           return data;
        }




router.get('/',(req,res)=>{
    http.request('http://localhost:8888/getusers', OnResponse).end();
    
})
router.post('/',(req,res)=>{
    const order={name:req.body.name,
    quantity:req.body.quantity}
    res.status(200).json({msg:'post req',
order:order})
})
router.patch('/',(req,res)=>{
    res.status(200).json({msg:'patch req'})
})
router.delete('/',(req,res)=>{
    res.status(200).json({msg:'delete req'})
})
router.get('/single',function(req,res,next){
    console.log('single page');
  res.render('employeelist',{
      nav:
      nav})
})









module.exports=router;