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
                    mongoDatabase.collection('User_Registration').find({"userId":currObj.body.friendUid}).toArray(function(err, result) {
                        mongoDatabase.collection('User_Free_Time').find({"userId":currObj.body.friendUid}).toArray(function(err, freeTimeResult) {
                            var reponseData = {"name":result[0].name,"email":result[0].email,"foodPreference:":result[0].foodPreference,
                            "interest":result[0].interest,"belongTo":result[0].belongTo,"flagUrl":result[0].flagUrl,
                            "bio":result[0].bio,"freeTime":freeTimeResult}
                            responseHandler({"status":200,"msg":"success","output":reponseData});
                        });
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
        if ("friendUid" in this.body)
        {
            if(this.body.friendUid!= '')
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