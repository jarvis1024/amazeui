function j( json, views ) {
    var defaults = $.extend( true, views, {
            "INPUT": {
                "CLASS": "vj-input-single",
                "INPUT": "input",
                "ERRMSG":{
                    "LEN": "长度超出限制",
                    "TYP": "格式错误",
                    "REQ": "必须填写"
                }
            },
            "SELECT": {
                "CLASS": "vj-select-text",
                "ITEM":{},
                "ERRMSG":{
                    "LEN": "长度超出限制",
                    "TYP": "格式错误",
                    "REQ": "必须填写"
                }
            },
            "CHECK": {
                "CLASS": "vj-check-box",
                "ITEM":{},
                "ERRMSG":{
                    "LEN": "长度超出限制",
                    "TYP": "格式错误",
                    "REQ": "必须填写"
                }
            },
            "BOOL": {
                "CLASS": "vj-check-box",

            },
            "FILE": {

            },
            "TITLE":{
                "button":       "自定义菜单",
                "type":         "类型",
                "name":         "名称",
                "url":          "链接地址",
                "media_id":     "素材",
                "key":          "事件组",
                "sub_button":   "子菜单"
            },
            "ITEM":{
                "sub_button":       "子菜单",
                "click":            "自定义事件",
                "view":             "打开网页",
                "scancode_push":    "扫码推事件(打开网页)",
                "scancode_waitmsg": "扫码推事件(等待消息)",
                "pic_sysphoto":     "弹出拍照发图",
                "pic_weixin":       "弹出相册发图",
                "pic_photo_or_album":"弹出拍照或相册发图",
                "location_select":  "弹出地理位置",
                "media_id":         "下发素材",
                "view_limited":     "打开图文页面"
            },
            "CUSTOM":{}
        } ),
        // defaults = {
        //     "INPUT": {
        //         "CLASS": "vj-input-single",
        //         "INPUT": "input",
        //         "ERRMSG":{
        //             "LEN": "长度超出限制",
        //             "TYP": "格式错误",
        //             "REQ": "必须填写"
        //         }
        //     },
        //     "SELECT": {
        //         "CLASS": "vj-select-text",
        //         "ITEM":{},
        //         "ERRMSG":{
        //             "LEN": "长度超出限制",
        //             "TYP": "格式错误",
        //             "REQ": "必须填写"
        //         }
        //     },
        //     "CHECK": {
        //         "CLASS": "vj-check-box",
        //         "ITEM":{},
        //         "ERRMSG":{
        //             "LEN": "长度超出限制",
        //             "TYP": "格式错误",
        //             "REQ": "必须填写"
        //         }
        //     },
        //     "BOOL": {
        //         "CLASS": "vj-check-box",

        //     },
        //     "FILE": {

        //     },
        //     "TITLE":{
        //         "button":       "自定义菜单",
        //         "type":         "类型",
        //         "name":         "名称",
        //         "url":          "链接地址",
        //         "media_id":     "素材",
        //         "key":          "事件组",
        //         "sub_button":   "子菜单"
        //     },
        //     "ITEM":{
        //         "sub_button":       "子菜单",
        //         "click":            "自定义事件",
        //         "view":             "打开网页",
        //         "scancode_push":    "扫码推事件(打开网页)",
        //         "scancode_waitmsg": "扫码推事件(等待消息)",
        //         "pic_sysphoto":     "弹出拍照发图",
        //         "pic_weixin":       "弹出相册发图",
        //         "pic_photo_or_album":"弹出拍照或相册发图",
        //         "location_select":  "弹出地理位置",
        //         "media_id":         "下发素材",
        //         "view_limited":     "打开图文页面"
        //     },
        //     "CUSTOM":json.CUSTOM
        // },
        target = json ,
        result = {},
        resum = ["TYPE", "REQUIRED","UNREQUIRED","LEN","ENUM","DEFAULT","TEMPLATE","TITLE","INPUT","SELECT","CHECK","FILE","ITEM"];
        delete json.CUSTOM

    var glevel = 0;

    function setGroup(a, b){
        $.each( a, function(eIdx){
            if( $.inArray(eIdx, resum)>-1 || !a[eIdx].hasOwnProperty("TEMPLATE") ){
                return true
            }

            if( $.inArray(a[eIdx].TEMPLATE, ["table", "table_tag", "tag"])>-1){
                setGroup( a[eIdx], b)
            }

            if( a[eIdx].GROUP=="undefined" ){
                a[eIdx].GROUP= b
            }else if( a[eIdx].GROUP!=="ROOT" && b!=="ROOT"){
                a[eIdx].GROUP= b+"."+a[eIdx].GROUP
            }
        } )

        return a
    }

    function eca( a, b, c, d){
        a[d] = b[d];
        if( c instanceof Array ){
            for(var ii=0;ii<c.length;ii++){
                a[d].ITEM[c[ii]] = b.ITEM[c[ii]]||"unknow"; 
            }
        }else{
            $.getJSON( c.url, c.param, function(d){ a[d].ITEM = d });
        }
        return a
    }
    function loop( a, b, c ){
        /*
         * @param a : target, 
         * @param b : default,
         * @param c : result,
         * @param g : global result
         * @return result
         */
        var lev = glevel++, d;

        $.each( a, function(idx, elm){

            if( $.inArray(idx, resum)>-1) return true

            d  = {};

            if( elm.TYPE===Object ){
                d = loop(elm, b, {} )

                d.TEMPLATE = "table";
                d.TITLE = b.TITLE[idx]
                d.GROUP = lev===0? "ROOT": "undefined"
                //

            }else{
                if( elm.TYPE===Array ){
                    elm = elm.ITEM
                    if( elm.TYPE===Object ){
                        d = loop( elm, b, {} )
                        d.TITLE = b.TITLE[idx]
                        if( lev===0 ){
                            d.TEMPLATE = "table_tag"
                            d.GROUP = "ROOT"
                        }else{
                            d.TEMPLATE = "tag"
                            d.GROUP = "undefined"
                        }
                        //if Object
                    }else{
                        if ( !elm.TYPE ) return true  //for empty field

                        if( elm.hasOwnProperty("ENUM") ){
                            d = eca( d, b, elm.ENUM, "CHECK" )
                            d.CHECK.TITLE = b.TITLE[idx]
                            d.CHECK = $.extend(true, {}, d.CHECK, b.CUSTOM[idx] )

                        }else{

                            //do sth judge for file or else
                            d.INPUT = b.INPUT;
                            d.INPUT.TITLE = b.TITLE[idx]
                            d.INPUT = $.extend(true, {}, d.INPUT, b.CUSTOM[idx] )

                        }
                        d.TEMPLATE = "ctrl";
                        d.GROUP = "undefined"
                        //else !Object
                    }

                    //if Array
                }else{

                    d[ elm.CTRL ] = elm[ elm.CTRL ] 
                    if( elm.hasOwnProperty("ITEM") ){
                        d[ elm.CTRL ].ITEM = elm.ITEM
                    }
                    if( elm.hasOwnProperty("BOOL") ){
                        d[ elm.CTRL ].BOOL = elm.BOOL
                    }
                    // if( elm.hasOwnProperty("ENUM") ){
                    //     d = eca( d, b, elm.ENUM, "SELECT" )
                    //     d.SELECT.TITLE = b.TITLE[idx]
                    //     d.SELECT = $.extend(true, {}, d.SELECT, b.CUSTOM[idx] )

                    // }else{
                    //     if( elm.TYPE==="bool"){
                    //         d = eca( d, b, elm.ENUM, "CHECK" )
                    //         d.CHECK.TITLE = b.TITLE[idx]
                    //         d.CHECK = $.extend(true, {}, d.CHECK, b.CUSTOM[idx] )

                    //     }else{

                    //         d.INPUT = b.INPUT;
                    //         d.INPUT.TITLE = b.TITLE[idx]
                    //         d.INPUT = $.extend(true, {}, d.INPUT, b.CUSTOM[idx] )
                    //         if( $.isArray( elm.LEN ) ){
                    //             // console.log( idx )
                    //             d.INPUT.COUNTER = "0/" + parseInt(elm.LEN[1] / 3)
                    //         }
                    //     }

                    // }
                    d.TEMPLATE = "ctrl";
                    d.GROUP = "undefined"
                    //else !Array
                }

            }
            console.log( c)

            d = setGroup(d, idx)

            if( d.hasOwnProperty("G") ){
                d.G = setGroup( d.G, idx)
                c.G = $.extend(true, c.G, d.G)
                delete d.G
            }


            if( d.TEMPLATE==="table" || d.TEMPLATE==="table_tag" ){
                c.G = $.extend(true, c.G, {[idx]:d})

            }else{
                c[idx] = d

            }

        } )
        if(lev===0){
            c = $.extend(true, c, c.G)
            delete c.G
        }

        return c
    }


    result = loop(target, defaults, result, result)
    console.log( result )
    return {
        result : result,
        target : target
    }
}
