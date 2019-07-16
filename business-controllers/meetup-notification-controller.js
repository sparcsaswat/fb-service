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
        if(Object.keys(this.body).length === 0 && this.body.constructor === Object)
        {
            responseHandler({"status":402,"msg":"Invalid request parameter"}); 
        }
        else
        {
            if(this.validateService())
            {   var fTime,tTime;
                var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
                var d = new Date();
                var CurrDayName = days[d.getDay()]
                fTime=d.getHours()-2;
                tTime=d.getHours()+3;
                objMongoConnector.execQuery(function(conn,mongoDatabase){ 
                    var param = {"toUserId":currObj.body.userId}
                    var currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() - 1);
                    mongoDatabase.collection('Notification_Table').find(param).toArray(function(err, result) {
                        mongoDatabase.collection('MeetUp_Scheduled_Data').find({ $and: [{$or:[{"fromUserId":currObj.body.userId},{"toUserId":currObj.body.userId}]},{"meetingDateChecker" : { $gte : currentDate}}]}).toArray(function(err, result1) {
                            mongoDatabase.collection('MeetUp_Request').find({ $and: [{$or:[{"fromUserId":currObj.body.userId},{"toUserId":currObj.body.userId}]},{"requestStatus" :"2"}]}).toArray(function(err, result2) {
                                var friendsFriendArr = [];
                                let count =0
                                for(let i=0; i<result2.length;i++)
                                {
                                    if(result2[i].fromUserId == currObj.body.userId){
                                        if (friendsFriendArr.indexOf(result2[i].toUserId) === -1) {
                                            friendsFriendArr.push(result2[i].toUserId)
                                        }
                                    }
                                    else if(result2[i].toUserId == currObj.body.userId)
                                    {
                                        if (friendsFriendArr.indexOf(result2[i].fromUserId) === -1) {
                                            friendsFriendArr.push(result2[i].fromUserId)
                                        }
                                    }
                                    count++
                                }

                                if(count == result2.length)
                                {
                                    if(friendsFriendArr.length > 0)
                                    {
                                      mongoDatabase.collection('User_Registration').find({userId:{$in:friendsFriendArr}}).toArray(function(err, userProfile) {
                                        mongoDatabase.collection('User_Free_Time').find({$and:[{userId:{$in:friendsFriendArr}},{"day":CurrDayName}]}).toArray(function(err, freeTimeRes) {
                                            var freeTimeUserArr=[]
                                            var finalfreeTimeUserArr=[];
                                            for(let i=0;i<freeTimeRes.length;i++){
                                                if(freeTimeRes[i].timeSlot1==1){
                                                    freeTimeUserArr.push({'time':8,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot2==1){
                                                    freeTimeUserArr.push({'time':9,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot3==1){
                                                    freeTimeUserArr.push({'time':10,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot4==1){
                                                    freeTimeUserArr.push({'time':11,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot5==1){
                                                    freeTimeUserArr.push({'time':12,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot6==1){
                                                    freeTimeUserArr.push({'time':13,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot7==1){
                                                    freeTimeUserArr.push({'time':14,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot8==1){
                                                    freeTimeUserArr.push({'time':15,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot9==1){
                                                    freeTimeUserArr.push({'time':16,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot10==1){
                                                    freeTimeUserArr.push({'time':17,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot11==1){
                                                    freeTimeUserArr.push({'time':18,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot12==1){
                                                    freeTimeUserArr.push({'time':19,id:freeTimeRes[i].userId})
                                                }
                                                if(freeTimeRes[i].timeSlot13==1){
                                                    freeTimeUserArr.push({'time':20,id:freeTimeRes[i].userId})
                                                }


                                            }
                                            for(var j=0;j<freeTimeUserArr.length;j++){
                                                if(freeTimeUserArr[j].time>fTime && freeTimeUserArr[j].time<tTime){
                                                    finalfreeTimeUserArr.push(freeTimeUserArr[j])
                                                }
                                            }

                                            for(let k=0; k < userProfile.length;k++){
                                                for(let l=0;l< result2.length;l++)
                                                {
                                                    if((userProfile[k].userId == result2[l].fromUserId) || (userProfile[k].userId == result2[l].toUserId))
                                                    {
                                                        result2[l]["profilePic"] = userProfile[k].profilePic;
                                                    }
                                                }
                                            }

                                            var responseData = {"ScheduledMeetsNotification":result1,"FriendRequestNotification":result,"AllFriends":result2,"friendFreeTimming":finalfreeTimeUserArr}
                                            responseHandler({"status":200,"msg":"Success","output":responseData}); 
                                        })
                                      })
                                    }
                                    else
                                    {
                                        var responseData = {"ScheduledMeetsNotification":result1,"FriendRequestNotification":result,"AllFriends":result2,"friendFreeTimming":[]}
                                        responseHandler({"status":200,"msg":"Success","output":responseData})
                                    }
                                }
                            })
                        })
                    })
                });  
            }
            else
            {
                responseHandler({"status":402,"msg":"Invalid request parameter"}); 
            }
        }
    }  

    validateService()
    {
        if ("userId" in this.body)
        {
            if(this.body.userId!='')
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