var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');
var Korisnik = require('../Klase/Korisnik');
var Igrac = require('../Klase/Igrac');

router.use(bodyParser.json());



router.post('/dajPobedeProtivKorisnika', function (req, res, next) 
{

    osnovnaBaza.db.serialize(function () 
    {

        let index = req.body.id_korisnika;
        podaci = [index];

        sql = `Select rm2.id_korisnika as id_korisnika, k.korisnicko_ime as korisnicko_ime, count(*) as broj_pobeda, k.avatar as avatar
        From RezultatMeca rm1 INNER JOIN RezultatMeca rm2 on rm1.id_meca=rm2.id_meca and rm1.id_korisnika<>rm2.id_korisnika INNER JOIN Korisnik k on k.id_korisnika=rm2.id_korisnika
        Where rm1.id_korisnika = ? and rm1.ucinak > rm2.ucinak
        GROUP BY rm2.id_korisnika
        ORDER BY count(*)`;
        //LIMIT 5`;
        

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

router.post('/dajPorazeProtivKorisnika', function (req, res, next) 
{

    osnovnaBaza.db.serialize(function () 
    {

        let index = req.body.id_korisnika;
        podaci = [index];

        sql = `Select rm2.id_korisnika as id_korisnika, k.korisnicko_ime as korisnicko_ime, count(*) as broj_poraza, k.avatar as avatar
        From RezultatMeca rm1 INNER JOIN RezultatMeca rm2 on rm1.id_meca=rm2.id_meca and rm1.id_korisnika<>rm2.id_korisnika INNER JOIN Korisnik k on k.id_korisnika=rm2.id_korisnika
        Where rm1.id_korisnika = ? and rm1.ucinak < rm2.ucinak
        GROUP BY rm2.id_korisnika
        ORDER BY count(*) `;
        //LIMIT 5`;
        

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

router.post('/dajPobedePorazeNeresenoZaKorisnika', function (req, res, next) 
{
    

    osnovnaBaza.db.serialize(function () 
    {
        
        //let indexTurnira = req.body.id_turnira;
        let indexKorisnika = req.body.id_korisnika;
        podaci = [indexKorisnika];

        

        sqlPobeda = ` Select rm1.id_korisnika as id_korisnika, count(case rm1.pobedio when '1' then 1 else null end) as broj_pobeda, count(case rm1.pobedio||rm2.pobedio when '01' then 1 else null end) as broj_poraza, count(case rm1.pobedio||rm2.pobedio when '00' then 1 else null end) as broj_neresenih
        From RezultatMeca rm1 LEFT JOIN RezultatMeca rm2 on rm1.id_meca=rm2.id_meca and rm1.id_korisnika<>rm2.id_korisnika INNER JOIN Mec m on m.id_meca=rm1.id_meca INNER JOIN Korisnik k on k.id_korisnika=rm1.id_korisnika
        Where rm1.id_korisnika = ?
        Group by rm1.id_korisnika`;
        
      

        osnovnaBaza.db.all(sqlPobeda, podaci, function (err, rows) 
        {
            if (err)
            {
                return console.log(err.message);
            }
            
            res.send(rows);

        }); 
    });
});

router.post('/dajRejtingZaMesecDana', function (req, res, next) 
{
    

    osnovnaBaza.db.serialize(function () 
    {
        
        //let indexTurnira = req.body.id_turnira;
        let indexKorisnika = req.body.id_korisnika;
        podaci = [indexKorisnika, indexKorisnika, indexKorisnika, indexKorisnika];

        

        sqlPobeda = ` select t.datum_odigravanja, count(case t.id_prvog when ? then 1 else null end) as prvi, count(case t.id_drugog when ? then 1 else null end) as drugi
        FROM Turnir t
        Where (t.id_prvog = ? or t.id_drugog= ?) and  t.datum_odigravanja BETWEEN DATE('now', '-1 month') and  date('now') 
        Group by t.datum_odigravanja
        ORDER BY t.datum_odigravanja`;
        
      

        osnovnaBaza.db.all(sqlPobeda, podaci, function (err, rows) 
        {
            if (err)
            {
                return console.log(err.message);
            }
            //console.log(rows);
            res.send(rows);

        }); 
    });
});





module.exports = router;