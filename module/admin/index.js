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

router.get('/', (req, res)=>{
    let data={};
    data.username = req.session.username;
    res.render('admin/index',data);
});

//添加栏目
router.get('/addcategory', (req, res)=>{
    let data={};
    data.username = req.session.username;
    res.render('admin/addcategory', data);
});
router.post('/addcategory', (req, res)=>{
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


//添加栏目
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
    let d = req.body;
    let sql = 'UPDATE category SET catename = ? WHERE cid = ?';
    let data= [d.catename, d.cid];
    conn.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            res.json({r:'db_err'});
            return ;
        }
        res.json({r:'success'});
    });
});

//管理栏目
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



//添加试题
router.get('/addquestion', (req, res)=>{
    let data={};
    data.username = req.session.username;
    //分类数据
    let sql = 'SELECT * FROM category WHERE status = 1';
    conn.query(sql, (err, results)=>{
        data.catelist = results;
        res.render('admin/addquestion', data);
    });
    
});


router.post('/addquestion', (req, res)=>{
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

//管理试题
router.get('/questions', (req, res)=>{
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
        res.render('admin/questions', data);
    });
    
    
});


module.exports = router;