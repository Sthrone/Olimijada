var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyPareser = require('body-parser');


router.use(bodyPareser.json());

router.post('/', function (req, res, next) 
{ 
   
    let sql ="SELECT t.id_igre, i.naziv_igre, i.broj_igraca,i.slika_igre, i.kratak_opis FROM Turnir t JOIN Igra i on t.id_igre = i.id_igre GROUP BY t.id_igre ORDER BY count(*) desc LIMIT 4";

    osnovnaBaza.db.all(sql, function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            igre=JSON.stringify(rows);
            res.send(igre); 
        }
    })
});


module.exports = router;
