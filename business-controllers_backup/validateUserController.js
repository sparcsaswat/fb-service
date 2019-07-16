const ResponseModel = require("../api-helper/res-model")
const MongoConnector=require("../api-helper/mongo-connector")
class ClsController{
    
    constructor(param,body){         
        this.param=param
        this.body=body
    }
    execute(responseHandler){  
        let objMongoConnector=new MongoConnector();
        let condParam = {"email":this.body.email}
        if(Object.keys(this.body).length === 0 && this.body.constructor === Object)
        {
          responseHandler({"status":402,"msg":"Invalid request parameter"}); 
        }
        else
        {
            if(this.validateService())
            {
                objMongoConnector.select(condParam,"User_Registration",function(response)
                {          
                    if(response.data.length==0)
                    {
                      objMongoConnector.select({},"Intrest_Master",function(response1)
                      {
                        console.log(response1)
                        responseHandler({"status":200,"msg":"User not exist in this email id","output":response1});
                      })
                    }
                    else
                    {
                       responseHandler({"status":201,"msg":"User already exist in this email id"});
                    }
                })
            }
        }
    }
    validateService()
    {
        if ("email" in this.body)
        {
            if(this.body.email!='')
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