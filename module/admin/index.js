const express = require('express');
const async = require('async');
const router = express.Router();
// 登录验证
router.use((req, res, next)=>{
    if(!req.session.aid){
         res.redirect('/admin/login');
        return ;
    }
    next();
});

// 响应退出请求
router.get('/logoff',(req,res)=>{
    req.session.aid='';
    res.json({r:'success'});
});

//模板引擎渲染主页
router.get('/', (req, res)=>{
    let data={};
    data.username =req.session.username;//把用户名保存下来传到前台去方便使用
    data.headerimg=req.session.headerimg;
    // console.log(data);
    res.render('admin/index',data);
});

//渲染添加分类界面
router.get('/addcate', (req, res)=>{
    let data={};
    data.username = req.session.username;
    data.headerimg=req.session.headerimg;
    res.render('admin/addcate', data);
});

//添加分类请求的处理
router.post('/addcate', (req, res)=>{
    let d = req.body.catename;
    let sql = 'INSERT INTO category(catename, aid, username, addtimes) VALUES (?,?,?,?)';
    let data= [d, req.session.aid, req.session.username, new Date().toLocaleString()];
    conn.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});



//更新分类
router.get('/updatecate', (req, res)=>{
    let data={};
    data.username = req.session.username;
    data.headerimg=req.session.headerimg;
    //获取原始信息
    let cid =  req.query.cid;
    if(!cid){
        res.send('请选择你要修改的分类');
        return ;
    }
    let sql = 'SELECT * FROM category WHERE cid = ? LIMIT 1';
    conn.query(sql, cid, (err, result)=>{
        data.cate = result[0];
        res.render('admin/updatecate', data);
    });
    
});
router.post('/updatecate', (req, res)=>{
    let data = req.body;
    // console.log(req.body);
    let sql = 'UPDATE category SET catename = ? WHERE cid = ?';
    conn.query(sql, [data.d[0],data.d[1]], (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});

//在表格中显示所有分类
router.get('/catelist', (req, res)=>{
    let data={};
    data.username = req.session.username;
    data.headerimg=req.session.headerimg;
    //查询分类信息
    let sql = 'SELECT * FROM category WHERE status = 1';
    conn.query(sql, (err, results)=>{
        data.catelist = results;
        res.render('admin/catelist', data);
    });
});

//删除操作
router.get('/delcate', (req, res)=>{
    let sql = 'UPDATE category SET status = 0 WHERE cid = ? LIMIT 1';
    conn.query(sql, req.query.cid, (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});

//批量删除
router.get('/delcates', (req, res)=>{ 
    // if(Object.keys(req.query).length==0){//判断传过来的是否为空值,前台进行判断x
    //     res.json({r:'none'});
    //     return;
    // }
    console.log(req.query.cid.join(','));//将传过来的数组转换成字符串，方便sql语句使用
    let sql = `UPDATE category SET status = 0 WHERE cid IN (${req.query.cid.join(',')})`;
    conn.query(sql,(err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});






//渲染发布教程页面
router.get('/addtech', (req, res)=>{
    let data={};
    data.username = req.session.username;
    data.headerimg=req.session.headerimg;
    //分类教程
    let sql = 'SELECT * FROM category WHERE status = 1';
    conn.query(sql, (err, results)=>{
        data.catelist = results;
        res.render('admin/addtech', data);
    });
});

//响应添加教程请求
router.post('/addtech', (req, res)=>{
    let d = req.body;
    let sql = 'INSERT INTO technology VALUES (?,?,?,?,?,?,?,?,?,?)';
    let data= [ null, 
                d.title,
                d.cid,
                d.techcon,
                d.keywords,
                d.comefrom,
                req.session.aid, 
                req.session.username, 
                new Date().toLocaleString(),
                1];
    conn.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});

//在表格中显示所有分类
router.get('/techlist', (req, res)=>{
    let data={};
    data.username = req.session.username;
    data.headerimg=req.session.headerimg;
    //查询分类信息
    let sql = 'SELECT t.*, c.catename FROM technology AS t  LEFT JOIN category AS c ON t.cid = c.cid WHERE t.status = 1';
    conn.query(sql, (err, results)=>{
        data.techlist = results;
        res.render('admin/techlist', data);
    });
});

// 单项删除教程
router.get('/deltech', (req, res)=>{
    let sql = 'UPDATE technology SET status = 0 WHERE tid = ? LIMIT 1';
    conn.query(sql, req.query.tid, (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});

//批量删除教程
router.get('/deltechs', (req, res)=>{ 
    console.log(req.query.tid.join(','));//将传过来的数组转换成字符串，方便sql语句使用
    let sql = `UPDATE technology SET status = 0 WHERE tid IN (${req.query.tid.join(',')})`;
    conn.query(sql,(err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});

//按钮修改教程名
router.post('/updatetech', (req, res)=>{
    let data = req.body;
    // console.log(req.body);
    let sql = 'UPDATE technology SET title = ? WHERE tid = ?';
    conn.query(sql, [data.d[0],data.d[1]], (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});

//渲染修改教程页面
router.get('/updatetech', (req, res)=>{
    let data={};
    data.username = req.session.username;
    data.headerimg=req.session.headerimg;
    data.tid=req.query.tid;
    async.series({
        findtech:function(callback){
            let sql = 'SELECT * FROM technology WHERE tid = ? ';
            conn.query(sql,data.tid, (err,result)=>{
                callback(null, result);
            // res.render('admin/updatetech', data);
            });
        },
        findcates:function(callback){
            let sql ='SELECT * FROM category WHERE status = 1';
            conn.query(sql,(err,result)=>{
                callback(null,result);//将查询结果(数组)传进回调函数
            });
        }
    },(err,result)=>{
        //上面的回调函数就是将上面的各个操作步骤中查询出的数据以属性的形式存放到最终的这个result对象中
        data.techlist=result.findtech;
        data.catelist=result.findcates;
        res.render('admin/updatetech',data);
    });
    
});

//修改教程细节
router.post('/updatetechs', (req, res)=>{
    let d = req.body;    
    let sql = 'UPDATE technology SET title=?,cid=?,tcontent=?,keywords=?,comefrom=?,aid=?,username=? WHERE tid=?';
    let data= [ d.title,
                d.cid,
                d.techcon,
                d.keywords,
                d.comefrom,
                req.session.aid, 
                req.session.username,
                req.body.tid
                ];
    conn.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});


//渲染管理员个人信息页面
router.get('/admininfo', (req, res)=>{
    let data={};  
    data.username = req.session.username;//把用户名保存下来传到前台去方便使用
    data.headerimg=req.session.headerimg;
    data.tel=req.session.tel;
    data.email=req.session.email;
    res.render('admin/admininfo',data);
});
//响应修改管理员信息修改请求
router.post('/admininfo', (req, res)=>{
    //console.log(req.body);
    let sql='UPDATE admin SET username=?,headerimg=?,tel=?,email=?WHERE aid=?';
    let data=[req.body.username,req.body.headerimg,req.body.tel,req.body.email,req.session.aid];
    conn.query(sql,data,function (err,result) {
        if(err){
            res.json({r:'db_err'});
            return;
        }
        //成功，更新session信息
        req.session.username=req.body.username;
        req.session.headerimg=req.body.headerimg;
        req.session.tel=req.body.tel;
        req.session.email=req.body.email;
        res.json({r:'success'});
    })
});



module.exports = router;