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
            objMongoConnector.execQuery(function(conn,mongoDatabase){

                // {name : {$regex: "^"+currObj.body.searchKey,$options:'i'}}   //***   same as like query */

                mongoDatabase.collection('Country_Master').find().toArray(function(err, result) {
                        responseHandler({"status":200,"msg":"Success","output":result});
                })
            })
    }
}
module.exports=ClsController