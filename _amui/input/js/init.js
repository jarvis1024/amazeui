(function($){

    // @param REQUIRED : boolean / arrary 4 judge 
    // @param UNREQUIRED : boolean / arrary 4 judge 
    // @param TYPE : string / __proto__[Array, Object]
    // @param LEN : array[ min, max] @TYPE === Array
    // @param MAX : int { max numer}
    // @param MIN : int { min numer}
    // @param ITEM : object { child fields }
    // @param FORMAT : ["money", "percent", "url" ...]
    // @param EXPRESS : string @example "parseInt({{}}*100)"
    // @param FILE : Object{ FN, OPTION }
    /*
        @FN function( $target){
            do sth for $target ( button || div )
        }
    */


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
                            "LEN": [0,0],
                            "ITEM":{}
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
    };

    $.fn.extend({ 

        vj_config: function( option ){ 
            var $me = this,
                defaults = {
                    charset : "UTF-8"
                },
                viewer = { dom:{}, data:{} },
                listener = {};

            var dubUtf8_REG = /[\u0080-\u07ff]/g ,
                trbUtf8_REG = /[\u0800-\uffff]/g ,
                dubByte_REG = /[^\x00-\xff]/g;

            option = $.extend( true, {}, option, defaults )
                

            listener.input = function( $target, mod ){
                if( !$target instanceof $ )
                    $target = $($target);

                var onInput = function(e){
                        var $this = $(this),
                            $item = $this.closest(".vj-item"),
                            model = $this.closest(".vj-ctrl").data();

                        if( $this.val() ){
                            $this.siblings(".vj-placeholder").hide()

                            if( $.isArray(model.LEN) ){
                                var limitLen = model.LEN[1],
                                    chekLen = false;

                                if( option.charset.toUpperCase()==="UTF-8" ){
                                    var elmVal = $this.val() , 
                                        dubChr = elmVal.match( dubUtf8_REG ) || [],
                                        trbChr = elmVal.match( trbUtf8_REG ) || [],
                                        chrLen = trbChr.length*2 + dubChr.length + elmVal.length;

                                    $this.siblings(".vj-counter")
                                        .html( ""
                                          + parseInt(chrLen/3)
                                          + "/" 
                                          + parseInt(limitLen/3) );

                                    chekLen = chrLen<=limitLen

                                }else if( $this.closest("[data-vj-gbk]").length ){
                                    //
                                }
                                chekLen?
                                    $item.removeClass("vj-err vj-err-len")
                                  : $item.addClass("vj-err vj-err-len")
                            }

                            $item.closest(".vj-ctrl").find(".vj-desc .vj-err").hide()
                        }else{
                            $this.siblings(".vj-placeholder").show()

                        }

                        $this.closest(".vj-ctrl").data( model )
                    },
                    onChange = function(e){
                        var $this = $(this),
                            $item = $this.closest(".vj-item"),
                            thisVal = $this.val(),
                            model = $this.closest(".vj-ctrl").data();

                        if( model.MAX )
                            thisVal = Math.min( thisVal, model.MAX )

                        if( model.MIN )
                            thisVal = Math.max( thisVal, model.MIN )

                        switch( model.FORMAT||"" ){
                            case "price":
                                thisVal = parseInt(thisVal*100)/100; 
                                model.value = parseInt(thisVal*100)
                                break;
                            case "percent": 
                                thisVal = parseInt(thisVal*10)/10; 
                                model.value = parseInt(thisVal*10)/1000
                                break;
                            default: 
                                model.value = thisVal
                                break;
                        }

                        if( model.EXPRESS )
                            model.value = eval( model.EXPRESS.replace(/\{\{\}\}/g , model.value ) )
                        
                        $this.val(thisVal)
                        $this.siblings(".vj-placeholder")[ $this.val()? "hide":"show"]()
                        $this.closest(".vj-ctrl").data(model).trigger("change")
                    };

                $.each( $target.find(".vj-ctrl.vj-ctrl-input"), function(idx, elm){
                    var $elm = $(elm),
                        group = $elm.data("group"),
                        name = $elm.data("name"),
                        data = mod;

                    for( var ii=0,gp=group.split("."); ii<gp.length; ii++ ){
                        data = data[gp[ii]]
                        if( data.TYPE===Array ) // if Group is a Array Object
                            data = data.ITEM
                    }

                    //CSS
                    if( $elm.is(":has(.vj-counter):has(input.vj-input)") ){
                        $elm.find("input.vj-input")
                            .css( "padding-right", ($elm.find(".vj-counter").width()+8) + "px" )
                    } 

                    $elm.data( data[name] )
                        .find(".vj-input")
                        .on("input", onInput)
                        .on("change", onChange)
                } )
            };

            listener.select = function( $target, mod ){
                if( !$target instanceof $ )
                    $target = $($target);

                if( $.inArray(".vj-ctrl-select>.vj-item.vj-active",  $me.GlobalEvent.click.selector)<0 ){
                    $me.GlobalEvent.click.selector.push( ".vj-ctrl-select>.vj-item.vj-active" )
                    $me.GlobalEvent.click.target.push( ".vj-item.vj-active" )
                    $me.GlobalEvent.click.className.push( "vj-active" )
                }

                var onClick =  function(e){
                        var $tar = $(e.target),
                            $this = $(this)
                            $ctrl = $this.closest(".vj-ctrl"),
                            model = $ctrl.data();

                        if( $tar.data("value") ){
                            var func, param
                            if( $ctrl.is(".vj-select-matrix") ){
                                func = "css"; 
                                param =  $tar.is("[data-bgcolor]") ?
                                    { backgroundColor: $tar.attr("data-bgcolor"), width: 20, marginRight: 6 }
                                    :{ width: 0 }
                            }else{
                                func = "html";
                                param = $tar.is("[data-html]") ?
                                    $tar.attr("data-html")
                                    :""
                            }

                            model.value = $tar.data("value")
                            $this.find(".vj-text").html( $tar.html() )
                            $this.find(".vj-viewer")[func](param)
                                   
                        }

                        $this.toggleClass("vj-active").find(".vj-select")
                        $ctrl.data(model).trigger("change")
                    }

                $.each( $target.find(".vj-ctrl.vj-ctrl-select"), function(idx, elm){
                    var $elm = $(elm),
                        group = $elm.data("group"),
                        name = $elm.data("name"),
                        data = mod;

                    for( var ii=0,gp=group.split("."); ii<gp.length; ii++ ){
                        data = data[gp[ii]]
                        if( data.TYPE===Array ) // if Group is a Array Object
                            data = data.ITEM
                    }

                    //CSS
                    if ($elm.is(".vj-select-matrix")){
                        $.each( $elm.find(".vj-select>[data-bgcolor] "), function( sIdx, sElm ){
                            $(sElm)
                                .attr( "data-bgcolor", $(sElm).css("background-color") )
                                .css("font-size",0)
                        } )
                    }

                    $elm.data( data[name] )
                        .find(".vj-item")
                        .on("click", onClick)
                } )

            };

            listener.check = function( $target, mod ){
                if( !$target instanceof $ )
                    $target = $($target);

                var onClick = function(e){
                    var $this = $(this),
                        $ctrl = $this.closest(".vj-ctrl"),
                        model = $ctrl.data()

                    $ctrl.is(".vj-check-single") ?
                        $this.addClass("vj-checked").siblings().removeClass("vj-checked")
                      : $this.toggleClass("vj-checked");

                    var arrChecked = new Array();
                    $.each( 
                        $this.is(".vj-checked") ?
                            $this.siblings(".vj-checked").add(this)
                          : $this.siblings(".vj-checked")
                        , function(idx, elm){
                            arrChecked.push("\"" + $(elm).data().value + "\"");
                    })

                    $this.is("[data-vj-name]") ?
                        $this.attr("data-vj-value", $this.is(".vj-checked") )
                      : $this.closest("[data-vj-name]").attr("data-vj-value", arrChecked.join(",") )

                    $this.trigger("change")

                };

                $.each( $target.find(".vj-ctrl.vj-ctrl-check"), function(idx, elm){
                    var $elm = $(elm),
                        group = $elm.data("group"),
                        name = $elm.data("name"),
                        data = mod;

                    for( var ii=0,gp=group.split("."); ii<gp.length; ii++ ){
                        data = data[gp[ii]]
                        if( data.TYPE===Array ) // if Group is a Array Object
                            data = data.ITEM
                    }

                    $elm.data( data[name] )
                        .find(".vj-item>span")
                        .on("click", onClick)
                } )


            };
            $me.GlobalEvent = {
                click:{
                    selector: [],
                    target: [],
                    className: []
                }
            }
            $me.data( viewer )
            $me.extend({
                vjUpdate: function( fn ){
                    if( $.isFunction(fn) )
                        $me.on( "vjUpdate", function(){
                            fn($(this).data())
                        } )
                },
                vjSubmit: function( fn ){
                    if( $.isFunction(fn) ){
                        $me.on( "vjSubmit", function(){
                            fn($(this).data())
                        } )
                    }
                },
                vjOn: function( e,fn ){
                    if( $.isFunction(fn) )
                        $me.on( "vj"+e[0].toUpperCase()+e.substr(1),  function(){
                            fn($(this).data())
                        } )
                },
                vjOff: function( e ){
                    $me.off( "vj"+e[0].toUpperCase()+e.substr(1) )

                },
                vjInit: function( dom ){
                    //绑定
                    var $target = dom||$me;
                    listener.input( $target, m_051 )
                    listener.select( $target, m_051 )
                    // listener.check( $target )
                    // listener.file( $target )

                }

            })

            $(document.body).on("click", {G : $me.GlobalEvent.click },function(e){

                var selector, target, className,g = e.data.G;

                selector = g.selector.join(",")
                target = g.target.join(",")
                className = g.className.join(" ")
                $.each( $( selector ), function(aIdx, aElm){
                    if( $( e.target ).closest( target )[0]!==aElm ){
                        $( aElm ).removeClass( className )
                    }
                })

            })


            return $me
        } 
    }); 
})(jQuery)