$(function () {
    var form = layui.form;
    //验证码刷新
    $('#codeimg').click(function () {
        $(this).attr('src', '/coder?' + new Date());
    });
    // 用户登录
    form.on('submit(login)', function(data){
        $.ajax({
            url: '/admin/login',
            type: 'POST',
            dataType: 'JSON',
            data: $('#adminlogin').serialize(),
            // data:data.field,
            success: function (result) {
                console.log(result);
                if(result.r == 'coder_err'){
                    $('input[name="coder"]').parent().next('.layui-form-mid').html('验证码错误');
                    $('#codeimg').attr('src', '/coder?' + new Date());
                    return;
                }
                if(result.r == 'u_not'){
                    $('input[name="username"]').parent().next('.layui-form-mid').html('账号不存在');
                    return ;
                }
                if(result.r == 'p_err'){
                    $('input[name="passwd"]').parent().next('.layui-form-mid').html('密码不正确');
                    return ;
                }
                if(result.r == 'ok'){
                    window.location.href = '/admin';
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
    $('input').focus(function (e) {
        if($('.layui-form-danger').length){
            return ;
        }
        $(e.target).parent().next('.layui-form-mid').html('');
        
    });

});