const MongoClient = require('mongodb').MongoClient;
const ResponseModel = require("../api-helper/res-model");
const project_info = ey = require('../project-config');
var resModel = new ResponseModel();

class MongoConnector {
    constructor() {

    }
    execQuery(callback){
        resModel={}; 
        MongoClient.connect(project_info.mongoConnection.url, {
            useNewUrlParser: true
        }, function (err, conn) {
            if (err) {
                resModel.err = err.message
                resModel.msg = "Opps! Something went wrong"
                callback(resModel)
            } else {               
                const db = conn.db(project_info.mongoConnection.db);
                callback(conn,db) 
            }            
        });
    }
    insert(body,type,strCollection,callback) {
        resModel={}; 
        MongoClient.connect(project_info.mongoConnection.url, {
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                resModel.err = err.message
                resModel.msg = "Opps! Something went wrong"
                callback(resModel)
            } else {
               
                const db = client.db(project_info.mongoConnection.db);
                const collection = db.collection(strCollection);
                if(type=="m"){
                    collection.insertMany(body, function (err, res) {
                        if (err) {
                            resModel.err = err.message
                            resModel.msg = "Opps! Something went wrong"
                            callback(resModel)
                        } else {
                            resModel.msg = "Success";
                            resModel.data = res
                            callback(resModel)
                        }
    
                    })
                }
                else
                {
                    collection.insertOne(body, function (err, res) {
                        if (err) {
                            resModel.err = err.message
                            resModel.msg = "Opps! Something went wrong"
                            callback(resModel)
                        } else {
                            resModel.msg = "Success";
                            resModel.data = res;
                            resModel.output = res.ops[0];
                            callback(resModel)
                        }
                    })
                }
                client.close();
            }            
        });
    }
    select(param,strCollection,callback) {
        resModel={}; 
        MongoClient.connect(project_info.mongoConnection.url, {
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {                
                resModel.err = err.message
                resModel.msg = "Opps! Something went wrong"
                callback(resModel)
            } else {
                const db = client.db(project_info.mongoConnection.db);
                const collection = db.collection(strCollection);               
                collection.find(param).toArray(function (err, res) {
                    if (err) {
                        resModel.err = err.message
                        resModel.msg = "Opps! Something went wrong"
                        callback(resModel)
                    } 
                    else {
                        resModel.msg = "Success";
                        resModel.data = res
                        callback(resModel)
                    }
                    client.close();
                });
            }
        });
    }

    update(param,body,type,strCollection, callback) {
        resModel={}; 
        MongoClient.connect(project_info.mongoConnection.url, {
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                resModel.err = err.message
                resModel.msg = "Opps! Something went wrong"
                callback(resModel)
            } else {
                const db = client.db(project_info.mongoConnection.db);
                const collection = db.collection(strCollection);     
                if(type=="m"){
                    collection.updateMany(param,{ $set:body },function (err, res) {
                        if (err) {
                            resModel.err = err.message
                            resModel.msg = "Opps! Something went wrong"
                            callback(resModel)
                        } else {
                            resModel.msg = "Success";
                            resModel.data = res
                            callback(resModel)
                        }
                    });
                }   
                else{
                    collection.updateOne(param,{ $set:body },function (err, res) {
                        if (err) {
                            resModel.err = err.message
                            resModel.msg = "Opps! Something went wrong"
                            callback(resModel)
                        } else {
                            resModel.msg = "Success";
                            resModel.data = res
                            // resModel.output = res.ops[0];
                            callback(resModel)
                        }
                    });
                }      
                client.close();
            }
        });
    }


    findAndUpdate(param,body,strCollection, callback) {
        resModel={}; 
        MongoClient.connect(project_info.mongoConnection.url, {
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                resModel.err = err.message
                resModel.msg = "Opps! Something went wrong"
                callback(resModel)
            } else {
                const db = client.db(project_info.mongoConnection.db);
                const collection = db.collection(strCollection);
                    collection.findOneAndUpdate(param,{ $set:body },function (err, res) {
                        if (err) {
                            resModel.err = err.message
                            resModel.msg = "Opps! Something went wrong"
                            callback(resModel)
                        } else {
                            resModel.msg = "Success";
                            resModel.data = res
                            callback(resModel)
                        }
                    });    
                client.close();
            }
        });
    }

    delete(body,strCollection,type, callback) {
        resModel={}; 
        MongoClient.connect(project_info.mongoConnection.url, {
            useNewUrlParser: true
        }, function (err, client) {
            if (err) {
                resModel.err = err.message
                resModel.msg = "Opps! Something went wrong"
                callback(resModel)
            } else {
                const db = client.db(project_info.mongoConnection.db);
                const collection = db.collection(strCollection);
                if(type=="m"){
                    collection.deleteMany(body,function (err, res) {
                        if (err) {
                            resModel.err = err.message
                            resModel.msg = "Opps! Something went wrong"
                            callback(resModel)
                        } else {
                            resModel.msg = "Success";
                            resModel.data = res
                            callback(resModel)
                        }
                    });
                }
                else{
                    collection.deleteOne(body,function (err, res) {
                        if (err) {
                            resModel.err = err.message
                            resModel.msg = "Opps! Something went wrong"
                            callback(resModel)
                        } else {
                            resModel.msg = "Success";
                            resModel.data = res
                            callback(resModel)
                        }
                    });
                }
                
                client.close();
            }
           
        });
    }

}
module.exports = MongoConnector;