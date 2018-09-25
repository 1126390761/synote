const express = require('express');
const router = express.Router();
//管理员登录  各种路由处理
router.get('/', (req, res)=>{
    res.render('admin/login');
});

//登录验证
router.post('/', (req, res)=>{
    let d = req.body;
    // console.log(req.session.coder);
    //首先验证验证码
    if(!req.session.coder  || d.coder.toLowerCase() != req.session.coder.toLowerCase()){
        res.json({r:'coder_err'});
        return ;
    }

    //进行数据验证
    let sql = 'SELECT * FROM admin WHERE status = 1 AND username = ?';
    conn.query(sql, d.username, (err, result)=>{
        //账号是不是存在
        if(!result.length){
            res.json({r:'u_not'});
            return ;
        }
        //判断密码是否正确
        if(md5(d.passwd) != result[0].passwd){
            res.json({r:'p_err'});
            return ;
        }
        //登录成功
        //保存session信息
        req.session.aid = result[0].aid;
        req.session.username = result[0].username;
        req.session.headerimg = result[0].headerimg;
        req.session.tel=result[0].tel;
        req.session.email=result[0].email;
        //更新状态
        let sql = 'UPDATE admin SET loginnum = loginnum + 1, lasttimes = ? WHERE aid = ?';
        conn.query(sql, [new Date().toLocaleString(), result[0].aid], (err, result)=>{
            res.json({r:'ok'});
        });
    });
});

module.exports = router;