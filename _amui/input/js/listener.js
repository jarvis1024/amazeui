var vj_listener = function( ){

    this.chrReg = {
        dubUtf8_REG : /[\u0080-\u07ff]/g ,
        trbUtf8_REG : /[\u0800-\uffff]/g ,
        dubByte_REG : /[^\x00-\xff]/g
    }

    return this
}

vj_listener.prototype.input = function( $target, mod, GlobalEvent ){
    if( !$target instanceof $ )
        $target = $($target);
    var chrReg = this.chrReg;

    var onInput = function(e){
            var $this = $(this),
                $item = $this.closest(".vj-item"),
                model = $this.closest(".vj-ctrl").data();

            if( $this.val() ){
                $this.siblings(".vj-placeholder").hide()

                if( $.isArray(model.LEN) ){
                    var limitLen = model.LEN[1],
                        chekLen = false;

                    switch( mod.option.charset.toUpperCase() ){
                        case "UTF-8": 
                            var elmVal = $this.val() , 
                                dubChr = elmVal.match( chrReg.dubUtf8_REG ) || [],
                                trbChr = elmVal.match( chrReg.trbUtf8_REG ) || [],
                                chrLen = trbChr.length*2 + dubChr.length + elmVal.length;

                            $this.siblings(".vj-counter")
                                .html( ""
                                  + parseInt(chrLen/3)
                                  + "/" 
                                  + parseInt(limitLen/3) );

                            chekLen = chrLen<=limitLen
                            break;

                        default: 
                            break;
                    }
                    
                    chekLen?
                        $item.removeClass("vj-err vj-err-len")
                      : $item.addClass("vj-err vj-err-len")

                    if( model.NUMERIC ){
                        if( !$.isNumeric( $this.val() ) ){
                            $this.val( $this.val().substr(0,$this.val().length-1))
                            $this.trigger("input")
                            return 0
                        }
                    }
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
                model = $this.closest(".vj-ctrl").data(),
                tempVal;

            thisVal = thisVal.trim()
            if( thisVal ){
                if( model.MAX )
                    thisVal = Math.min( thisVal, model.MAX )

                if( model.MIN )
                    thisVal = Math.max( thisVal, model.MIN )

                switch( model.FORMAT||"" ){
                    case "price":
                        thisVal = parseInt(thisVal*100)/100; 
                        tempVal = parseInt(thisVal*100)
                        break;
                    case "percent": 
                        thisVal = parseInt(thisVal*10)/10; 
                        tempVal = parseInt(thisVal*10)/1000
                        break;
                    default: 
                        tempVal = thisVal
                        break;
                }

                if( model.EXPRESS )
                    model.value = eval( model.EXPRESS.replace(/\{\{\}\}/g , model.value ) )
            }else{
                thisVal = ""
                tempVal = thisVal

            }

            if( $this.closest(".vj-ctrl").hasClass("vj-mutiple") ||  $item.siblings(".vj-item").length>0){
                if( model.value===undefined ){
                    model.value = $item.data("name")===$item.siblings(".vj-item").data("name")? []: {}
                }
                model.value[ $item.data("name")|| $item.data("index") ] = tempVal
            }else{
                model.value = tempVal
            }


            
            $this.val(thisVal)
            $this.siblings(".vj-placeholder")[ $this.val()? "hide":"show"]()
            $this.closest(".vj-ctrl").trigger("change")
        };

    $.each( $target.find(".vj-ctrl.vj-ctrl-input"), function(idx, elm){
        var $elm = $(elm),
            group = $elm.data("group"),
            name = $elm.data("name"),
            data = mod.fields;

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
    } )

    $target.find(".vj-ctrl.vj-ctrl-input .vj-input").on("input", onInput).on("change", onChange)

};

vj_listener.prototype.select = function( $target, mod, GlobalEvent ){
    if( !$target instanceof $ )
        $target = $($target);

    if( !GlobalEvent.hasOwnProperty("click") ){
        GlobalEvent.click = {
                selector: [],
                target: [],
                className: []
            }
    }

    if( $.inArray(".vj-ctrl-select>.vj-item.vj-active",  GlobalEvent.click.selector)<0 ){
        GlobalEvent.click.selector.push( ".vj-ctrl-select .vj-select.vj-active" )
        GlobalEvent.click.target.push( ".vj-select.vj-active" )
        GlobalEvent.click.className.push( "vj-active" )
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
            data = mod.fields;

        for( var ii=0,gp=group.split("."); ii<gp.length; ii++ ){
            data = data[gp[ii]]
            if( data.TYPE===Array ) // if Group is a Array Object
                data = data.ITEM
        }

        //CSS
        if ($elm.is(".vj-select-matrix")){
            $.each( $elm.find(".vj-select-list>[data-bgcolor] "), function( sIdx, sElm ){
                $(sElm)
                    .attr( "data-bgcolor", $(sElm).css("background-color") )
                    .css("font-size",0)
            } )
        }

        $elm.data( data[name] )
    } )

    $target.find(".vj-ctrl.vj-ctrl-select .vj-select").on("click", onClick)

};

vj_listener.prototype.check = function( $target, mod, GlobalEvent ){
    if( !$target instanceof $ )
        $target = $($target);

    var onClick = function(e){
        var $this = $(this),
            $ctrl = $this.closest(".vj-ctrl"),
            model = $ctrl.data()

        $ctrl.hasClass("vj-check-radio") ?
            $this.addClass("vj-checked").siblings().removeClass("vj-checked")
          : $this.toggleClass("vj-checked");

        if( $ctrl.hasClass("vj-boolean") ){
            $this.data( "value", $this.hasClass("vj-checked") )
            model.value = {}
        }else{
            model.value = []
        }

        if( $this.siblings().length>0 ){
            $.each( $ctrl.find(".vj-checked"), function( idx,elm ){
                model.value[ $(elm).data("name") || model.value.length ] = $this.data("value")
            })
        }else{
            model.value = $this.data("value")
        }

        $ctrl.trigger("change")

    };

    $.each( $target.find(".vj-ctrl.vj-ctrl-check"), function(idx, elm){
        var $elm = $(elm),
            group = $elm.data("group"),
            name = $elm.data("name"),
            data = mod.fields;

        for( var ii=0,gp=group.split("."); ii<gp.length; ii++ ){
            data = data[gp[ii]]
            if( data.TYPE===Array ) // if Group is a Array Object
                data = data.ITEM
        }

        $elm.data( data[name] )
    } )

    $target.find(".vj-ctrl.vj-ctrl-check .vj-check").on( "click", onClick )

};
