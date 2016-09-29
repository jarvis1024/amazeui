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

window.model = {
    GROUPNAEM: {
        TAG_HTML: '<span data-vj-tag="\{\{INDEX\}\}" class="vj-tag-view">未命名</span>',
        TAB_HTML: '<div data-vj-tab="\{\{INDEX\}\}">'+
                '<div class="vj-ctrl vj-ctrl-input vj-input-mutiple" data-vj-gourp="GROUPNAEM">'+
                    '<div class="vj-ctrl-item" data-vj-index="">'+
                        '<span data-vj-title>名名</span>'+
                        '<div data-vj-elm data-vj-toview>'+
                            '<span data-vj="placeholder" >hinter</span>'+
                            '<span data-vj="counter" >0/1</span>'+
                            '<span data-vj="unit" >个</span>'+
                            '<input type="text" data-vj-name="FILED" data-vj-max="5000" data-vj-min="20" data-vj-price data-vj-len="12" data-vj-express="parseFloat({{}}).toFixed(2)">'+
                        '</div>'+
                        '<p data-vj-text >'+
                            '<span class="vj-err">123</span>'+
                            '<span class="vj-desc">123</span>'+
                        '</p>'+
                    '</div>'+
                '</div>'+
            '</div>'
    }
}

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

    $.fn.extend( {
        vj_alert: function( msg ){
            if( $(this).closest("[data-vj-elm]").length>0 ){
                $(this).closest(".vj-ctrl-item").find("[data-vj-text] .vj-err").html( msg ).show()
            }
        }
    } )

    // $("[data-vj-elm]").extend({
    //  alert: function(msg){
    //      $(this).siblings("[data-vj-text]").find(".vj-err").html(msg).show()
    //  }
    // })

    $.extend({
        vj_comfirm: function(option){
            if(!typeof(option.primary)==="function")
                return false
            
            if(!(typeof(option.default)==="function"))
                return false

            if( $("body>[class*=vj-cfm]").length )
                return false

            title = option.title || "确认操作";
            desc = option.desc || "该操作可能无法撤销，是否确认？";
            btn1 = option.primaryText || "确认";
            btn2 = option.defaultText || "取消";

            var box = $.parseHTML("<div class="+(option.theme? "vj-cfm-"+option.theme: "vj-cfm-box")+"><div><h5>"+title+"</h5><p>"+(option.icon? "<span data-vj-icon="+option.icon+"></span>": "")+desc+"</p><button id=vj_btn_primary>"+btn1+"</button><button id=vj_btn_default>"+btn2+"</button></div></div>")

            $(box).addClass( option.theme? "vj-cfm-"+option.theme: "vj-cfm-box" )
            
            $(box).find("#vj_btn_primary").on("click", option.primary )
            $(box).find("#vj_btn_default").on("click", option.default )
            $(box).find("#vj_btn_primary,#vj_btn_default,#vj_btn_close").on("click", function(){
                $(this).closest("[class*=vj-cfm]").remove()
            } )

            $(document.body).append(box)
        }
    })

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

            createContextMenu: function(e){
                $("body>.vj-context-menu").remove()
                e.preventDefault()
                var menu = document.createElement("div")
                    items = [],
                    $context = $(this),
                    ii = 0;

                $(menu)
                    .addClass("vj-context-menu")
                    .css({
                        top: e.clientY + 10,
                        left: e.clientX - 15,
                    })

                for( var x in e.data ){
                    items.push( document.createElement("div") )
                    items[ii].innerHTML = x;
                    $(items[ii])
                        .on("click", { target: $context }, e.data[x].fn || {} )
                        .css( e.data[x].css|| {} )
                    $(menu).append( items[ii] )
                    ii++;
                }

                $(document.body)
                    .append(menu)
                    .one("click", function(){
                        $(menu).remove()
                    })

            },

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

            check: {
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

            },

            table: {
                tag:{
                    updateTitle: function(){
                        var str = $(this).val() || $(this).attr("data-vj-value");
                            target = $(this).closest("[data-vj-tab]").attr("data-vj-tab");
                        $("[data-vj-tag='"+target+"']").html( str );
                    },

                    onClick: function(){
                        var tagIdx = $(this).attr("data-vj-tag"),
                            currIdx = $(this).siblings(".vj-active").attr("data-vj-tag");

                        if( !$(this).hasClass("vj-active") )
                            $(this).add( $(this).siblings(".vj-active") ).toggleClass("vj-active")
                        $(this).closest(".vj-table")
                            .find(".vj-tab-container [data-vj-tab="+ tagIdx +"]")
                                .addClass("vj-active").fadeIn(100)
                                .siblings().removeClass("vj-active").hide()
                    },

                    updatSort: function ( $table ){
                        $.each( $table.find("[data-vj-tab]"), function( idx, elm ){
                            $(elm).attr("data-vj-cache", $(elm).attr("data-vj-tab") )
                        });
                        $.each( $table.find("[data-vj-tag]"), function( idx, elm ){
                            $table
                                .find("[data-vj-cache="+ $(elm).attr("data-vj-tag") +"]")
                                .attr("data-vj-tab", idx )
                                .removeAttr("data-vj-cache")

                            $(elm).attr("data-vj-tag", idx)
                        })

                    },

                    add: function(){
                        var tagCount = $(".vj-tag-view").length,
                            tagHTML = $.parseHTML( model.GROUPNAEM.TAG_HTML.replace(/\{\{INDEX\}\}/g, tagCount) ),
                            tabHTML = $.parseHTML( model.GROUPNAEM.TAB_HTML.replace(/\{\{INDEX\}\}/g, tagCount) );

                        $( tabHTML )
                            .find("[data-vj-toview] [data-vj-value],input,textarea")
                            .on("change", vj.table.tag.updateTitle );
                        $( tagHTML )
                            .on("click", vj.table.tag.onClick )
                            .on("contextmenu", vj.table.tag.menuOption, vj.createContextMenu );

                        $(this)
                            .before( tagHTML )
                            .closest(".vj-table")
                            .find(".vj-tab-container")
                            .append( tabHTML )

                        $(tagHTML).trigger("click")
                    },

                    menuOption: {
                        "删除":{
                            fn: function(e){
                                (function($target){
                                    var idx = $target.attr("data-vj-tag"),
                                        $context = $target.closest(".vj-table");
                                    $.vj_comfirm({
                                        primary: function(){
                                            if( $target.is(".vj-active") ){
                                                ( $target.siblings(".vj-tag-view").length ?  
                                                    $target.siblings(".vj-tag-view:eq(0)")
                                                  : $target.nextAll("[data-vj-add]") 
                                                ).trigger("click")
                                            }

                                            $context.find("[data-vj-tag="+idx+"],[data-vj-tab="+idx+"]").remove()
                                            vj.table.tag.updatSort( $context )

                                        },
                                        default: function(){},
                                    })
                                })(e.data.target)
                            }
                        }

                    }

                }


            }
        }

    })()
    
    $(".vj-ctrl-input input, .vj-ctrl-input textarea")
        .on("input", vj.input.onInput )
        .on("change", vj.input.onChange )
        .on("bulr", vj.input.onBlur )

    $(".vj-ctrl-select [data-vj-elm]")
        .on("click", vj.select.onClick )
        .on("change", vj.select.onChange )

    $(".vj-ctrl-check [data-vj-elm] *")
        .on("click", vj.check.onClick )
        .on("change", vj.check.onChange )


    $(".vj-tag-table [data-vj-toview] [data-vj-value],input,textarea")
        .on("change", vj.table.tag.updateTitle )

    $(".vj-tag-view")
        .on("click", vj.table.tag.onClick )
        .on("contextmenu", vj.table.tag.menuOption, vj.createContextMenu )

    $(".vj-tag-container [data-vj-add]")
        .on("click", vj.table.tag.add )

    $(".vj-tag-table")
        .sortable({
            axis: "x",
            items: " .vj-tag-view",
            update: function(){vj.table.tag.updatSort($(this))}
        })



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