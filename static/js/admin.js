$(function(){
    $('.open').click(function(){
        for (const item of $('.list')) {
            if($(item).attr('data')==$(this).attr('data')){
                $(item).addClass('layui-nav-itemed');
            }
        }  
    });

    let form = layui.form;
    // 添加分类
    form.on('submit(addcate)', function(data){
        $.ajax({
            url: '/admin/addcate',
            type: 'POST',
            dataType: 'JSON',
            data: $('#addcate').serialize(),
            // data:data.field,
            success: function (result) {
                console.log(result);
                if(result.r=='success'){
                    layer.open({
                        title: '消息'
                        ,content: '分类添加成功'
                      });  
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });

});