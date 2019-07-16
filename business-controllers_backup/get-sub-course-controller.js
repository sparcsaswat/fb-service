const ResponseModel = require("../api-helper/res-model")
const MongoConnector=require("../api-helper/mongo-connector")
var ObjectID = require('mongodb').ObjectID; 

class ClsController{
    
    constructor(param,body){
       // body._id=ObjectID(body._id)              
        this.param=param
        this.body=body
    }
    execute(responseHandler){      
        var currObj = this      
        let objMongoConnector=new MongoConnector();
        if(Object.keys(this.body).length === 0 && this.body.constructor === Object)
        {
            responseHandler({"status":402,"msg":"Invalid request parameter"}); 
        }
        else
        {
            if(this.validateService())
            {
               objMongoConnector.execQuery(function(conn,mongoDatabase){
                    mongoDatabase.collection('Sub_Course_master').find({"courseId":{$in :currObj.body.courseId}}).toArray(function(err, result) {
                        responseHandler({"status":200,"msg":"success","output":result});
                    });
               })
            }
            else
            {
                responseHandler({"status":402,"msg":"Invalid request parameter"}); 
            }
        }
    }
    validateService()
    {
        if ("courseId" in this.body)
        {
            if(this.body.courseId.length > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
           return false
        }
    }
}
module.exports=ClsController