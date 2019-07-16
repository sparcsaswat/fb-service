const ResponseModel = require("../api-helper/res-model")
const MongoConnector=require("../api-helper/mongo-connector")
class ClsController{
    
    constructor(param,body){         
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
            if(this.validateService(currObj.body.regdType))
            {
                objMongoConnector.execQuery(function(conn,mongoDatabase){
                    var id;
                    if(currObj.body.regdType == 'R')
                    {
                        mongoDatabase.collection('User_Registration').find().sort({ userId: -1 }).limit(1).toArray(function(err, result) {
                            if(result.length == 0 || result == null) 
                            {
                                id = 1;
                            }
                            else 
                            {
                                id = result[0].userId + 1;
                            }
                            var myobj = {"userId": id, "name": currObj.body.name, "email": currObj.body.email, "password": currObj.body.password, 
                            "confPassword": currObj.body.confPassword,"foodPreference": currObj.body.foodPreference,"interest": currObj.body.interest
                            ,"belongTo": currObj.body.belongTo,"flagUrl":currObj.body.flagUrl,"bio":currObj.body.bio,"userCourses":currObj.body.userCourses,
                            "userSubCourse":currObj.body.userSubCourse}

                            objMongoConnector.insert(myobj,"o", "User_Registration",function(response){
                                var generatedUserId = response.output.userId
                                var count = 0;
                                for(let i=0; i< currObj.body.freeTime.length; i++)
                                {
                                    var myTimeSlotObj = {"userId": generatedUserId,"day":currObj.body.freeTime[i].day,"date":currObj.body.freeTime[i].date,
                                    'timeSlot1':currObj.body.freeTime[i].ts1,'timeSlot2':currObj.body.freeTime[i].ts2,'timeSlot3':currObj.body.freeTime[i].ts3,
                                    'timeSlot4':currObj.body.freeTime[i].ts4,'timeSlot5':currObj.body.freeTime[i].ts5,'timeSlot6':currObj.body.freeTime[i].ts6,
                                    'timeSlot7':currObj.body.freeTime[i].ts7,'timeSlot8':currObj.body.freeTime[i].ts8,'timeSlot9':currObj.body.freeTime[i].ts9,
                                    'timeSlot10':currObj.body.freeTime[i].ts10,'timeSlot11':currObj.body.freeTime[i].ts11,'timeSlot12':currObj.body.freeTime[i].ts12,
                                    'timeSlot13':currObj.body.freeTime[i].ts13,'dateType':currObj.body.freeTime[i].dateType}
                                    objMongoConnector.insert(myTimeSlotObj,"o", "User_Free_Time",function(response1){
                                        
                                    });
                                    count++;
                                }
                                if(count == currObj.body.freeTime.length)
                                {
                                    responseHandler(response);
                                }
                            });
                        })
                    }
                    else if(currObj.body.regdType == "U")
                    {
                        var updParam = {"userId": currObj.body.userId}
                        var updObj = {"name": currObj.body.name,"foodPreference": currObj.body.foodPreference,
                        "interest": currObj.body.interest,"bio":currObj.body.bio}
                            objMongoConnector.findAndUpdate(updParam, updObj, "User_Registration",function(updResponse){
                                let updatedUserId = {"userId":updResponse.data.value.userId}
                                var count = 0;

                                objMongoConnector.delete(updatedUserId, "User_Free_Time","m",function(response1){
                                    for(let i=0; i< currObj.body.freeTime.length; i++)
                                    {
                                        var myTimeSlotObj = {"userId":updResponse.data.value.userId,"day":currObj.body.freeTime[i].day,"date":currObj.body.freeTime[i].date,
                                        'timeSlot1':currObj.body.freeTime[i].ts1,'timeSlot2':currObj.body.freeTime[i].ts2,'timeSlot3':currObj.body.freeTime[i].ts3,
                                        'timeSlot4':currObj.body.freeTime[i].ts4,'timeSlot5':currObj.body.freeTime[i].ts5,'timeSlot6':currObj.body.freeTime[i].ts6,
                                        'timeSlot7':currObj.body.freeTime[i].ts7,'timeSlot8':currObj.body.freeTime[i].ts8,'timeSlot9':currObj.body.freeTime[i].ts9,
                                        'timeSlot10':currObj.body.freeTime[i].ts10,'timeSlot11':currObj.body.freeTime[i].ts11,'timeSlot12':currObj.body.freeTime[i].ts12,
                                        'timeSlot13':currObj.body.freeTime[i].ts13,'dateType':currObj.body.freeTime[i].dateType}
                                            objMongoConnector.insert(myTimeSlotObj,"o", "User_Free_Time",function(response2){

                                            })
                                        count++;
                                    }
                                    if(count == currObj.body.freeTime.length)
                                    {
                                        responseHandler(updResponse);
                                    }
                                });
                        });
                    }
                })
            }
            else
            {
                responseHandler({"status":402,"msg":"Invalid request parameter"}); 
            }
        }
    }
    validateService(val)
    {
        if(val=="R")
        {
            if ("name" in this.body && "email" in this.body && "password" in this.body && "confPassword" in this.body
            && "interest" in this.body && "belongTo" in this.body && 'flagUrl' in this.body){
            if(this.body.name!='' && this.body.email!='' && this.body.password!=''
            && this.body.confPassword!='' && this.body.interest!='' &&
                this.body.belongTo!='' && this.body.flagUrl!='')
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
        else if(val=="U"){
            if ("userId" in this.body){
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
}
module.exports=ClsController