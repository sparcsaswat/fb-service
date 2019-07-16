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
                    mongoDatabase.collection('Resturant_Master').find({"ResturantId":currObj.body.resturantId}).toArray(function(err, result) {
                        console.log(result[0].Cuisine);
                        var cusineArr = []
                        var count = 0;
                        var splitData = result[0].Cuisine.split(",");
                        for(let i=0; i<splitData.length;i++)
                        {
                            cusineArr.push(splitData[i].trim());
                            count++
                        }

                        if(count == splitData.length)
                        {
                            mongoDatabase.collection('Food_Preference_Master').find({"FoodPreferences":{$in :cusineArr}}).toArray(function(err, result1) {
                                    let res = []
                                    var obj= result[0]
                                    obj["foodPref"] = result1;
                                    res.push(obj)
                                responseHandler({"status":200,"msg":"Success","output":res});
                            })
                        }
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
        if ("resturantId" in this.body)
        {
            if(this.body.resturantId!='')
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