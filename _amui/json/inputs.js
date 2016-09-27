(function(){
	var jugEnum = [ "TYPE", "REQUIRED", "UNREUIRED", "ENUM", "LEN", "ITEM", "RENAME", "DEFAULT", "MAX", "MIN" ];

	var m_051 = {// menu/create
    "button":{
        "REQUIRED": true,
        "TYPE": Array,
        "LEN": [1,3],
        "ITEM": {
            "TYPE":Object,

            "name":{
                "REQUIRED": true,
                "TYPE": "string",
                "LEN": [0,16]
            },

            "type":{
                "REQUIRED": ["DEPEND", "sub_button", [null, undefined] ],
                "UNREQUIRED": ["INSTANCE", "sub_button", Array ],
                "TYPE": "string",
                "ENUM": [
                    "click", "view", "scancode_push", "scancode_waitmsg",
                    "pic_sysphoto", "pic_photo_or_album", "pic_weixin",
                    "location_select", "media_id", "view_limited"
                ],
            },

            "url": {
                "REQUIRED": ["DEPEND", "type", ["view"] ],
                "TYPE": "string",
                "LEN": [0, 1024]
            },

            "key": {
                "REQUIRED": ["DEPEND", "type", ["click"] ],
                "TYPE": "string",
                "LEN": [0, 128]
            },

            "media_id": {
                "REQUIRED": ["DEPEND", "type", ["media_id", "view_limited"] ],
                "TYPE": "string"
            },


            "sub_button":{
                "TYPE": Array,
                "LEN": [1,5],
                "ITEM": {
                    "TYPE": Object,

                    "sub_button":{
                        "REQUIRED": true,
                        "TYPE": Array,
                        "DEFAULT": [],
                        "LEN": [0,0]
                    },

                    "name":{
                        "REQUIRED": true,
                        "TYPE": "string",
                        "LEN": [0,60]
                    },

                    "type":{
                        "REQUIRED": true,
                        "TYPE": "string",
                        "ENUM": [
                            "click", "view", "scancode_push", "scancode_waitmsg",
                            "pic_sysphoto", "pic_photo_or_album", "pic_weixin",
                            "location_select", "media_id", "view_limited"
                        ],
                    },

                    "url": {
                        "REQUIRED": ["DEPEND", "type", ["view"] ],
                        "TYPE": "string",
                        "LEN": [0, 1024]
                    },

                    "key": {
                        "REQUIRED": ["DEPEND", "type", ["click"] ],
                        "TYPE": "string",
                        "LEN": [0, 128]
                    },

                    "media_id": {
                        "REQUIRED": ["DEPEND", "type", ["media_id", "view_limited"] ],
                        "TYPE": "string"
                    }
                }
            }
        }
    }
}
window.v_051 = (function(m){
	return {

	}
})( m_051 )

	var VJSON = function( init_judge, helper ){
	    var target,
	        judge = init_judge;

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


	    return {
	        validation : function( input_json ){
	            target = input_json;
	            this.result = parseFields( input_json, judge )
	            return this.result
	        },


	        getRequired : function( parent, valid, reqed ){
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
	        },

	        parseType : function( item, valid){
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
	        },

	        parseEnum : function( item, valid ){
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

	        },

	        getRename : function( parent, valid ){
	            if( valid.RENAME[0] === "DEPEND" ){
	                return valid.RENAME[1].indexOf(".")>=0 ?
	                    valid.RENAME[2][ DFV(valid.RENAME[1].split(".")) ]
	                  : valid.RENAME[2][ parent[valid.RENAME[1]] ]
	            }

	        },

	        getLength : function( item, valid ){
	            if( typeof(item) === "string" ){
	                // var dbcLen = item.match(/[^\x00-\xff]/g) || [];
	                // var chrLen = item.length + dbcLen.length *2 ;
	                var dubChr = item.match(/[\u0080-\u07ff]/g) || [],
	                    trbChr = item.match(/[\u0800-\uffff]/g) || [],
	                    chrLen = trbChr.length*2 + dubChr.length + item.length;
	                return chrLen>=valid.LEN[0] && chrLen<=valid.LEN[1] 
	            }else{
	                var arrLen = item || [];
	                return arrLen.length>=valid.LEN[0] && arrLen.length<=valid.LEN[1] 
	            }

	        },


	        parseFields : function( itm, vld ){

	            var parsed_itm = (itm instanceof Array? [] : {});
	            for( var i in (itm instanceof Array? itm : vld) ){

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
	                          : console.error("!!missing field: "+i )   //helper.alert( parsed_item[i].ERRMSG.REQ )
	                    }else{
	                        delete parsed_itm[i]
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
	                            console.error("!!error type: "+i)   //helper.alert( parsed_item[i].ERRMSG.TYP )
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
	                        console.error("!!error length: "+i) //$(paesed_itm[i].DOM).alert( parsed_item[i].ERRMSG.LEN )
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
	    }
	}

	var vj = (function(){
	    var ss;

	    var vj_fn = (function(){
	        var dubUtf8_REG = /[\u0080-\u07ff]/g ,
	            trbUtf8_REG = /[\u0800-\uffff]/g ,
	            dubByte_REG = /[^\x00-\xff]/g;


	        return {
	            checkLen : function( elm ){

	                if( $(elm).closest("[data-vj-utf8]").length ){
	                    var elmVal = elm.value || $(elm).attr("data-vj-value") || "", 
	                        limitLen = parseInt("0" + $(elm).attr("data-vj-len") ),
	                        dubChr = elmVal.match( dubUtf8_REG ) || [],
	                        trbChr = elmVal.match( trbUtf8_REG ) || [],
	                        chrLen = trbChr.length*2 + dubChr.length + elmVal.length;

	                    $(elm).siblings("[data-vj=counter]:first")
	                        .html( 
	                            parseInt(chrLen/3).toString() 
	                          + "/" 
	                          + parseInt(limitLen/3).toString() );

	                    return chrLen<=limitLen

	                }else if( $(elm).closest("[data-vj-gbk]").length ){
	                    //
	                }
	            },

	            nWindow : function(){
	                var thisDom = 
	                    '<div class=""> '
	                +   '<div> '
	            }

	        }
	    })();

	    return {

	        input:{
	            onInput: function(){
	                if( this.value ){
	                    $(this).siblings("[data-vj=placeholder]:first").hide()

	                    if( $(this).is("[data-vj-len]") ){
	                        !vj_fn.checkLen( this )?
	                            $(this).closest("[data-vj-elm]").addClass("vj-err vj-err-len")
	                          : $(this).closest("[data-vj-elm]").removeClass("vj-err vj-err-len")
	                    }

	                    $(this).closest(".vj-ctrl-item").find("[data-vj-text] .vj-err").hide()
	                }else{
	                    $(this).siblings("[data-vj=placeholder]:first").show()

	                }
	            } ,
	            onChange: function(){
	                var thisVal = this.value
	                if( $(this).is("[data-vj-max],[data-vj-min],[data-vj-price]") && isNaN( thisVal ) ){
	                    thisVal = "0"
	                }
	                if( !thisVal.trim() || thisVal==0 ){
	                    thisVal.toString().length ?
	                        $(this).siblings("[data-vj=placeholder]:first").hide()
	                      : $(this).siblings("[data-vj=placeholder]:first").show()
	                    this.value = thisVal
	                    return 0
	                }

	                if( $(this).is("[data-vj-max]") )
	                    thisVal = Math.min( thisVal, $(this).attr("data-vj-max") )

	                if( $(this).is("[data-vj-min]") )
	                    thisVal = Math.max( thisVal, $(this).attr("data-vj-min") )

	                if( $(this).is("[data-vj-price]") )
	                    $(this).attr( "data-vj-value", parseInt( thisVal*100 ) )

	                if( $(this).is("[data-vj-tofixed]") )
	                    thisVal = parseFloat(thisVal).toFixed(2)

	                if( $(this).is("[data-vj-express]") )
	                    thisVal = eval( $(this).attr("data-vj-express").replace(/\{\{\}\}/g , thisVal ) )

	                if( thisVal!==NaN && thisVal!==null )
	                    this.value = thisVal;

	            } ,
	            onBlur: function(){
	                // vj_fm.update( $(this).closest("data-vj-group") );
	            }

	        },

	        select: {
	            onClick: function(e){
	                if( $(e.target).is("[data-vj-data]") ){
	                    if( $(this).has("[data-vj-select='matrix']") ){
	                        var func = "css"; 
	                        var pram = 
	                            $(e.target).is("[data-vj-bgcolor]") ?
	                            { backgroundColor: $(e.target).attr("data-vj-bgcolor"), width: 20 }
	                            :{ width: 0 }
	                    }else{
	                        var func = "html";
	                        var pram = 
	                            $(e.target).is("[data-vj-html]") ?
	                            $(e.target).attr("data-vj-html")
	                            :""
	                    }

	                    $(this)
	                        .attr("data-vj-value", $(e.target).attr("data-vj-data") )
	                        .find("[data-vj=text]")
	                            .html( $(e.target).html() )
	                            .siblings("[data-vj=viewer]")[func](pram)
	                           
	                    $(this).trigger("change")
	                }
	                $(this).toggleClass("vj-active").find("[data-vj-select]").slideToggle(100);
	            },
	            onChange: function(){
	                // vj_fm.update( $(this).closest("data-vj-group") );

	            }

	        },

	        check:{
	            onClick: function(){
	                $(this).closest('[data-vj-check]').attr("data-vj-check")==="single" ?
	                    $(this).addClass("vj-checked").siblings().removeClass("vj-checked")
	                  : $(this).toggleClass("vj-checked");

	                var arrChecked = new Array();
	                $.each( 
	                    $(this).is(".vj-checked") ?
	                        $(this).siblings(".vj-checked").add(this)
	                      : $(this).siblings(".vj-checked")
	                    , function(idx, elm){
	                        arrChecked.push("\"" + $(elm).attr("data-vj-data") + "\"");
	                })

	                $(this).is("[data-vj-name]") ?
	                    $(this).attr("data-vj-value", $(this).is(".vj-checked") )
	                  : $(this).closest("[data-vj-name]").attr("data-vj-value", arrChecked.join(",") )

	                $(this).trigger("change")
	            },
	            onChange: function(){
	                // vj_fm.update( $(this).closest("data-vj-group") );
	            }
	        }
	    }

	})()
	
	$(".vj-ctrl-input input, .vj-ctrl-input textarea")
	    .on("input", vj.input.onInput )
	    .on("change", vj.input.onChange )
	    .on("bulr", vj.input.onBlur )

	$(".vj-ctrl-select [data-vj-elm] ")
	    .on("click", vj.select.onClick )
	    .on("change", vj.select.onChange )

	$(".vj-ctrl-check [data-vj-elm] *")
	    .on("click", vj.check.onClick )
	    .on("change", vj.check.onChange )

	$.fn.extend( {
	    vj_alert: function( msg ){
	        if( $(this).closest("[data-vj-elm]").length>0 ){
	            $(this).closest(".vj-ctrl-item").find("[data-vj-text] .vj-err").html( msg ).show()
	        }
	    }
	} )

	// $("[data-vj-elm]").extend({
	// 	alert: function(msg){
	// 		$(this).siblings("[data-vj-text]").find(".vj-err").html(msg).show()
	// 	}
	// })

	//CSS            
	$.each( $(".vj-ctrl-input input").siblings("[data-vj=unit],[data-vj=counter]"), function(){
	    $(this)
	        .siblings("input")
	            .css( "padding-right", (this.offsetWidth+8).toString() + "px" )
	} )

	$.each( $(".vj-select-matrix [data-vj-bgcolor]"), function(){
	    $(this)
	        .attr( "data-vj-bgcolor", $(this).css("background-color") )
	        .css("font-size",0)
	} )

})()