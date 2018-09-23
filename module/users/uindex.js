const express = require("express");
const router = express.Router();
const async = require('async');
router.get('/', (req, res)=>{
    let data={};
    data.username = req.session.username;//用户名
    data.uid= req.session.username;//用户ID
    //查询用户数据，返回数据到用户页面
    let sql = 'SELECT * FROM user WHERE uid=? LIMIT 1'
    conn.query(sql, data.username, (err, result)=>{
        data.users=result;
    })
    res.render('users/userindex',data);
});

module.exports = router;