const express = require("express");
const router = express.Router();
const async = require('async');
//用户留言板
router.get('/', (req, res)=>{
    let data={};
    data.username = req.session.username;//用户名
    data.uid= req.session.username;//用户ID
    //查询留言数据
  //没有建表，搁置
    res.render('users/usermessage',data);
});