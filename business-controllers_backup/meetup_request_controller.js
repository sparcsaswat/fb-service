const ResponseModel = require("../api-helper/res-model")
const MongoConnector= require("../api-helper/mongo-connector")
const socketApi = require("../api-helper/socketAPI")
class ClsController{
    constructor(param,body){
        this.param=param
        this.body=body
    }
    execute(responseHandler){
        let objMongoConnector=new MongoConnector();  
        var currObj = this;
        if(Object.keys(this.body).length === 0 && this.body.constructor === Object)
        {
          responseHandler({"status":402,"msg":"Invalid request parameter"}); 
        }
        else
        {
            if(this.validateService())
            {
                objMongoConnector.execQuery(function(conn,mongoDatabase){
                    var id;
                    mongoDatabase.collection('MeetUp_Request').find().sort({ meetupRequestId: -1 }).limit(1).toArray(function(err, result) {
                        if(result.length == 0 || result == null) 
                        {
                            id = 1;
                        }
                        else 
                        {
                            id = result[0].meetupRequestId + 1;
                        }
                        var roomId = currObj.body.fromUserId+"_"+currObj.body.toUserId
                        var roomIdAlt = currObj.body.toUserId+"_"+currObj.body.fromUserId;
                        mongoDatabase.collection('MeetUp_Request').find({ $or: [{ "roomId":roomId },{ "roomId":roomIdAlt }]}).toArray(function(err, result1){
                            if(result1.length==0)
                            {
                                var myobj = {"meetupRequestId": id, "fromUserId": currObj.body.fromUserId, "toUserId": currObj.body.toUserId, "requestStatus": currObj.body.requestStatus, 
                                "requestDate": currObj.body.requestDate,"fromUserName": currObj.body.fromUserName,"toUserName": currObj.body.toUserName,
                                "roomId": currObj.body.roomId}
                                mongoDatabase.collection('MeetUp_Request').insertOne(myobj,function(response){
                                    // console.log("response===============")
                                    // console.log(response)
                                    socketApi.io.sockets.emit('connectUser'+currObj.body.toUserId,myobj);
                                    responseHandler({"status":200,"msg":"meet up request success","output":myobj}); 
                                })
                            }
                            else
                            {
                                responseHandler({"status":201,"msg":"meet up request already send to this user"}); 
                            }
                        })
                    })
                })
            }
        }
    }

    validateService()
    {
        if ("fromUserId" in this.body && "toUserId" in this.body && "requestStatus" in this.body
        && "requestDate" in this.body && "fromUserName" in this.body && "toUserName" in this.body
        && "roomId" in this.body)
        {
            if(this.body.fromUserId!='' && this.body.toUserId!='' && this.body.requestStatus!=''
            && this.body.requestDate!='' && this.body.fromUserName!='' && this.body.toUserName!=''
            && this.body.roomId!='')
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