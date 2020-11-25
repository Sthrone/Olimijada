var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');
var Igra = require('../Klase/Igra');

router.use(bodyParser.json());


router.post('/', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.

    let index;
    index=req.body.id_turnira;

    let sql = `Select *
              FROM Turnir t JOIN Mec m on t.id_turnira = m.id_turnira 
                            JOIN RezultatMeca rm on m.id_meca = rm.id_meca
                            JOIN Korisnik k on rm.id_korisnika = k.id_korisnika
                            JOIN Igra i on i.id_igre = t.id_igre
              Where t.id_turnira = ? 
              ORDER BY m.id_meca`;

   
    podaci=[index];
    osnovnaBaza.db.all(sql,podaci, function (err, row) 
    {
      
        if (err)
            console.log(err);
        else
        {   
            
            turnir=JSON.stringify(row);
            res.send(turnir);
        }
    });
  });
});

router.post('/meceviSaTurniraLiga', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.

    let index;
    index=req.body.id_turnira;

    let sql = `Select *
               FROM Turnir t JOIN Mec m on t.id_turnira = m.id_turnira 
                            JOIN RezultatMeca rm on m.id_meca = rm.id_meca
                            JOIN Korisnik k on rm.id_korisnika = k.id_korisnika
              Where t.id_turnira = ? 
              ORDER BY m.id_meca`;

   
    podaci=[index];
    osnovnaBaza.db.all(sql,podaci, function (err, row) 
    {
      
        if (err)
            console.log(err);
        else
        {   
            
            turnir=JSON.stringify(row);
            res.send(turnir);
        }
    });
  });
});

router.post('/meceviSaTurniraLiga', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.

    let index;
    index=req.body.id_turnira;

    let sql = `Select *
               FROM Turnir t JOIN Mec m on t.id_turnira = m.id_turnira 
                            JOIN RezultatMeca rm on m.id_meca = rm.id_meca
                            JOIN Korisnik k on rm.id_korisnika = k.id_korisnika
              Where t.id_turnira = ? 
              ORDER BY m.id_meca`;

   
    podaci=[index];
    osnovnaBaza.db.all(sql,podaci, function (err, row) 
    {
      
        if (err)
            console.log(err);
        else
        {   
            
            turnir=JSON.stringify(row);
            res.send(turnir);
        }
    });
  });
});

module.exports = router;