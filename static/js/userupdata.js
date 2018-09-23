$(function(){
    let form = layui.form
    form.on('submit(updata)', function(data){
        $.ajax({
            url: '/users/updata',
            type: 'POST',
            dataType: 'JSON',
            data: $('#upadata').serialize(),
         
            success: function (result) {
                console.log(result);
            }
        });
});
});