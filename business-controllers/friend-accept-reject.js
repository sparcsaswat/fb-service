const ResponseModel = require("../api-helper/res-model")
const MongoConnector=require("../api-helper/mongo-connector")
var ObjectID = require('mongodb').ObjectID; 
const socketApi = require("../api-helper/socketAPI")

class ClsController{
    
    constructor(param,body){
       // body._id=ObjectID(body._id)              
        this.param=param
        this.body=body
    }
    execute(responseHandler){ 
        var currObj = this;     
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
                    var param = {"meetupRequestId":currObj.body.requestId}
                    var updateData = {"requestStatus":currObj.body.requestStatus}
                    mongoDatabase.collection('MeetUp_Request').findOneAndUpdate(param,{ $set:updateData},function (err, res) {
                        mongoDatabase.collection('Notification_Table').findOneAndUpdate(param,{ $set:updateData},function (err, res1) {
                            var emittingId;
                            if(currObj.body.requestStatus == "2")
                            {
                                if(res.value.roomId.split("_")[0]!=currObj.body.userId)
                                {
                                    emittingId = res.value.roomId.split("_")[0]
                                }
                                else if(res.value.roomId.split("_")[1]!=currObj.body.userId){
                                    emittingId = res.value.roomId.split("_")[1]
                                }
                                socketApi.io.sockets.emit('connectUser'+emittingId,res.value);
                            }
                            responseHandler({"status":200,"msg":"success","output":res.value});
                        })
                    })
                });
            }  
        }     
    }   
    
    validateService()
    {
        if ("requestId" in this.body && "requestStatus" in this.body && "userId" in this.body)
        {
            if(this.body.requestId!='' && this.body.requestStatus!='')
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