(function(){
    $.extend({
        vj_comfirm: function(option){
            if(!typeof(option.primary)==="function")
                return false
            
            if(!(typeof(option.default)==="function"))
                return false

            if( $("body").has("[class*=vj-cfm]") )
                return false

            title = option.title || "确认操作";
            desc = option.desc || "该操作可能无法撤销，是否确认？";
            btn1 = option.primaryText || "确认";
            btn2 = option.defaultText || "取消";

            var box = $.parseHTML("<div><h5>"+title+"</h5><p>"+desc+(option.icon? "<i class="+option.icon+"></i>": "")+"</p><button id=vj_btn_primary>"+btn1+"</button><button id=vj_btn_default>"+btn2+"</button></div>")

            $(box).addClass( option.theme? "vj-cfm-"+option.theme: "vj-cfm-box" )
            
            $(box).find("#vj_btn_primary").on("click", option.primary )
            $(box).find("#vj_btn_default").on("click", option.default )
            $(box).find("#vj_btn_primary,#vj_btn_default,#vj_btn_close").on("click", function(){
                $(this).closest("[class*=vj-cfm]").remove()
            } )

            $(document.body).prepend(box)
        }
    })

    var  vj_table_toview_target_onChange = function(){
            var str = $(this).val() || $(this).attr("data-vj-value");
                target = $(this).closest("[data-vj-tab]").attr("data-vj-tab");
            $("[data-vj-tag='"+target+"']").html( str );
        },

        vj_tag_click = function(){
            var tagIdx = $(this).attr("data-vj-tag"),
                currIdx = $(this).siblings(".vj-active").attr("data-vj-tag");

            if( !$(this).hasClass("vj-active") )
                $(this).add( $(this).siblings(".vj-active") ).toggleClass("vj-active")
            $(this).closest(".vj-table")
                .find(".vj-tab-container [data-vj-tab="+ tagIdx +"]")
                    .addClass("vj-active").fadeIn(100)
                    .siblings().removeClass("vj-active").hide()
        },

        createContextMenu = function(e){
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

        update_table_sort = function ( $table ){
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

        tag_menuOption = {
            "删除":{
                fn: function(e){
                    ($target)=>{
                        var idx = $target.attr("data-vj-tag")
                            $context = $target.closest(".vj-table")
                        $.vj_comfirm({
                            primary: function(){
                                if( $target.is(".vj-active") ){
                                    ( $target.siblings(".vj-tag-view") ?  
                                        $target.siblings(".vj-tag-view:eq(0)")
                                      : $target.nextAll("[data-vj-add]") 
                                    ).trigger("click")
                                }

                                $context.find("[data-vj-tag="+idx+"],[data-vj-tab="+idx+"]").remove()
                                update_table_sort( $context )

                            },
                            default: function(){},
                        }
                    )}(e.data.target)
                }
                // fn: function(e){
                //     var idx = e.data.target.attr("data-vj-tag"),
                //         $target = e.data.target,
                //         $context = $target.closest(".vj-table");

                //     if( $target.is(".vj-active") ){
                //         ( $target.siblings(".vj-tag-view") ?  
                //             $target.siblings(".vj-tag-view:eq(0)")
                //           : $target.nextAll("[data-vj-add]") 
                //         ).trigger("click")
                //     }

                //     $context.find("[data-vj-tag="+idx+"],[data-vj-tab="+idx+"]").remove()
                //     update_table_sort( $context )
                // }
            }
             
        },

        addTag = function(){
            var tagCount = $(".vj-tag-view").length,
                tagHTML = $.parseHTML( model.GROUPNAEM.TAG_HTML.replace(/\{\{INDEX\}\}/g, tagCount) ),
                tabHTML = $.parseHTML( model.GROUPNAEM.TAB_HTML.replace(/\{\{INDEX\}\}/g, tagCount) );

            $( tabHTML )
                .find("[data-vj-toview] [data-vj-value],input,textarea")
                .on("change", vj_table_toview_target_onChange );
            $( tagHTML )
                .on("click", vj_tag_click)
                .on("contextmenu", tag_menuOption, createContextMenu );

            $(this)
                .before( tagHTML )
                .closest(".vj-table")
                .find(".vj-tab-container")
                .append( tabHTML )

            $(tagHTML).trigger("click")
        }

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

    $("[data-vj-toview] [data-vj-value],input,textarea")
        .on("change", vj_table_toview_target_onChange )

    $(".vj-tag-view")
        .on("click", vj_tag_click )
        .on("contextmenu", tag_menuOption, createContextMenu )

    $(".vj-tag-container [data-vj-add]")
        .on("click", addTag )


    $(".vj-tag-table")
        .sortable({
            axis: "x",
            items: " .vj-tag-view",
            update: ()=>{update_table_sort($(this))}
        })


})()
