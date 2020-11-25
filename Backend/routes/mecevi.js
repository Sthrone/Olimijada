var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var mongoBaza = require('../config/mongo');
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/kretanje',  (req, res, next) =>
{
    mongoBaza.Mec.find({ id_meca: req.body.id_meca }, function(err,data)
    {  
        if (err) 
        {
            console.log(err.message);
            res.status(404).send({errorMessage: "Operation failed."});  
        }
        else
        {
            res.status(200).send(data);    
        }
    });
});


router.post('/igraci', (req, res, next) =>
{
    // Treba naci za koji je turnir ovaj mec.
    // Treba vratiti sve informacije o prijavljenim igracima i o korisnicima.

    let sql = `SELECT m.mongo_mec, igr.naziv_igraca, k.korisnicko_ime, k.avatar, rm.ucinak, rm.pobedio 
               FROM Mec m INNER JOIN Igrac igr ON m.id_meca = ? AND m.id_turnira = igr.id_turnira 
                          INNER JOIN Korisnik k ON igr.id_korisnika = k.id_korisnika 
                          INNER JOIN RezultatMeca rm ON m.id_meca = rm.id_meca AND igr.id_korisnika = rm.id_korisnika`;

    let podaci = [req.body.id_meca];

    osnovnaBaza.db.all(sql, podaci, (err, rows) => 
    {
        if (err) 
        {
            console.log(err.message);
            res.status(404).send({errorMessage: "Operation failed."});  
        }
        else
        {
            res.status(200).send(rows);    
        }
    });
});


router.post('/pozadinaPoBotu', (req, res, next) =>
{
    let sql = `SELECT i.slika_pozadine_igre AS pozadina, b.putanja_do_fajla AS naziv
               FROM Bot b INNER JOIN TipBota tb ON b.id_bota = ? AND b.id_tipa_bota = tb.id_tipa_bota 
                          INNER JOIN Igra i ON tb.id_igre = i.id_igre`;

    let podaci = [req.body.id_bota];

    osnovnaBaza.db.get(sql, podaci, (err, row) =>
    {
        if (err) 
        {
            console.log(err.message);
            res.status(404).send({errorMessage: "Operation failed."});  
        }

        res.status(200).send({pozadina: row.pozadina, naziv: row.naziv})
        
    });
});



module.exports = router;