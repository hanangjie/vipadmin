$(function(){
    $(".btn-primary").click(function(){
        $(this).closest("form").submit();
    });
    "use strict";
    $("form[rel=ajax]").submit(function(e){
        $(this).find("button").attr("disabled",true);
        e.preventDefault();
        var $this=$(this),
            url=$this.attr("action")
            ,type=$this.attr("method")
            ,call=$this.attr("call");
        if($("input[required]").val()==""){
            $(this).find("button").attr("disabled",false);
            return;
        }
        $.ajax({
            type:type,
            url:url,
            dataType:"json",
            async:false,
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
        $(this).find("button").attr("disabled",false);
    });

    //新增用户成功
    function intUser(d){
        if(d.code==1){

        }
        $(".modal").modal("hide");
        $("#alert").find(".modal-body").html(d.msg).end().modal();
        setTimeout(function(){
            $(".modal").modal("hide");
        },1500);

    }
});
