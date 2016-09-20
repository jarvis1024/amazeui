var VJSON = function( init_judge ){
    var target,
        judge = init_judge,
        jugEnum = [ "TYPE", "REQUIRED", "UNREUIRED", "ENUM", "LEN", "ITEM", "RENAME", "DEFAULT", "MAX", "MIN" ],

        isEmtyObject = function( obj ){
            for ( var ii in obj ) {
               return false
            }
            return true
        },

        DFV = function(l) {
            var r = target;
            for(var i=0; i<l.length; i++){
                r = r[l[i]];
            }
            return r
        }

    if( isEmtyObject( judge ) ){
        console.error("Missing required parameters!")
        return undefined;
    }
        this.validation = function( input_json ){
            target = input_json;
            this.result = parseFields( input_json, judge )
            return this.result
        }


    this.getRequired = function( parent, valid, reqed ){
        if( valid[reqed]===undefined ) return false

        if( ! (valid[reqed] instanceof Array) ) return valid[reqed]

        if( valid[reqed][0] === "DEPEND" ){
            return valid[reqed][1].indexOf(".")>=0 ?
                valid[reqed][2].indexOf( DFV( valid[reqed][1].split(".") ) )>=0
              : valid[reqed][2].indexOf( parent[ valid[reqed][1] ] )>=0

        }
        if( valid[reqed][0] === "INSTANCE" ){
            return parent[ valid[reqed][1] ] instanceof valid[reqed][2]
        }
    }

    this.parseType = function( item, valid){
        switch( valid.TYPE )
        {
            case "string":
                return String(item); break;
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

    this.parseEnum = function( item, valid ){
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

    this.getRename = function( parent, valid ){
        if( valid.RENAME[0] === "DEPEND" ){
            return valid.RENAME[1].indexOf(".")>=0 ?
                valid.RENAME[2][ DFV(valid.RENAME[1].split(".")) ]
              : valid.RENAME[2][ parent[valid.RENAME[1]] ]
        }

    }

    this.getLength = function( item, valid ){
        if( typeof(item) === "string" ){
            var dbcLen = item.match(/[^\x00-\xff]/g) || [];
            var chrLen = item.length + dbcLen.length *2 ;
            return chrLen>=valid.LEN[0] && chrLen<=valid.LEN[1] 
        }else{
            var arrLen = item || [];
            return arrLen.length>=valid.LEN[0] && arrLen.length<=valid.LEN[1] 
        }

    }


    this.parseFields = function( itm, vld ){

        var parsed_itm = itm instanceof Array? [] : {};
        for( var i in itm instanceof Array? itm : vld ){

            if( jugEnum.indexOf(i)>=0 ) continue
            if( !vld[i] ) vld[i] = vld;

            parsed_itm[i] = itm[i]


            if( vld[i].RENAME ){
                var i_past = i;
                i = getRename( itm, vld[i] )
                parsed_itm[i] = parsed_itm[i_past];
                vld[i] = vld[i_past];
                delete parsed_itm[i_past]
                delete vld[i].RENAME
            }

            if( parsed_itm[i] === undefined ){
                if( getRequired( itm, vld[i], "REQUIRED" ) ){
                    vld[i].DEFAULT ?
                        parsed_itm[i] = vld[i].DEFAULT
                      : console.error("!!missing field: "+i )
                }else{
                    console.log( false )
                    console.log( delete parsed_itm[i] )
                }
                continue
            }

            if( getRequired( itm, vld[i], "UNREQUIRED" ) ){
                delete parsed_itm[i]
                continue
            }

            if( vld[i].TYPE ){
                if( vld[i].TYPE.prototype ){
                    if( ! parsed_itm[i] instanceof vld[i].TYPE ){
                        console.error("!!error type: "+i)
                        continue
                    }
                }else{
                    parsed_itm[i] = parseType( parsed_itm[i], vld[i] )
                }
            }

            if( vld[i].ENUM ){
                if( vld[i].ENUM.length>0 ){
                    parsed_itm[i] = parseEnum( parsed_itm[i], vld[i] )
                }
            }

            if( vld[i].LEN ){
                if( ! getLength( parsed_itm[i], vld[i] ) ){
                    console.error("!!error length: "+i)
                    continue
                }
            }

            // Allways Check Array First Because : [] instanceof Object = true
            if( parsed_itm[i] instanceof Array ){
                if( vld[i].ITEM.TYPE === Object ){
                    for( var idx in parsed_itm[i] ){
                        parsed_itm[i][idx] = parseFields( parsed_itm[i][idx], vld[i].ITEM )
                    }
                }else{
                    parsed_itm[i] = parseFields( parsed_itm[i], vld[i].ITEM )
                }

            }else if( parsed_itm[i] instanceof Object ){
                parsed_itm[i] = parseFields( parsed_itm[i], vld[i] )

            }

        }

        return parsed_itm
    }

    return this
}
