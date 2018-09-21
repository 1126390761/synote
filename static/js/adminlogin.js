$(function () {
    var form = layui.form;
    //��֤��ˢ��
    $('#codeimg').click(function () {
        $(this).attr('src', '/coder?' + new Date());
    });
    // �û���¼
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
                    $('input[name="coder"]').parent().next('.layui-form-mid').html('��֤�����');
                    $('#codeimg').attr('src', '/coder?' + new Date());
                    return;
                }
                if(result.r == 'u_not'){
                    $('input[name="username"]').parent().next('.layui-form-mid').html('�˺Ų�����');
                    return ;
                }
                if(result.r == 'p_err'){
                    $('input[name="passwd"]').parent().next('.layui-form-mid').html('���벻��ȷ');
                    return ;
                }
                if(result.r == 'ok'){
                    window.location.href = '/admin';
                }
            }
        });
        return false; //��ֹ����ת�������Ҫ����ת��ȥ����μ��ɡ�
      });
    $('input').focus(function (e) {
        if($('.layui-form-danger').length){
            return ;
        }
        $(e.target).parent().next('.layui-form-mid').html('');
        
    });

});