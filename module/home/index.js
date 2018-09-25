const express = require("express");
const router = express.Router();
const async = require('async');
router.use('/', (req, res) => {
    res.render('home/index')


});
router.get('/',(req, res)=>
{
    let data = {};
    data.username = req.session.username;
    data.uid = req.session.uid; 
    conn.query(sql, data.uid, (err, result) => {
        data.users = result;
    
        res.render('home/index', data);
        console.log(data);
    })
})

module.exports = router 