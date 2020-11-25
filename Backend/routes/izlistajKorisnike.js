
var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');


router.use(bodyParser.json());

router.post('/', function(req, res, next) 
{
    let sql ="SELECT * FROM Korisnik";
    osnovnaBaza.db.all(sql, function (err, rows) 
    {
        if (err)
            console.log(err);
        else
        {
            korisnici=JSON.stringify(rows);
            res.send(korisnici);
        }
    });
});

router.post('/Sortirani', function(req, res, next) 
{
    let sql =`SELECT * 
                FROM Korisnik 
                ORDER BY rejting DESC,korisnicko_ime`;
    osnovnaBaza.db.all(sql, function (err, rows) 
    {
        if (err)
            console.log(err);
        else
        {
            korisnici=JSON.stringify(rows);
            res.send(korisnici);
        }
    });
});


module.exports = router;