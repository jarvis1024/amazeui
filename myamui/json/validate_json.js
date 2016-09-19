var VJSON = function( juger ){
    var target = {};
    this.result = {};
    this.jug = juger;

    var jugEnum = [ "TYPE", "REQUIRED", "UNREUIRED", "ENUM", "LEN", "ITEM" ]

    target = {
        "s1":{
            "a": 1474277307,
            "b": "1.2",
            "c": "3",
            "d": [1,2,3],
            "e": ["1","5","3"],
            "f": [{"ss":1},{"ss":1},{"ss":1}]
        },
        "s2":[{
            "type": "required"
        }]
    }
    this.jug = {
        "s2":{
            "TYPE": Array,
            "ITEM": Object,
            "REQUIRED": true,

            "type":{
                "TYPE": "string",
                "REQUIRED": true
            },
            "url":{
                "TYPE": "string",
                "REQUIRED": [ "DEPEND", "type", ["required_url"] ]
            }
        },
        "s1":{
            "TYPE": Object,
            "REQUIRED": false,
            "b":{
                "TYPE":"int",
                "UNREQUIRED": [ "DEPEND", "a", [1474277307] ]

            }
        }
    }

    this.getReqed = function( parent, valid, reqed ){
        // reqed = REQUIRED, UNREQUIRED
        // getRequired( button[x], v.button.url )
        // getRequired( button, v.button.url )
        if( valid[reqed]===undefined ) return false

        if( ! (valid[reqed] instanceof Array) ) return valid[reqed]

        if( valid[reqed][0] === "DEPEND" ){
            if( valid[reqed][2].indexOf(".")<0 ){
                var DFS = valid[reqed][1];
                return valid[reqed][2].indexOf( parent[DFS] )>=0
            }else{
                var DFL = valid[reqed][1].split("."); //depend_field_location
                var DFV = result;
                for(var i=0; i<DFL.length; i++){
                    DFV = DFV[DFL[i]];
                }
                return valid[reqed][2].indexOf( DFV )>=0
            }
        }
    }

    this.getUnrequired = function( parent, valid ){
        // getRequired( button[x], v.button.url )
        // getRequired( button, v.button.url )

        if( ! (valid.UNREQUIRED instanceof Array) ) return valid.UNREQUIRED

        if( valid.UNREQUIRED[0] === "DEPEND" ){
            if( valid.UNREQUIRED[2].indexOf(".")<0 ){
                var DFS = valid.UNREQUIRED[1];
                return valid.UNREQUIRED[2].indexOf( parent[DFS] )>=0
            }else{
                var DFL = valid.UNREQUIRED[1].split("."); //depend_field_location
                var DFV = result;
                for(var i=0; i<DFL.length; i++){
                    DFV = DFV[DFL[i]];
                }
                return valid.UNREQUIRED[2].indexOf( DFV )>=0
            }
        }
    }

    this.getRequired = function( parent, valid ){
        // getRequired( button[x], v.button.url )
        // getRequired( button, v.button.url )

        if( ! (valid.REQUIRED instanceof Array) ) return valid.REQUIRED

        if( valid.REQUIRED[0] === "DEPEND" ){
            if( valid.REQUIRED[2].indexOf(".")<0 ){
                var DFS = valid.REQUIRED[1];
                return valid.REQUIRED[2].indexOf( parent[DFS] )>=0
            }else{
                var DFL = valid.REQUIRED[1].split("."); //depend_field_location
                var DFV = result;
                for(var i=0; i<DFL.length; i++){
                    DFV = DFV[DFL[i]];
                }
                return valid.REQUIRED[2].indexOf( DFV )>=0
            }
        }
    }

    this.getType = function( item, valid ){
        return valid.TYPE.prototype !== undefined?
            item instanceof valid.TYPE : true
    }

    this.parseType = function( item, valid){
        if( valid.TYPE.prototype !== undefined ){
            return new valid.TYPE(item)
            //return item instanceof valid.TYPE
        }else{
            switch( valid.TYPE )
                {
                    case "string":
                        return item.toString(); break;
                    case "int":
                        return parseInt(item); break;
                    case "float":
                        return parseFloat(item); break;
                    case "bool":
                        return Boolean(item); break;
                    default:
                        return item; break;
                }

        }
                       
    }

    this.getEnum = function( item, valid ){
        if( item instanceof Array ){
            for (var i=0; i<item.length; i++) {
                if( valid.ENUM.indexOf( item[i] )<0 ){
                    item.splice(i,1);
                    i--;
                }
            }
            return item.length===0?  undefined : item
        }else{
            return valid.ENUM.indexOf( item )<0? undefined : item
        }

    }

    this.parseField = function( itm, vld ){
        for( var i in vld ){
            if( jugEnum.indexOf(i)>=0 ) continue

            if( vld[i].ENUM !== undefined ){
                itm[i] = getEnum( itm[i], vld[i] )
            }

            if( itm[i] == undefined || itm[i].length == 0 ){
                if( getReqed( itm, vld[i], "REQUIRED" ) ){
                    console.log("!!missing field:"+i )
                }
                continue
            }

            if( getReqed( itm, vld[i], "UNREQUIRED" ) ){
                delete itm[i]
                continue
            }

            if( !getType( itm[i], vld[i] ) ){
                console.log("!!error type:"+i)
                continue
            }

            if( itm[i] instanceof Array && vld[i].TYPE===Array && vld[i].ITEM===Object ){
                for( var ii in itm[i] ){
                    itm[i][ii] = parseField( itm[i][ii], vld[i] )
                }
            }else if( itm[i] instanceof Object ){
                itm[i] = parseField( itm[i], vld[i] )
            }else{
                itm[i] = parseType( itm[i], vld[i] )
            }

        }
        return itm
    }

    this.result = target;
    this.abcd = target;
    return this
}
/*
required
*/