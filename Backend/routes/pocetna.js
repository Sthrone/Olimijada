var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyPareser = require('body-parser');


router.use(bodyPareser.json());

router.post('/najpopularnijeIgre', function (req, res, next) 
{ 
   
    let sql =   `SELECT *
                FROM Turnir t JOIN Igra i on t.id_igre = i.id_igre 
                GROUP BY t.id_igre 
                ORDER BY count(*) desc 
                LIMIT 4`;

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


router.post('/najpopularnijeIgreKorisnika', function (req, res, next) 
{ 
    let id=req.body.id_korisnika;
    let sql =   `SELECT *
                FROM Mec m
                JOIN RezultatMeca rm on m.id_meca = rm.id_meca
                JOIN Korisnik k on rm.id_korisnika = k.id_korisnika
                JOIN Turnir t on t.id_turnira = m.id_turnira
                JOIN Igra i on i.id_igre = t.id_igre
                WHERE k.id_korisnika = ?
                GROUP BY t.id_igre
                ORDER BY count(*) desc
                LIMIT 3`;

    osnovnaBaza.db.all(sql, [id], function (err, rows) 
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

router.post('/prijavljeniTurniri', function (req, res, next) 
{ 
    
    let id=req.body.id_korisnika;
    let sql =   `SELECT DISTINCT t.id_turnira,t.naziv_turnira, ii.naziv_igre, t.datum_odigravanja, t.broj_ucesnika, ii.id_igre, tp.naziv_tipa_turnira, t.datum_kraja_prijave
                FROM Igrac i 
                JOIN Turnir t on i.id_turnira = t.id_turnira
                JOIN Igra ii on ii.id_igre = t.id_igre
                join TipTurnira tp on tp.id_tipa_turnira = t.id_tipa_turnira
                WHERE t.datum_odigravanja >= Date('now') AND i.id_korisnika = ?`;

    osnovnaBaza.db.all(sql,[id], function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            res.send(rows);
        }
    })
});

router.post('/turniriZaKorisnika', function (req, res, next) 
{ 
    //Linkovima ka turnirima za koje je otvorena prijava, a igre tih turnira spadaju među one koje korisnik najviše igra. 
    let indexi = JSON.parse(req.body.igre);
    let podaci = [];
    let sql =   `SELECT DISTINCT t.naziv_turnira, p.id_turnira,i.id_igre, i.naziv_igre, t.datum_odigravanja, t.broj_ucesnika, tp.naziv_tipa_turnira, t.datum_kraja_prijave
                FROM PrijavaZaTurnir p
                JOIN Turnir t on p.id_turnira = t.id_turnira
                JOIN Igra i on t.id_igre = i.id_igre
                join TipTurnira tp on tp.id_tipa_turnira = t.id_tipa_turnira
                WHERE t.id_stanja = 1 AND i.id_igre IN (?`;

    let duzina = indexi.length;

    for(let i=1; i<duzina; i++)
    {
        sql += `, ?`;
    }
    sql += `)`;

    for(let i=0; i<duzina; i++)
    {
        podaci.push(indexi[i].id_igre);
    }

    osnovnaBaza.db.all(sql, podaci, function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            res.send(rows);
        }
    })
});

router.post('/neuspesniTurniri', function (req, res, next) 
{ 
    
    let sql =   `SELECT *
                from Turnir t
                join Igra ii on t.id_igre = ii.id_igre
                join TipTurnira tp on tp.id_tipa_turnira = t.id_tipa_turnira
                where t.datum_kraja_prijave < Date('now') AND t.broj_ucesnika > 
                (
                    select count(distinct(i.id_korisnika))
                    from Igrac i 
                    where i.id_turnira = t.id_turnira
                )`;

    osnovnaBaza.db.all(sql,[], function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            res.send(rows);
        }
    })
});

router.post('/zadnjih10Korisnika', function (req, res, next) 
{ 
    
    let sql =   `SELECT *
                from Korisnik 
                Order by id_korisnika DESC
                LIMIT 9`;

    osnovnaBaza.db.all(sql,[], function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            res.send(rows);
        }
    })
});

router.post('/zadnjih10Turnira', function (req, res, next) 
{ 
    
    let sql =   `SELECT *
                from Turnir t
                join Igra i on i.id_igre = t.id_igre
                join TipTurnira tp on tp.id_tipa_turnira = t.id_tipa_turnira
                where t.datum_odigravanja < Date('now') AND t.id_stanja = 3
                Order by t.datum_odigravanja  DESC
                LIMIT 10`;

    osnovnaBaza.db.all(sql,[], function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            res.send(rows);
        }
    })
});

router.post('/zadnjih10mecevaZaKorisnika', function (req, res, next) 
{ 
    let id = req.body.id_korisnika;

    let sql =   `select m.*, rm.id_korisnika, rm1.id_korisnika, k1.korisnicko_ime, k2.korisnicko_ime, t.naziv_turnira, tp.naziv_tipa_turnira, i.naziv_igre
                from Mec m
                join RezultatMeca rm on rm.id_meca = m.id_meca AND rm.id_korisnika = ?
                join RezultatMeca rm1 on rm1.id_korisnika != ? AND rm1.id_meca = rm.id_meca
                join Turnir t on t.id_turnira = m.id_turnira
                join Igra i on i.id_igre = t.id_igre
                join Korisnik k1 on k1.id_korisnika = rm.id_korisnika
                join Korisnik k2 on k2.id_korisnika = rm1.id_korisnika
                join TipTurnira tp on tp.id_tipa_turnira = t.id_tipa_turnira
                order by m.vreme_pocetka desc
                limit 5`;
    let podaci = [id, id];
    osnovnaBaza.db.all(sql,podaci, function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            res.send(rows);
        }
    })
});

router.post('/Najigranijih10IgaraSaTurnirima', function (req, res, next) 
{ 
    
    let sql =   `SELECT i.id_igre as id_igre, i.naziv_igre as naziv_igre, count(t.id_turnira) as broj_turnira
                    from Turnir t
                    join Igra i on i.id_igre = t.id_igre
                    join TipTurnira tp on tp.id_tipa_turnira = t.id_tipa_turnira
                    where  t.id_stanja = 3
                    Group by i.id_igre
                    Order by count(t.id_turnira)
                    LIMIT 10`;

    osnovnaBaza.db.all(sql,[], function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            res.send(rows);
        }
    })
});


module.exports = router;
