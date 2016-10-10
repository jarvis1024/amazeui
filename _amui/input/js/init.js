(function($){

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
                defaults = {},
                viewer = { dom:{}, data:{} },
                listener = {};
                

            listener.input = function( $target, mod ){
                if( !$target instanceof $ )
                    $target = $($target)

                $.each( $target.find(".vj-ctrl.vj-ctrl-input"), function(idx, elm){
                    var $elm = $(elm),
                        group = $elm.data("group"),
                        name = $elm.data("name"),
                        data = mod;
                        for( var ii=0,gp=group.split("."); ii<gp.length; ii++ ){
                            data = data[gp[ii]]
                        }

                    $elm.find(".vj-input")
                        .data( data )
                        .on("input", $elm.data(),  function(e){
                            var $this = $(this),
                                $item = $this.closest(".vj-item");

                            if( $this.val() ){
                                $this.siblings(".vj-placeholder").hide()

                                if( $this.is("[data-vj-len]") ){
                                    var limitLen = parseInt("0" + $this.attr("data-vj-len") ),
                                        chekLen = false

                                    if( $this.closest("[data-vj-utf8]").length ){
                                        var elmVal = elm.value || $this.attr("data-vj-value") || "", 
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

                                $item.find("[data-vj-text] .vj-err").hide()
                            }else{
                                $this.siblings(".vj-placeholder").show()

                            }
                        } )
                        // .on("", )
                        // .on("", )
                } )
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
                    listener.input( $target )
                    listener.select( $target )
                    listener.check( $target )
                    listener.file( $target )

                }

            })

            return $me
        } 
    }); 
})(jQuery)