$(function(){
    let form = layui.form
    form.on('submit(updata)', function(data){
        $.ajax({
            url: '/users/updata',
            type: 'POST',
            dataType: 'JSON',
            data: $('#upadata').serialize(),
         
            success: function (result) {
                if (result.r == 'success'){
                    alert("上传成功，等待审核");
                    window.location.href = '/home';
                }
            }
        });
        
});
 //图片删除
 $('.photolist').on('click', '.delcate', function(){
    // console.log($(this).attr('qid'));
    let cid = $(this).attr('qid');
    $.ajax({
      url: '/users/delcate',
      type: 'GET',
      dataType: 'JSON',
      data: {cid:cid},
      success: function (result) {
        //   console.log(result);
          if(result.r =='success'){
              window.location.reload();
          }
      }
  });
});
$('#imgs').change(function () { 

    let fd =new FormData();
    fd.append('images',this.files[0]);
   $.ajax({
        type: "POST",
        url: "/uploads",
        data: fd,
        processData: false,
        contentType: false,
        dataType: "JSON",
        success: function (result) {
            console.log(result.data[0])
            $('#mainpic').val(result.data[0]);
         
        }
    });
 })
});