var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyPareser = require('body-parser');


router.use(bodyPareser.json());

router.post('/', function (req, res, next) 
{ 
    let id=req.body.id_korisnika;
    let podaci=[id];
    let sql =   `select t.id_igre, i.naziv_igre, i.broj_igraca,i.slika_igre, i.kratak_opis
                from Mec m
                join RezultatMeca rm on m.id_meca = rm.id_meca
                join Korisnik k on rm.id_korisnika = k.id_korisnika
                join Turnir t on t.id_turnira = m.id_turnira
                join Igra i on i.id_igre = t.id_igre
                where k.id_korisnika = ?
                group by t.id_igre
                order by count(*) desc
                limit 3`;

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
