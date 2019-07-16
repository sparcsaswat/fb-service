class ResponseModel{
    
    constructor(){
        
    }
    set data(d){
        this._data=d;
    }
    set err(e){
       this._err=e;
    }
    set msg(m){
        this._msg=m;
    }
}
module.exports=ResponseModel;