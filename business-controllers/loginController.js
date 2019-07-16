const ResponseModel = require("../api-helper/res-model")
const MongoConnector= require("../api-helper/mongo-connector")
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
            if(this.validateService())
            {
                objMongoConnector.execQuery(function(conn,mongoDatabase){
                    mongoDatabase.collection('User_Registration').find({"email":currObj.body.email}).toArray(function(err, result) {
                        if(result.length == 0 || result == null) 
                        {
                            responseHandler({"status":201,"msg":"Invalid user authentication"});
                        }
                        else
                        {
                            // if(result.length !=0)
                            // {
                                if(result[0].password == currObj.body.password)
                                {
                                mongoDatabase.collection('User_Free_Time').find({"userId":result[0].userId}).sort({ dateType: 1 }).toArray(function(err, result1) {
                                    mongoDatabase.collection("MeetUp_Scheduled_Data").find({$and:[{$or:[{"fromUserId":result[0].userId},{"toUserId":result[0].userId}]},{'requestStatus':"2"}]}).toArray(function(err, result2) {
                                        mongoDatabase.collection("MeetUp_Request").find({$and:[{$or:[{"fromUserId":result[0].userId},{"toUserId":result[0].userId}]},{'requestStatus':"2"}]}).toArray(function(err, result3) {
                                            let res = []
                                            var obj= result[0];
                                            obj["freeTime"] = result1;
                                            obj["FoodPrintCount"] = result2.length
                                            obj["BuddiesCount"] = result3.length
                                            res.push(obj)
                                            responseHandler({"status":200,"msg":"Valid user","output":res});
                                        })
                                    })
                                })
                                }
                                else
                                {
                                    responseHandler({"status":202,"msg":"Invalid user authentication"});
                                }
                            // }
                        }
                    })
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
        if ("email" in this.body && "password" in this.body)
        {
            if(this.body.email!='' && this.body.password!='')
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