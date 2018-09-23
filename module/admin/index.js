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

//模板引擎渲染主页
router.get('/', (req, res)=>{
    let data={};
    data.username = req.session.username;//把用户名保存下来传到前台去方便使用
    res.render('admin/index',data);
});

//渲染添加分类界面
router.get('/addcate', (req, res)=>{
    let data={};
    data.username = req.session.username;
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






//发布教程
router.get('/addtech', (req, res)=>{
    let data={};
    data.username = req.session.username;
    //分类教程
    let sql = 'SELECT * FROM category WHERE status = 1';
    conn.query(sql, (err, results)=>{
        data.catelist = results;
        res.render('admin/addtech', data);
    });
});


router.post('/addtech', (req, res)=>{
    let d = req.body;
    let sql = 'INSERT INTO questions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';

    let data= [ null, 
                d.title,
                d.cid,
                d.answer,
                d.anyle,
                d.keywords,
                d.import,
                d.diffict,
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
/*
//管理教程
router.get('/techlist', (req, res)=>{
    let data={};
    data.username = req.session.username;
    //当前页数
    let pagenum = 1;
    data.pagenum = pagenum;

    let page = req.query.page ? req.query.page : 1;
    data.page = page;
    async.series({
        count: function (callback) {
            let sql = 'SELECT COUNT(*) AS nums FROM questions WHERE status = 1';
            conn.query(sql, (err, result) => {
                callback(null, result[0].nums);
            });
        },
        questions:function (callback) {
            //查询分类信息
            let sql = 'SELECT q.*, c.catename FROM questions AS q  LEFT JOIN category AS c ON q.cid = c.cid WHERE q.status = 1 LIMIT ?, ?';
            conn.query(sql, [pagenum*(page-1), pagenum], (err, results)=>{
                callback(null, results);
            });
        }
    }, (err, result) => {
        data.count = result.count;
        data.questions = result.questions;
        res.render('admin/techlist', data);
    });
    
    
});

*/
module.exports = router;