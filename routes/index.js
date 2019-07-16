var express = require('express');
var Request = require("request");
var router = express.Router();
var auth = require('basic-auth');
var secretKey = require('../secretKey');
var mongoConsole = require('../routes/mongo');
var MongoConnectorClass=require('../routes/mongo-connector')
// var app = require('express')();
var jwt = require('jsonwebtoken');
var dbcon=new MongoConnectorClass();
console.log(dbcon);
//dbcon.insertDB();
var obj={collection:'myDemo',data:{id:1,name:'biraja1'}}

var obj1={collection:'myDemo',data:{}}
setTimeout(function(){ 
  // insert records

  // var a= mongoConsole.insertIntoMongoDB(obj,'','',function(result,err){
  //   console.log(result)
  // })

  //view records
  // var a= mongoConsole.getFromMongoDB(obj1,'','',function(result,err){
  //   console.log(result)
  // })
 }, 3000);
/* GET home page. */
router.get('/', function (req, res, next) {
 res.render('index', { title: 'Express' });
});
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
// router.get('/hello', proxy('http://google.com'))

router.get('/apiTest', function (req, res, next) {
  mongoConsole
  res.json({message:'welcome'})
});
router.post('/apiTest/post',verifytoken, function (req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData)=>{
    if(err){
      res.sendStatus(403)
    }
    else{
      res.json({message:'post',data:authData})
    }
  })
  
});

router.post('/apiTest/login', function (req, res, next) {
  const user={name:'biraja'}
  jwt.sign({user},'secretkey',(error,token)=>{
    res.json({message:token})
  })
  //res.json({message:'post'})
});
function verifytoken(req, res, next){
  const bearerHeader=req.headers['authorization'];
  if(typeof bearerHeader!=='undefined'){
    const bearer=bearerHeader.split(' ')
    const bearerToken=bearer[1];
    req.token=bearerToken;
    next()
  }
  else{
    res.sendStatus(403)
  }

}

router.post('/callOtherPostAPI', function (req, res) {
  var credentials = auth(req)
    if (!credentials || credentials.name !== secretKey.userId || credentials.pass !== secretKey.pass) {
        res1.statusCode = 401
        res1.setHeader('WWW-Authenticate', 'Basic realm="example"')
        res1.end('Access denied')
    }
    else{
      if (req.body.method == 'post') {
        Request.post({
          "headers": { "content-type": "application/json" },
          "url": req.body.url,
          "body": JSON.stringify(req.body.data)
        }, (error, response, body) => {
          if (error) {
            //console.log(error)
            res.send({ "status": "500", "msg": "Please try after sometimes" })
          }
          console.dir(JSON.parse(response.body));
          res.send({ "status": "200", "msg": JSON.parse(response.body) })
        });
      }
      else {
        Request.get(req.body.url, (error, response, body) => {
          if (error) {
            res.send({ "status": "500", "msg": "Please try after sometimes" })
            //return console.dir(error);
          }
          res.send({ "status": "200", "msg": JSON.parse(response.body) })
          //console.dir(JSON.parse(body));
        });
      }
    }
  
});

router.post('/insertIntoMongo', function (req, res) {
  var credentials = auth(req)
    if (!credentials || credentials.name !== secretKey.userId || credentials.pass !== secretKey.pass) {
        res1.statusCode = 401
        res1.setHeader('WWW-Authenticate', 'Basic realm="example"')
        res1.end('Access denied')
    }
    else{
      var obj={collection:'userLogin',data:{username:'ashish',password:'password'}}
var a= dbcon.insertIntoMongoDB(obj,function(result,err){
    console.log(result)
    res.send({ "status": "200", "msg": result })
  })
      // Request.post({
      //   "headers": { "content-type": "application/json" },
      //   "url": req.body.url,
      //   "body": JSON.stringify(req.body.data)
      // }, (error, response, body) => {
      //   if (error) {
      //     //console.log(error)
      //     res.send({ "status": "500", "msg": "Please try after sometimes" })
      //   }
      //   console.dir(JSON.parse(response.body));
      //   res.send({ "status": "200", "msg": JSON.parse(response.body) })
      // });
    }
  
});

//function callOtherPostAPI(url,data){

router.get('/api', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log('1111111111111111')
  Request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://203.129.207.124/WBSMA_Service/mobileservice.svc/Applogin",
    "body": JSON.stringify({ "UserName": "Alexa", "Password": "5f4dcc3b5aa765d61d8327deb882cf99" })
  }, (error, response, body) => {
    if (error) {
      return console.dir(error);
    }
    console.dir(JSON.parse(response.body));
    res.write('success')
  });

  Request.get("http://httpbin.org/ip", (error, response, body) => {
    if (error) {
      return console.dir(error);
    }
    console.dir(JSON.parse(body));
  });
});
//}



// Request.post({
//     "headers": { "content-type": "application/json" },
//     "url": "http://httpbin.org/post",
//     "body": JSON.stringify({
//         "firstname": "Nic",
//         "lastname": "Raboy"
//     })
// }, (error, response, body) => {
//     if(error) {
//         return console.dir(error);
//     }
//     console.dir(JSON.parse(body));
// });

module.exports = router;
