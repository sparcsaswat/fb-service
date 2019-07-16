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
            objMongoConnector.execQuery(function(conn,mongoDatabase){
                mongoDatabase.collection('Resturant_Master').find().toArray(function(err, result1) {
                    mongoDatabase.collection('Food_Preference_Master').find().toArray(function(err, result2) {
                        mongoDatabase.collection('Intrest_Master').find().toArray(function(err, result3) {
                            mongoDatabase.collection('Course_Master').find().toArray(function(err, result4) {
                                var responseData = {"resturants":result1,"foodPreference":result2,"intrest":result3,
                                "courses":result4}
                                responseHandler({"status":200,"msg":"Success","output":responseData});
                            })
                        })
                    })
                })
            })
    }
}
module.exports=ClsController