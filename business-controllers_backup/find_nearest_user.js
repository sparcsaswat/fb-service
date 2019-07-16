const ResponseModel = require("../api-helper/res-model")
const MongoConnector=require("../api-helper/mongo-connector")
var ObjectID = require('mongodb').ObjectID; 
var dateTime = require('node-datetime');
class ClsController{
    constructor(param,body){
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');
        console.log(formatted);
       // body._id=ObjectID(body._id)              
        this.param=param
        this.body=body
    }
    execute(responseHandler){      
        let objMongoConnector=new MongoConnector();       
        objMongoConnector.delete(this.body,"userTable",'m',function(response){ 
            responseHandler(response);           
        });       
    }

}
module.exports=ClsController