const express = require("express");
const router = express.Router();
const async = require('async');
// 登录验证
router.use('/',(req, res, next) => {
    if (!req.session.uid) {

        res.redirect('/users/login');
        return;
    }
    next();
});
router.get('/', (req, res) => {
    let data = {};
    data.username = req.session.username;
    data.uid = req.session.uid; //用户ID
    //查询用户数据，返回数据到用户页面
    let sql = 'SELECT * FROM users WHERE uid=? LIMIT 1'
    conn.query(sql, data.uid, (err, result) => {
        data.users = result;
    
        res.render('users/index', data);
        console.log(data);
    })
});
router.get('/updata', (req, res)=>{
    let data={};
    data.username = req.session.username;
    //分类数据
    let sql = 'SELECT * FROM category WHERE status = 1';
    conn.query(sql, (err, results)=>{
        data.category = results;
        res.render('users/updata', data);
    });
})
router.post('/updata', (req, res) => {

    //当前页数
    let data = {};
    let pagenum = 10;
    data.pagenum = pagenum;
    let page = req.query.page ? req.query.page : 1;
    data.page = page;

    let d = req.body;
    d.uid=req.session.uid;
    d.username=req.session.username;
    console.log(d);
    //标题，分类ID ，照片描述，关键词，添加人ID ，添加人姓名，添加时间，状态0提供审核
    let sql = 'INSERT INTO photos(title, cid, pcontent , keywords ,uid ,username ,  addtimes ,status ) VALUES (?,?,?,?,?,?,?,?)';
    let data1 = [d.title, d.cid, d.pcontent, d.keywords, d.uid, d.username, new Date().toLocaleString(), 0];
    conn.query(sql, data1, (err, result) => {
        if (err) {
            console.log(err);
            res.json({
                r: 'db_err'
            });
            return;
        }
        res.json({
            r: 'success'
        });
    });
})
router.get('/deldata', (req, res)=>{
    let sql = 'UPDATE photos SET status = 2 WHERE pid = ? LIMIT 1';
    conn.query(sql, req.query.pid, (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});



    router.post('/comment', (req, res)=>{
        // // 查询数据
        //  //当前页数
         let data={};
         let pagenum = 10;
         data.pagenum = pagenum;
     
         let page = req.query.page ? req.query.page : 1;
         data.page = page;
         let d = req.body;
         let sql ='INSERT INTO comment(  pid, uid, content ,  addtimes ,status ) VALUES (?,?,?,?,?)'
         let data2 = [d.pid, d.uid, d.content, new Date().toLocaleString(), 1];
         conn
         if (err) {
            console.log(err);
            res.json({
                r: 'db_err'
            });
            return;
        }
        res.json({
            r: 'success'
        });
        
    
    });
    router.get ('/comment', (req, res)=>{

      async.series({
                 //获取分类
                 category:function (callback) {
                    let sql = 'SELECT * FROM category WHERE status = 1';
                    conn.query(sql, (err, results)=>{
                        callback(null, results);
                    });
                },
                 count: function (callback) {
                     let sql = 'SELECT COUNT(*) AS nums FROM photos WHERE status = 1';
                     conn.query(sql, (err, result) => {
                         callback(null, result[0].nums);
                     });
                 },
                 comment:function (callback) {
                     //查询分类信息
                     let sql = 'SELECT q.*, c.* FROM photos AS q  LEFT JOIN comment AS c ON q.qid = c.qid WHERE q.status = 1 AND q.qid=?';
                     conn.query(sql, req.query.qid, (err, result)=>{
                         callback(null, result[0]);
                     });
                 }
             }, (err, result) => {
                 data.count = result.count;
                 data.comment = result.comment;
                 data.category = result.category;
                 res.render('users/comment', data);
             });



    });
module.exports = router;