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



    $.fn.extend({ 
        vj_config: function( fields, views, option ){ 

            var $me = this,
                defaults = {
                    charset : "UTF-8"
                },
                model = { 
                    option: $.extend( true, {}, option, defaults ),
                    fields: fields 
                },
                listener = new vj_listener();


            $me.html( Handlebars.compile( "<table><tbody>{{>router this}}</tbody></table>" )( j(fields, views).result ) )
            $me.addClass("vj-form")


            $me.GlobalEvent = {};

            // $me.data( model )

            $me.extend({
                vjUpdate: function( fn ){
                    if( $.isFunction(fn) )
                        $me.on( "vj.update", function(){
                            fn( $me.data() )
                        } )
                },
                vjSubmit: function( fn ){
                    if( $.isFunction(fn) ){
                        $me.on( "vj.submit", function(){
                            fn( $me.data() )
                        } )
                    }
                },
                vjOn: function( e,fn ){
                    if( $.isFunction(fn) )
                        $me.on( "vj."+e.toLowerCase(),  function(){
                            fn( $me.data() )
                        } )
                },
                vjOff: function( e ){
                    $me.off( "vj."+e.toLowerCase() )

                },
                vjInit: function( dom ){
                    //绑定
                    var $target = dom||$me;

                    listener.input( $target, model, $me.GlobalEvent )
                    listener.select( $target, model, $me.GlobalEvent )
                    listener.check( $target, model, $me.GlobalEvent )
                    // listener.file( $target )

                }

            })

            $(document.body).on("click", function(){
                $(document.body).one("click", $me.GlobalEvent.click, function(e){
                    var selector, target, className, g = e.data;

                    selector    = g.selector.join(",")
                    target      = g.target.join(",")
                    className   = g.className.join(" ")
                    $.each( $( selector ), function(aIdx, aElm){
                        if( $( e.target ).closest( target )[0]!==aElm ){
                            $( aElm ).removeClass( className )
                        }
                    })
                })

            })


            return $me
        } 
    }); 
})(jQuery)