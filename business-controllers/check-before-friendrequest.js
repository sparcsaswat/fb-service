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
        var currObj = this;
        let objMongoConnector=new MongoConnector();    
        if(this.validateService())
        {   
            objMongoConnector.execQuery(function(conn,mongoDatabase){ 

                
                    var roomId1= currObj.body.fromUserId+"_"+currObj.body.toUserId;
                    var roomId2= currObj.body.toUserId+"_"+currObj.body.fromUserId;
                    mongoDatabase.collection('MeetUp_Request').find({$or:[{"roomId":roomId1},{"roomId":roomId2}]}).toArray(function(err, result) {
                        if(result.length!=0)
                        {
                            responseHandler({"status":200,"value":result[0].requestStatus});
                        }
                        else
                        {
                            responseHandler({"status":200,"value":"0"});
                        }

                    })       
            }); 
        }
        else
        {
            responseHandler({"status":402,"msg":"Invalid request parameter"}); 
        }
    }   
    
    validateService()
    {
        if ("fromUserId" in this.body && "toUserId" in this.body) 
        {
            if(this.body.fromUserId!= '' && this.body.toUserId!= '')
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