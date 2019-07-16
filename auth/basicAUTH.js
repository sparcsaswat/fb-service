var secretKey = require("./secretKey");
var auth = require("basic-auth");
class BasicAUTH{
    constructor(){
       
    }
    validateBasicAuth(request){
        var credentials = auth(request);
        if (!credentials || credentials.name !== secretKey.userId ||credentials.pass !== secretKey.pass)
        {
            return 0
        } else {
            return 1
        }
    }
}
module.exports=BasicAUTH;












