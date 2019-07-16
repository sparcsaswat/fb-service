const ResponseModel = require("../api-helper/res-model")
const MongoConnector=require("../api-helper/mongo-connector")
var ObjectID = require('mongodb').ObjectID; 

class ClsController{
    
    constructor(param,body){
        //param._id=ObjectID(param._id)         
        this.param=param
        this.body=body
    }
    execute(responseHandler){      
        let objMongoConnector=new MongoConnector();       
        objMongoConnector.update(this.param,this.body,"o","userTable",function(response){ 
            responseHandler(response);           
        });       
    }      

}
module.exports=ClsController