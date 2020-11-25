var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');
var Korisnik = require('../Klase/Korisnik');
var Igrac = require('../Klase/Igrac');

router.use(bodyParser.json());



router.post('/dajKorisnikeZaTurnir', function (req, res, next) 
{
    //console.log(req.body);
    //console.log(req.file);

    osnovnaBaza.db.serialize(function () 
    {

        let index = req.body.id_turnira;
        podaci = [index];

        sql = `Select DISTINCT k.*
         From Igrac i INNER JOIN Korisnik k on k.id_korisnika=i.id_korisnika
         Where i.id_turnira=?`;
        

        osnovnaBaza.db.all(sql, podaci, function (err, rows) 
        {
            if (err)
                console.log(err);
            else 
            {
                igraci=JSON.stringify(rows);
                res.send(igraci);
            }

        });
    });
});

router.post('/dajIgraceKorisnikaZaTurnir', function (req, res, next) 
{
    //console.log(req.body);
    //console.log(req.file);

    osnovnaBaza.db.serialize(function () 
    {

        let indexK = req.body.id_korisnika;
        let index = req.body.id_turnira;
        podaci = [index, indexK];

        sql = `Select *
         From Igrac i INNER JOIN Bot b on i.id_bota=b.id_bota INNER JOIN TipBota tb on b.id_tipa_bota=tb.id_tipa_bota
         Where i.id_turnira=? and i.id_korisnika=?`;
        

        osnovnaBaza.db.all(sql, podaci, function (err, rows) 
        {
            if (err)
                console.log(err);
            else 
            {
                
                res.send(rows);
            }

        });
    });
});




router.post('/dajBrojBotovaZaKorisnikaNaTurniru', function (req, res, next) 
{
    //console.log(req.body);
    //console.log(req.file);

    osnovnaBaza.db.serialize(function () 
    {
       
        let index = req.body.id_turnira;
        let id=req.body.id_korisnika;
        podaci = [id,index];

        sql = `Select Count(*) as broj
         From Igrac i INNER JOIN PrijavaZaTurnir p on i.id_igraca=p.id_igraca
         Where i.id_korisnika=? and p.id_turnira=?`;
         

        osnovnaBaza.db.all(sql, podaci, function (err, rows) 
        {
            if (err)
                console.log(err);
            else 
            {
                
                res.send(rows);
            }

        });
    });
});



module.exports = router;