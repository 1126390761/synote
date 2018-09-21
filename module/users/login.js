const express = require("express");
const md5 = require("md5");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('users/login')


});

router.post('/', (req, res) => {
    let d= req.body;
    //验证验证码

    if(d.coder.toLowerCase() != req.session.coder.toLowerCase()){
        res.json({r:'coder_err'});
        return ;
    }
    //查询字段
    let sql = 'SELECT * FROM users WHERE status = 1 AND username = ? ';
    //验证账户
    conn.query(sql, d.username, (err, result) => {
        if (!result.length) {
            res.json({ r: 'user_not' });
            return;
        };
        if (md5(d.password) != result[0].passwd) {
            res.json({ r: 'passwd_err' });
            return;
        };
        req.session.uid = result[0].uid;
        console.log( req.session.uid);
        req.session.username = result[0].username;
        console.log( req.session.username);
        let sql = 'UPDATE  users SET loginnum = loginnum + 1, lasttimes = ? WHERE uid = ?';
        conn.query(sql, [new Date().toLocaleString(), result[0].uid], (err, result) => {
            if(err){
                res.json({r:"db_err"})
                console.log(err);
    
            }
            //返回结果
            res.json({ r: 'ok' });
            
        });

    });

});
module.exports = router 