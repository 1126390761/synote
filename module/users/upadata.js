const express = require("express");
const router = express.Router();
const async = require('async');

  //用户发布数据到后台管理
router.get('/', (req, res)=>{
  
    let data={};
    data.username = req.session.username;
    //获取用户
    let sql = 'SELECT * FROM user WHERE uid=? LIMIT 1'
    conn.query(sql, data.username, (err, result)=>{
        data.users=result;
    })
    //获取分类
    let sql = 'SELECT * FROM crategory WHERE status = 1';
    conn.query(sql, (err, results)=>{
        data.catelist = results;
        res.render('users/upadata', data);
    });

    //添加照片和详情到数据库，后台审核
    router.post('/', (req, res)=>{
        let d = req.body;
        //标题，分类ID ，照片描述，关键词，添加人ID ，添加人姓名，添加时间，状态0提供审核
        let sql = 'INSERT INTO photos(  tittle, cid, pcontent , keywords ,uid ,username ,  addtimes ,status ) VALUES (?,?,?,?,?,?,?,?,?)';
    
        let data= [ d.title,d.cid,d.pcontent,d.keywords,d.uid,d.username,d.addtimes, new Date().toLocaleString(),0];
        conn.query(sql, data, (err, result)=>{
            if(err){
                console.log(err);
                res.json({r:'db_err'});
                return ;
            }
            res.json({r:'success'});
        });
    });
});