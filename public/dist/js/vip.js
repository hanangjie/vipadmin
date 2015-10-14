$(function(){
    $(".btn-primary").click(function(){
        $(this).closest("form").submit();
    });
    "use strict";
    $("form[rel=ajax]").submit(function(e){
        e.preventDefault();
        var $this=$(this),
            url=$this.attr("action")
            ,type=$this.attr("method")
            ,call=$this.attr("call");
        $.ajax({
            type:type,
            url:url,
            dataType:"json",
            data:$this.serialize()
        }).done(function(data){
            if(call){
                eval(call+"(data)");
            }else{
                $(".modal").modal("hide");
                $("#alert").find(".modal-body").html(data.msg).end().modal();
                setTimeout(function(){
                    $(".modal").modal("hide");
                },1500);
            }
        });
    });


});
