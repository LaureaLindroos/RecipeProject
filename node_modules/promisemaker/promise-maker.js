/*
  promisemaker 0.1.3
 
  April 2016 Nodebite AB, Thomas Frank

  MIT Licensed - use anywhere you want!

  Converts methods using callbacks into methods returning promises. 
  Can convert a whole module/library (like fs) at once.
*/

/*
  Nodebite code style -> jshint settings below, also 
  indent = 2 spaces, keep your rows reasonably short
  also try to keep your methods below sceen height.
*/
/* jshint 
  loopfunc: true,
  trailing: true,
  sub: true,
  expr: true,
  noarg: false,
  forin: false
*/

module.exports = function(obj,settings){

  var defaultSettings = {
        // rejectOnErrors: If set to false resolves even on errors.
        rejectOnErrors: true,
        // syncFuncs : Strings and regexps to match function names against
        // when deciding if a function is synchronous.
        syncFuncs: [ /.*?Sync$/ ],
        // syncFuncsReturnPromises: If false returns the value directly
        // for a synchronous function, instead of a promise
        syncFuncsReturnPromises: true,
        // If the callback receives several arguments (apart from an error)
        // then we can map the arguments into property names.
        // If a mapping exists the promises receives an object,
        // otherwise it receives the argument array.
        mapArgsToProps: {/*"someFuncName": ["prop1", "prop2"]*/}
      },
      isFunc = obj && obj.constructor === Function,
      isObj = obj && !isFunc && obj instanceof Object;

  if(!isFunc && !isObj){
    throw new Error(
      'promise-maker needs a function or an object as input...'
    );
  }

  settings = Object.assign(defaultSettings, settings || {});

  var orgObj = obj,
      syncPromise = settings.syncFuncsReturnPromises,
      argsToProps = settings.mapArgsToProps,
      neverReject = !settings.rejectOnErrors;
  
  obj = Object.create(obj);
  obj = isFunc ? {func:obj} : obj;

  function mapArgs(funcName,args){
    var m = argsToProps[funcName];
    if(!m){return args;}
    var obj = {};
    m.forEach(function(prop){
      obj[prop] = args.shift();
    });
    return obj;
  }

  for(var i in obj){
    if(obj[i] && obj[i].constructor === Function){
      (function(){
        var funcName = i,
            orgFunc = obj[i],
            isSync = settings.syncFuncs.some(function(x){
              if(x.constructor === RegExp){
                return x.test(funcName);
              }
              return x === funcName;
            });
        obj[i] = function(){
          var res,
              rej,
              r,
              p = new Promise(function(a,b){res = a; rej = b;}),
              args = [].slice.call(arguments),
              orgCb = args[args.length-1] &&
                args[args.length-1].constructor === Function ?
                args.pop() : function(){};
 
          args.push(function(){
            var args = [].slice.call(arguments), err;
            for(var i = 0; i < args.length; i++){
              if(args[i] && args[i].constructor === Error){
                err = true;
                !neverReject && rej(args[i]);
                break;
              }
            }
            if(!err && (args[0] === undefined || args[0] === null)){
              args.shift(); // err was probably at args[0]
            }
            res(args.length > 1 ? mapArgs(funcName,args): args[0]);
            return orgCb.apply(this,arguments);
          });

          try {
            r = orgFunc.apply(orgObj,isSync ? args.slice(0,-1) : args);
          }
          catch(e){
            r = e;
          }
          isSync && syncPromise && args.pop()(r);
          return isSync && !syncPromise ? r : p;
        };
      })();
    }
  }

  return isFunc ? obj.func : obj;

};
