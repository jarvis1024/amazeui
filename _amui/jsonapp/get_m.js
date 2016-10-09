function j(json) {
    var defaults = {
            "INPUT": {
                "CLASS": "vj-input-single",
                "INPUT": "input",
                "TITLE": {
                    "url": "链接地址",
                    "name": "名称",
                    "type": "类型",
                    "sub_button": "子菜单"
                },
                "ERRMSG":{
                    "LEN": "长度超出限制",
                    "TYP": "格式错误",
                    "REQ": "必须填写"
                }
            },
            "SELECT": {
                "CLASS": "vj-select-row",
                "ITEM":{}
            },
            "CHECK": {
                "CLASS": "vj-check-mutiple",
                "ITEM":{}
            },
            "FILE": {

            }
        },
        target = json ;
        result = {};
    function loop( a, b, c ){

        $.each( a, function(idx, elm){
            var d = {};
            if( elm.TYPE===Object ){
                d = loop(elm, b, d )
                d.TEMPLATE = "table";

            }else{
                if( elm.TYPE===Array ){
                    d.TEMPLATE = "tag";
                    elm = elm.ITEM;
                    if( elm.hasOwnProperty("ENUM") ){
                        if( elm.ENUM instanceof Array ){
                            d.CHECK = b.CHECK;
                            for(var ii=0;ii<elm.ENUM.length;ii++){
                                d.CHECK.ITEM[elm.ENUM[ii]] = undefined;
                            }
                        }else{
                            $.getJSON( elm.ENUM.url, "type="+elm.ENUM.type, function(d){ d.CHECK.ITEM = d });
                        }
                    }

                }else{
                    d.TEMPLATE = "ctrl";
                    if( elm.hasOwnProperty("ENUM") ){
                        if( elm.ENUM instanceof Array ){
                            d.SELECT = b.SELECT;
                            for(var ii=0;ii<elm.ENUM.length;ii++){
                                d.SELECT.ITEM[elm.ENUM[ii]] = undefined;
                            }
                        }else{
                            $.getJSON( elm.ENUM.url, "type="+elm.ENUM.type, function(d){ d.SELECT.ITEM = d });
                        }
                    }

                }
            }
            c[idx] = d;

        } )
        return c
    }
    result = ()(target, defaults, result)

}