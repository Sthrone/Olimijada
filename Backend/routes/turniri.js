var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');
var Igra = require('../Klase/Igra');
var Bot = require('../Klase/Bot');
var multer = require('multer');
var fs = require('fs');
var mkdirp = require('mkdirp');

router.use(bodyParser.json());


router.post('/dajTurnire', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.

    let index;
    index=req.body.id_igre;

    let sql = `Select *
              FROM TipTurnira tp INNER JOIN Turnir t on tp.id_tipa_turnira=t.id_tipa_turnira INNER JOIN StanjeTurnira st on st.id_stanja=t.id_stanja
              Where t.id_igre=? 
              ORDER BY datum_odigravanja, naziv_turnira`;

   
    podaci=[index];
    osnovnaBaza.db.all(sql,podaci, function (err, row) 
    {
      
        if (err)
            console.log(err);
        else
        {   
            
            turniri=JSON.stringify(row);
            res.send(turniri);
        }
    });
  });
});



router.post('/dajBrojTurniraZaKorisnika', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.
    let index;
    index = req.body.id_korisnika;
    
    let sql = `Select count(*) as broj
              FROM Turnir t INNER JOIN Igrac i on t.id_turnira=i.id_turnira
              WHERE i.id_korisnika = ?`;

    let podaci = [index];
   
    
    osnovnaBaza.db.all(sql,podaci, function (err, row) 
    {
      
        if (err)
            console.log(err);
        else
        {   
            res.send(row);
        }
    });
  });
});

router.post('/dajBotoveZaKorisnika', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.
    let index;
    let indexIgre;
    index = req.body.id_korisnika;
    indexIgre=req.body.id_igre;

    let sql = `SELECT *
               FROM Bot b JOIN TipBota tb ON b.id_tipa_bota = tb.id_tipa_bota 
               WHERE b.id_korisnika = ? AND tb.id_igre = ?`;

   
    podaci=[index,indexIgre];

    osnovnaBaza.db.all(sql,podaci, function (err, row) 
    {
      
        if (err)
            console.log(err);
        else
        {   
            
            res.send(row);
        }
    });
  });
});




router.post('/obrisiKorisnikaSaTurnira', function (req, res, next) 
{
    //console.log(req.body);
    //console.log(req.file);

    osnovnaBaza.db.serialize(function () 
    {
        //console.log(req.body);
        let index = req.body.id_korisnika;
        let indexTurnira = req.body.id_turnira;

        podaci = [index, indexTurnira];


        sql = `Delete From Igrac
               Where id_korisnika=? and id_turnira = ?`;
        
        osnovnaBaza.db.all(sql, podaci, function (err, rows) 
        {
            if (err)
            {
                return console.log(err.message);
            }
            res.status(200).send({success: true});
                        
        }); 
                    
    });
});



router.post('/dajNoveTurnire', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.
    //let index;
   // index = req.body.id_korisnika;
    
    let sql = `Select t.id_turnira as id_turnira,tt.naziv_tipa_turnira as naziv_tipa_turnira, t.datum_pocetka_prijave as datum_pocetka_prijave,t.datum_kraja_prijave as datum_kraja_prijave,t.datum_odigravanja as datum_odigravanja, t.naziv_turnira as naziv_turnira,t.broj_ucesnika as broj_ucesnika ,i.naziv_igre as naziv_igre, i.broj_igraca as broj_igraca, i.slika_igre as slika_igre  
                FROM Turnir t INNER JOIN StanjeTurnira st on t.id_stanja=st.id_stanja INNER JOIN Igra i on t.id_igre=i.id_igre INNER JOIN TipTurnira tt on tt.id_tipa_turnira=t.id_tipa_turnira
                WHere st.id_stanja=1
                ORDER BY t.datum_odigravanja`;

    //let podaci = [index];
   
    
    osnovnaBaza.db.all(sql, function (err, rows) 
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



// --------------------- LIGA ---------------------------


router.post('/dajMeceveSaRezultatima', function (req, res, next) 
{
    //console.log(req.body);
    //console.log(req.file);

    osnovnaBaza.db.serialize(function () 
    {
        //console.log(req.body);
        //let index = req.body.id_korisnika;
        let indexTurnira = req.body.id_turnira;

        podaci = [indexTurnira];

        
        sql = `Select mec.id_meca as id_meca, k.korisnicko_ime as korisnicko_ime1 ,rm1.id_korisnika as id_korisnika1, rm1.ucinak as ucinak1, rm2.ucinak as ucinak2, rm2.id_korisnika as id_korisnika2, k2.korisnicko_ime as korisnicko_ime2, rm1.runda as runda, k.avatar as avatar1, k2.avatar as avatar2, mec.vreme_pocetka as vreme_pocetka
        From RezultatMeca rm1 LEFT JOIN RezultatMeca rm2 on rm1.id_meca=rm2.id_meca and rm1.id_korisnika <> rm2.id_korisnika INNER JOIN Mec mec on mec.id_meca=rm1.id_meca INNER JOIN Korisnik k on k.id_korisnika = rm1.id_korisnika INNER JOIN Korisnik k2 on k2.id_korisnika=rm2.id_korisnika
        Where rm1.id_korisnika > rm2.id_korisnika and mec.id_turnira = ?`;
        
        osnovnaBaza.db.all(sql, podaci, function (err, rows) 
        {
            if (err)
            {
                
                return console.log(err.message);
            }
            
            res.send(rows);
        }); 
    });
});

router.post('/dajTabelu', function (req, res, next) 
{
    //console.log(req.body);
    //console.log(req.file);

    osnovnaBaza.db.serialize(function () 
    {
        //console.log(req.body);
        //let index = req.body.id_korisnika;
        let indexTurnira = req.body.id_turnira;

        podaci = [indexTurnira];

        let tabela;

        sqlPobeda = `Select rm1.id_korisnika as id_korisnika, m.id_turnira as id_turnira, k.korisnicko_ime as korisnicko_ime, count(case rm1.pobedio when '1' then 1 else null end) as broj_pobeda, count(case rm1.pobedio||rm2.pobedio when '01' then 1 else null end) as broj_poraza, count(case rm1.pobedio||rm2.pobedio when '00' then 1 else null end) as broj_neresenih
        From RezultatMeca rm1 LEFT JOIN RezultatMeca rm2 on rm1.id_meca=rm2.id_meca and rm1.id_korisnika<>rm2.id_korisnika INNER JOIN Mec m on m.id_meca=rm1.id_meca INNER JOIN Korisnik k on k.id_korisnika=rm1.id_korisnika
        Where m.id_turnira = ?
        group by m.id_turnira ,rm1.id_korisnika `;
        
        /*sqlPoraza=`Select rm1.id_korisnika as id_korisnika,k.korisnicko_ime as korisnicko_ime, count(*) as broj_poraza
        From RezultatMeca rm1 LEFT JOIN RezultatMeca rm2 on rm1.id_meca=rm2.id_meca and rm1.id_korisnika<>rm2.id_korisnika INNER JOIN Mec m on m.id_meca=rm1.id_meca INNER JOIN Korisnik k on k.id_korisnika=rm1.id_korisnika
        Where rm1.pobedio < rm2.pobedio  and m.id_turnira = ?
        group by m.id_turnira ,rm1.id_korisnika`;

        sqlNeresenih= `Select rm1.id_korisnika as id_korisnika,k.korisnicko_ime as korisnicko_ime, count(*) as broj_neresenih
        From RezultatMeca rm1 LEFT JOIN RezultatMeca rm2 on rm1.id_meca=rm2.id_meca and rm1.id_korisnika<>rm2.id_korisnika INNER JOIN Mec m on m.id_meca=rm1.id_meca INNER JOIN Korisnik k on k.id_korisnika=rm1.id_korisnika
        Where rm1.pobedio = rm2.pobedio  and m.id_turnira = ?
        group by m.id_turnira ,rm1.id_korisnika`;*/


        osnovnaBaza.db.all(sqlPobeda, podaci, function (err, rows) 
        {
            if (err)
            {
                
                return console.log(err.message);
            }
            
            
            tabela=JSON.stringify(rows);

            //console.log(rows);
            res.send(tabela);



        }); 
    });
});

router.post('/brojKorisnikaPoTurniru', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.
    //let index;
   // index = req.body.id_korisnika;
    
    let sql = `Select id_turnira as id_turnira, count( DISTINCT id_korisnika) as broj_prijavljenih
                From Igrac
                Group by id_turnira`;

    //let podaci = [index];
   
    
    osnovnaBaza.db.all(sql, function (err, rows) 
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


//---------------------------------------------------------








module.exports = router;