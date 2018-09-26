const express = require("express");
const router = express.Router();
const async = require('async');
//渲染主页面
router.get('/',(req, res)=>{
    let data = {};
    data.username = req.session.username;
    data.uid = req.session.uid; 
    let sql = 'SELECT * FROM photos where status =1'
    conn.query(sql, (err, result) => {
        data.photos = result;
        res.render('home/index', data);
        console.log(data);
    })
})

//渲染用户作品详情页
router.get('/details',(req,res)=>{
    let data = {};
    data.username = req.session.username;
    data.uid = req.session.uid; 
    let sql = 'SELECT * FROM photos where pid=? AND status =1'
    conn.query(sql,req.query.pid, (err, result) => {
        data.photos = result;
        res.render('home/details', data);
        console.log(data);
    })
});

//渲染主页中教程模块
router.get('/tech',(req, res)=>{
    let data={};
    let sql = 'SELECT t.*, c.catename FROM technology AS t  LEFT JOIN category AS c ON t.cid = c.cid WHERE t.status = 1';
    conn.query(sql, (err, results)=>{
        data.techlist = results;
        res.render('home/tech', data);
    });
});


// 渲染主页中教程详情模块
router.get('/techdetails',(req, res)=>{
    let data={};
    let cid='';
    async.series({
        findtech:function(callback){
            let sql = 'SELECT * FROM technology WHERE tid = ? ';
            conn.query(sql,req.query.tid, (err,result)=>{
                cid=result[0].cid;
                callback(null, result);
            });
        },
        findcates:function(callback){
            let sql ='SELECT * FROM category WHERE cid = ?';
            conn.query(sql,cid,(err,result)=>{
                callback(null,result);//将查询结果(数组)传进回调函数
            });
        }
    },(err,result)=>{
        //上面的回调函数就是将上面的各个操作步骤中查询出的数据以属性的形式存放到最终的这个result对象中
        data.techlist=result.findtech;
        data.catelist=result.findcates;
        // console.log(data);//打印出来能看到是 这个data属性有两个属性，每个属性的值都是一个数组(查询结果)，因为是只查询一条，可以直接取下标0，从而取数据
        res.render('home/techdetails',data);
    });
});

module.exports = router 