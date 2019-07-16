const ResponseModel = require("../api-helper/res-model")
const MongoConnector=require("../api-helper/mongo-connector")
class ClsController{
    
    constructor(param,body){        
        this.param=param
        this.body=body
    }
    execute(responseHandler){      
        let objMongoConnector=new MongoConnector();       
        objMongoConnector.insert(this.param,this.body,"hordingCollection",function(response){
            responseHandler(response);           
        });       
    }      

}
module.exports=ClsController