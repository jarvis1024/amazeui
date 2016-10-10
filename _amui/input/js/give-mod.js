var m_0test = {
    "root":{
        "name": "inroot NAME",
        "type": "inroot TYPE"
    },
    "body": {
        "tar":{
            "name": "in body.tar NAME",
            "type": "in body.tar TYPE"
        }
    }
};
(function($target, mod){
    $.each( $target.find(".ctrl"), function(idx,elm){
        var $elm = $(elm),
            group = $elm.data("group"),
            name = $elm.data("name"),
            data = mod;
            console.log(group)
            console.log(name)
            console.log(elm)
            console.log(data)
            for( var ii=0,gp=group.split("."); ii<gp.length; ii++ ){
                data = data[gp[ii]]
            }
            data = data[name]
            console.log( data )
    } )

})($("#target"), m_0test )