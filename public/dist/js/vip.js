$(function(){
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
            eval(call+"(data)");
        });
    });
});
