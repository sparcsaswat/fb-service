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
                    mongoDatabase.collection('MeetUp_Scheduled_Data').find().sort({ meetupScheduleId: -1 }).limit(1).toArray(function(err, result) {
                        if(result.length == 0 || result == null) 
                        {
                            id = 1;
                        }
                        else 
                        {
                            id = result[0].meetupScheduleId + 1;
                        }
                        var meetdate = currObj.body.meetingDateAndTime.split(" ")[0]
                        var dateToParse = meetdate.split("-")[2]+"-"+meetdate.split("-")[1]+"-"+meetdate.split("-")[0]
                        var dtChecker =  new Date(dateToParse)
                            console.log(dtChecker)
                        var dtCheckerISO =  new Date(dateToParse).toISOString()
                            console.log(dtCheckerISO)
                            
                        var myobj = {"meetupScheduleId": id,"fromUserId":currObj.body.fromUserId,"toUserId":currObj.body.toUserId,
                        "meetingDateAndTime": currObj.body.meetingDateAndTime,"meetingDateChecker":dtChecker,"resturantId": currObj.body.resturantId,
                        "resturantName": currObj.body.resturantName,"meetUpRequestId": currObj.body.meetUpRequestId,
                        "roomId": currObj.body.roomId,"fromUserName":currObj.body.fromUserName,
                        "toUserName":currObj.body.toUserName,"requestStatus":"1"}
                        mongoDatabase.collection('MeetUp_Scheduled_Data').insertOne(myobj,function(response){
                            socketApi.io.sockets.emit('connectUser'+currObj.body.toUserId,myobj);
                            responseHandler({"status":200,"msg":"Meeting Scheduled","output":myobj}); 
                        })
                    })
                })
            }
        }
    }

    validateService()
    {
        if ("fromUserId"  in this.body && "toUserId" in this.body && "meetingDateAndTime" in this.body && "resturantId" in this.body && "resturantName" in this.body
        && "meetUpRequestId" in this.body && "roomId" in this.body && "fromUserName"  in this.body && "toUserName" in this.body)
        {
            if(this.fromUserId!='' && this.toUserId!='' && this.body.meetingDateAndTime!='' && this.body.resturantId!='' && this.body.resturantName!=''
            && this.body.meetUpRequestId!='' && this.body.roomId!='' && this.body.fromUserId!='' && this.toUserId!='')
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