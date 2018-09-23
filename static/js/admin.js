$(function () {
    $('.open').click(function () {
        for (const item of $('.list')) {
            if ($(item).attr('data') == $(this).attr('data')) {
                $(item).addClass('layui-nav-itemed');
            }
        }
    });

    let form = layui.form;
    // 添加分类
    form.on('submit(addcate)', function (data) {
        $.ajax({
            url: '/admin/addcate',
            type: 'POST',
            dataType: 'JSON',
            data: $('#addcate').serialize(),
            // data:data.field,
            success: function (result) {
                //console.log(result);
                if (result.r == 'success') {
                    layer.open({
                        title: '消息',
                        content: '分类添加成功'
                    });
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });


    //显示分类表格
    layui.use('table', function () {
        var table = layui.table;
    //转换静态表格
        table.init('catelist', {
            height: 'full-112' //设置高度
            ,width:727
            ,limit: 10 //注意：请务必确保 limit 参数（默认：10）是与你服务端限定的数据条数一致
            ,page: true //开启分页
            ,toolbar: '#toolbarDemo'
            ,loading: true
        });
    //监听复选框选择事件
        let selected1=[];
        table.on('checkbox(catelist)', function(obj){
            //console.log(obj.checked); //当前是否选中状态
            //console.log(obj.data); //选中行的相关数据
            //console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
            if(obj.type=='one'){//单选
                if(obj.checked==true&&selected1.indexOf(obj.data.id-0)==-1){//选中目标行，如果没有，就选中
                    selected1.push(obj.data.id-0);
                    //console.log(selected1);
                }else{
                    selected1.splice(selected1.indexOf(obj.data.id-0),1);//取消选中目标行
                    //console.log(selected1);
                }
            }else{//全选
                selected1=[];
                if(obj.checked){
                    // console.log($('.laytable-cell-1-0-1'));
                       let ids = $('.laytable-cell-1-0-1');
                    for(let i=1;i<ids.length;i++){
                        selected1.push(ids[i].innerText-0);
                    }
                }
                //console.log(selected1);
            }
            });

    //监听分类表表头按钮点击事件
        table.on('toolbar(catelist)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'add':
                    // layer.msg('添加成功',{time: 1000,icon: 1});
                    window.location.href='/admin/addcate'
                    break;
                case 'delete':
                    if(!selected1.length){//如果未选中
                        layer.msg('请选择你要删除的分类',{time: 1000,icon: 2});
                        return;
                    }
                    layer.confirm('删除选中?', {icon: 3, title:'提示'}, function(index){//批量分类删除
                        let cids=selected1;
                        $.ajax({
                            url: '/admin/delcates',
                            type: 'GET',
                            dataType: 'JSON',
                            data: {cid:cids},
                            success: function (result) {
                                          //console.log(result);
                                          if(result.r =='success'){
                                              layer.msg('删除成功',{time: 1000,icon: 1});
                                              layer.close(index);
                                              setTimeout(() => {
                                                  window.location.reload();
                                              }, 1500);
                                          }
                                      }
                               });
                      });
                        break;
                case 'update':
                    if(!selected1.length){//如果未选中
                            layer.msg('请选择你要修改的分类',{time: 1000,icon: 2});
                            return;
                    }
                    if(selected1.length>1){//选中了多条
                        layer.msg('只能选中一条修改',{time: 1000,icon: 2});
                        return;
                    }
                    layer.prompt({
                        formType: 2,
                        value: '请输入修改内容',
                        title: '修改分类名',
                        area: ['300px', '50px'] //自定义文本域宽高
                      }, function(value, index, elem){
                        let datas={d:[value,selected1[0]]}//将分类id和修改内容保存下来
                        $.ajax({
                            url: '/admin/updatecate',
                            type: 'POST',
                            dataType: 'JSON',
                            data: datas,
                            // data:data.field,
                            success: function (result) {
                                if(result.r=='success'){
                                    layer.msg('修改成功',{time: 1000,icon: 1});
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1500);
                                }
                            }
                        });
                        layer.close(index);
                      });
                    break;
            };
        });
    });

      //单项分类删除
    $('.layui-table-view').on('click','.delcate', function(){
        //这里应该有删除确定提示--TODO
        let _This=this;
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //console.log($(_This).attr('cid'));
            let cid = $(_This).attr('cid');
            $.ajax({
          url: '/admin/delcate',
          type: 'GET',
          dataType: 'JSON',
          data: {cid:cid},
          success: function (result) {
                        //console.log(result);
                        if(result.r =='success'){
                            layer.msg('删除成功',{time: 1000,icon: 1});
                            layer.close(index);
                            setTimeout(() => {
                                window.location.reload();//重新加载页面
                            }, 1500);
                        }
                    }
             });
          });  
    });

});