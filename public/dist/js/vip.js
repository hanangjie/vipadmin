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

    //输入钱
    $(".moneySign").change(function(){
        if(!($(this).val().indexOf("￥")!=-1)){
            $(this).val("￥"+$(this).val());
        }
    });

    $(document).on("click",".deleteModal",function(){
        var $this=$(this);
        var deleteModal = $('#delete');
        var deleteConfirmBtn = deleteModal.find('.modal-confirm');
        deleteModal.find(".modal-body").html($this.attr("msg")||"确定删除吗？");
        deleteModal.modal();
        deleteConfirmBtn.unbind('click');
        deleteConfirmBtn.on('click', function (e) {
            $.ajax({
                type:$this.attr("method")||"get",
                url:$this.attr("action")
            }).done(function(data){
                if(data.code==0){
                    if($this.attr("call")){
                        eval($this.attr("call")+"(data)");
                        return;
                    }
                    $this.closest("tr").remove();
                    showSuccessMsg(data.msg);
                }else{
                    showErrorMsg(data.msg);
                }
            });
        })
    });

    //充值
    $(".listRecharge").click(function(){
        $("#rechargeMoney").attr("data-id",$(this).attr("relid"));
    });
    $("#rechargeMoney").click(function(){
        var id=$(this).attr("data-id");
        $.ajax({
            type:"get",
            url:"/recharge/"+id,
            data:{
                money:$("#rechargeCount").val()
            }
        }).done(function(data){
            showSuccessMsg(data.msg);
        });
    });
    //消费
    $(".listConsume").click(function(){
        $("#consumeMoney").attr("data-id",$(this).attr("relid"));
    });
     $("#consumeMoney").click(function(){
        var id=$(this).attr("data-id");
        $.ajax({
            type:"get",
            url:"/consume/"+id, 
            data:{
                money:$("#consumeCount").val().replace("￥","")
            }
        }).done(function(data){
            showSuccessMsg(data.msg);
        });
    });
});



function showErrorMsg(message, time) {

    closeMsg();
    $('body').append('<div class="alert alert-danger alert-dismissable">'+
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
    ' <h4><i class="icon fa fa-ban"></i>警告!</h4>'+message+
    '</div>');
    setTimeout(closeMsg, time || 8000);
}

function showSuccessMsg(message) {
    closeMsg();

    $('body').append('<div class="alert alert-danger alert-dismissable">'+
        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
        ' <h4><i class="icon fa fa-ban"></i>成功!</h4>'+message+
        '</div>');

    setTimeout(closeMsg, 3000);
}


function closeMsg() {
    var errorMsg = $('.alert-dismissable');
    if (errorMsg.length) {
        errorMsg.alert('close');
    }
}

