var express = require("express");
var Request = require("request");
var router = express.Router();
const BasicAuth = require("../auth/basicAUTH");
const ResponseModel = require("../api-helper/res-model")
const basicAUTH = new BasicAuth();
var resModel = new ResponseModel();
const pConfig = require('../project-config');

const fs = require("fs");
setTimeout(function () {}, 3000);

let rawdata = fs.readFileSync("./api.json");
let api_req = JSON.parse(rawdata);

api_req.map((api) => {

  switch(true) {    
    case api.method == "get" && api.isRemoteAPI==1:    
      getApi(api)
      break;
    case api.method == "post" && api.isRemoteAPI==1:
      postApi(api)
     break;
    case api.method == "post" && !api.isRemoteAPI:
      postApiInternal(api)
      break;
    case api.method == "get" && !api.isRemoteAPI:
      getApiInternal(api)
      break;
    case api.method == "put" && !api.isRemoteAPI:
      putApiInternal(api)
      break;
    case api.method == "delete" && !api.isRemoteAPI:
      deleteApiInternal(api)
      break;
    default:    
      //return res.status(200).send("Method Not Found");
      break;
  }  
})

function getApi(api){
  resModel={}; 
  router.get(api.apiName, (req, res) => {
    //API Authentication Logic for Get API
    let isValidBasicAuth
    if (api.auth != "") {
      isValidBasicAuth = basicAUTH.validateBasicAuth(req);
    } else {
      isValidBasicAuth = 1
    }
    if (isValidBasicAuth) {
      let dynamicParam = "";
      if (api.remoteApi.paramType == "q") { //Defined for Query Param
        dynamicParam += "?"
        for (let key in req.params) {
          dynamicParam += key + "=" + req.params[key] + "&"
        }
      } else { //Defined for URL Param
        for (let key in req.params) {
          dynamicParam += key + "/" + req.params[key]
        }
      }
      Request.get({
        url: api.remoteApi.endPoint + dynamicParam
      }, (rem_err, rem_res, rem_body) => {
        if (rem_err) {
          resModel.err = rem_err;
          resModel.msg = "Opps! Something went wrong"
          return res.status(500).send(resModel)
        } else {
          resModel.data = JSON.parse(rem_body);
          resModel.msg = "Success";
          return res.status(200).send(resModel);
        }
      })
    } else {
      res.setHeader("WWW-Authenticate", 'Basic realm="CSM"');
      res.status(403).end("Access denied")
    }
  })
}
function postApi(api){
  resModel={}; 
  router.post(api.apiName, function (req, res, next) {
    //API Authentication Logic for POST API
    let isValidBasicAuth
    if (api.auth != "") {
      isValidBasicAuth = basicAUTH.validateBasicAuth(req);
    } else {
      isValidBasicAuth = 1
    }

    if (isValidBasicAuth) {
      Request.post({
        headers: {
          'content-type': 'application/json'
        },
        url: api.remoteApi.endPoint,
        body: req.body,
        json: true
      }, function (rem_err, rem_res, rem_body) {
        if (rem_err) {
          resModel.err = rem_err;
          resModel.msg = "Opps! Something went wrong"
          return res.status(500).send(resModel)
        } else {
          resModel.data = rem_body;
          resModel.msg = "Success";
          return res.status(200).send(resModel);
        }

      });
    } else {
      res.setHeader("WWW-Authenticate", 'Basic realm="CSM"');
      res.status(403).end("Access denied")
    }

  })
}
function postApiInternal(api){
  let ClsBusiness = require(`${pConfig.controllerClassDir}/${api.businessClass}`);
  router.post(api.apiName, function (req, res, next) {
    let isValidBasicAuth
    if (api.auth != "") {
      isValidBasicAuth = basicAUTH.validateBasicAuth(req);
    } else {
      isValidBasicAuth = 1
    }
    if (isValidBasicAuth) {        
      let objBusuness = new ClsBusiness(req.params,req.body);
      objBusuness.execute(function (resData) {
        res.status(200).send(resData);
      })

    } else {
      res.setHeader("WWW-Authenticate", 'Basic realm="CSM"');
      res.status(403).end("Access denied");
    }
  })
}
function getApiInternal(api){
  let ClsBusiness = require(`${pConfig.controllerClassDir}/${api.businessClass}`);
    router.get(api.apiName, function (req, res, next) {
      let isValidBasicAuth
      if (api.auth != "") {
        isValidBasicAuth = basicAUTH.validateBasicAuth(req);
      } else {
        isValidBasicAuth = 1
      }
      if (isValidBasicAuth) {         
        let objBusuness = new ClsBusiness(req.params);
        objBusuness.execute(function (resData) {
          res.status(200).send(resData);
        })

      } else {
        res.setHeader("WWW-Authenticate", 'Basic realm="CSM"');
        res.status(403).end("Access denied");
      }
    })    
}
function putApiInternal(api){
  let ClsBusiness = require(`${pConfig.controllerClassDir}/${api.businessClass}`);
    router.put(api.apiName, function (req, res, next) {
      let isValidBasicAuth
      if (api.auth != "") {
        isValidBasicAuth = basicAUTH.validateBasicAuth(req);
      } else {
        isValidBasicAuth = 1
      }
      if (isValidBasicAuth) {
        
        let objBusuness = new ClsBusiness(req.params,req.body);
        objBusuness.execute(function (resData) {
          res.status(200).send(resData);
        })

      } else {
        res.setHeader("WWW-Authenticate", 'Basic realm="CSM"');
        res.status(403).end("Access denied");
      }
    })
}
function deleteApiInternal(api){
  let ClsBusiness = require(`${pConfig.controllerClassDir}/${api.businessClass}`);
    router.delete(api.apiName, function (req, res, next) {
      let isValidBasicAuth
      if (api.auth != "") {
        isValidBasicAuth = basicAUTH.validateBasicAuth(req);
      } else {
        isValidBasicAuth = 1
      }
      if (isValidBasicAuth) {
        
        let objBusuness = new ClsBusiness(req.params,req.body);
        objBusuness.execute(function (resData) {
          res.status(200).send(resData);
        })

      } else {
        res.setHeader("WWW-Authenticate", 'Basic realm="CSM"');
        res.status(403).end("Access denied");
      }
    })
}
module.exports = router;