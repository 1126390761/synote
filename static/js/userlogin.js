$(function(){
    $('#codeimg').click(function(){
      $(this).attr('src', '/coder?'+ new Date());
    });

    //登陆
    $('#login').click(function () { 
        $.ajax({
            type: "POST",
            url: "/login",
            data: $("#userlogin").serialize(),
            dataType: "JSON",
            success: function (result) {
                console.log(result);
               
                if(result.r == 'user_not'){
                    $('input[name="username"]').addclass(has-error);
                    return ;
                }
            }
        }); return false;
     });










    
})