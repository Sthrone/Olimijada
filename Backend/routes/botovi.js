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

var upload = multer
({
  storage: 
  multer.diskStorage
  ({
    destination: (req, file, callback) => 
    {
      let bot = new Bot();
      bot.id_korisnika = JSON.parse(req.body.bot_info).id_korisnika;
      bot.id_igre = JSON.parse(req.body.bot_info).id_igre;

      let polje = file.fieldname;
      let path = '';
      
      if (polje === "bot")
        path = './botovi/' + bot.id_korisnika + '/' + bot.id_igre;

      mkdirp.sync(path);

      callback(null, path);
    },
    filename: (req, file, callback) => 
    {
      let polje = file.fieldname;
      let naziv = '';

      if (polje === "bot")
        naziv = file.originalname;

      callback(null, naziv);
    }
  })
});


// Vraca sve botove za odredjenu igru odredjenog korisnika i sve tipove botova za tu igru.
router.post('/pronadji_botove',  (req, res, next) =>
{
    osnovnaBaza.db.serialize(() =>
    {
        let korisnik = req.body.id_korisnika;
        let igra = req.body.id_igre;

        let botovi;
        let tipovi;

        let sql1 = `SELECT b.id_bota, b.putanja_do_fajla, b.id_korisnika, b.id_tipa_bota, tb.naziv_tipa_bota, tb.id_igre 
                    FROM Bot b JOIN TipBota tb ON b.id_tipa_bota = tb.id_tipa_bota 
                    WHERE b.id_korisnika = ? AND tb.id_igre = ?`;
        let podaci1 = [korisnik, igra];

        let sql2 = `SELECT * 
                    FROM TipBota 
                    WHERE id_igre = ?`;
        let podaci2 = [igra];

   
        // Pokupi sve botove za ovu igru, ovog korisnika.
        osnovnaBaza.db.all(sql1, podaci1, (err, rows) =>
        {
            if (err)
            {
                console.log(err.message);
                res.status(404).send({errorMessage: "Operation failed."});
            }

            botovi = JSON.stringify(rows);
        });

        // Pokupi sve tipove botova za ovu ugru.
        osnovnaBaza.db.all(sql2, podaci2, (err, rows) =>
        {
            if (err)
            {
                console.log(err.message);
                res.status(404).send({errorMessage: "Operation failed."});
            }

            tipovi = JSON.stringify(rows);

            res.status(200).send({'botovi': botovi, 'tipovi': tipovi});    
        });
    });
});


// Dodaje informacije o botu u bazu i upload-uje fajl.
router.post('/dodaj_bota', upload.single('bot'), (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    let bot = new Bot();
    bot.id_korisnika = JSON.parse(req.body.bot_info).id_korisnika;
    bot.id_tipa_bota = JSON.parse(req.body.bot_info).id_tipa_bota;
    bot.id_igre = JSON.parse(req.body.bot_info).id_igre;
    bot.putanja_do_fajla = req.file.filename;

    let sql = `SELECT * 
               FROM Bot 
               WHERE putanja_do_fajla = ? AND id_tipa_bota = ? AND id_korisnika = ?`;

    let podaci = [bot.putanja_do_fajla, bot.id_tipa_bota, bot.id_korisnika];

    osnovnaBaza.db.get(sql, podaci, (err, row) => 
    {
      if (err)
      {
        res.status(404).send({errorMessage: "Operation failed."});
        return console.log(err.message);
      }
      
      if (row === undefined)
      {        
        sql = `INSERT INTO Bot(putanja_do_fajla, id_korisnika, id_tipa_bota) 
               VALUES(?, ?, ?)`;

        podaci = [bot.putanja_do_fajla, bot.id_korisnika, bot.id_tipa_bota];

        osnovnaBaza.db.run(sql, podaci, (err) =>
        {
          if (err)
          {
            res.status(404).send({errorMessage: "Operation failed."});
            return console.log(err.message);
          }

          sql = `SELECT MAX(id_bota) as Maksimum 
                 FROM Bot`;

          osnovnaBaza.db.get(sql, [], (err, row) =>
          {
            bot.id_bota = row.Maksimum;
            res.status(200).send({'bot': bot, 'success': true});
          });
        });
      }
      else
      {
        res.status(200).send({'bot': row, 'success': false});
      }
    });
  });
});


// Brise selektovane botove iz baze i iz fajl sistema.
router.post('/obrisi_botove', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.
    let botovi;
    botovi = JSON.parse(req.body.botovi);
    
    let sql = "DELETE FROM Bot WHERE id_bota IN (?";

    for (let i = 1 ; i < botovi.length ; i++)
      sql += ", ?";

    sql += ")";

    let podaci = [];
    for (let i = 0 ; i < botovi.length ; i++)
    {
      fs.unlinkSync('./botovi/' + botovi[i].id_korisnika + '/' + botovi[i].id_igre + '/' + botovi[i].putanja_do_fajla);
      podaci.push(botovi[i].id_bota);
    }

    osnovnaBaza.db.run(sql, podaci, (err) =>
    {
      if (err)
      {
        res.status(404).send({errorMessage: "Operation failed."});
        return console.log(err.message);
      }

      res.status(200).send({success: true});
    });
  });
});

router.post('/dajBrojBotova', (req, res, next) =>
{
  osnovnaBaza.db.serialize(() =>
  {
    // Treba kreirati upit, tako da moze da brise proizvoljan broj id-eva.
    let index;
    index = req.body.id_korisnika;
    
    let sql = `Select count(*) as broj
              FROM Bot b
              WHERE b.id_korisnika = ?`;

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



router.post('/dajTipoveBotova',  (req, res, next) =>
{
    osnovnaBaza.db.serialize(() =>
    {
        let igra = req.body.id_igre;

        let podaci = [igra];

        let sql = `SELECT * 
                    FROM TipBota 
                    WHERE id_igre = ?`;
        

        // Pokupi sve tipove botova za ovu ugru.
        osnovnaBaza.db.all(sql, podaci, (err, rows) =>
        {
            if (err)
            {
                console.log(err.message);
                res.status(404).send({errorMessage: "Operation failed."});
            }

            res.status(200).send(rows);    
        });
    });
});




module.exports = router;