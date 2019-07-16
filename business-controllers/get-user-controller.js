const ResponseModel = require("../api-helper/res-model")
const MongoConnector=require("../api-helper/mongo-connector")
class ClsController{
    
    constructor(param){        
        this.param=param
    }
    execute(responseHandler){      
        let objMongoConnector=new MongoConnector();
        // objMongoConnector.execQuery(function(conn,db){
        //     db.collection("userTable").find({}, {projection: { _id: 0, name: 1 }}).toArray(function(err, res) {
        //         if (err) throw err;
        //         responseHandler(res);
        //         conn.close();
        //       });
        // })
        objMongoConnector.select(this.param,"userTable",function(response){
            responseHandler(response);           
        });       
    }      

}
module.exports=ClsController