var express = require('express');
var router = express.Router();
var osnovnaBaza=require('../config/database');
var bodyParser=require('body-parser');
var Igra = require('../Klase/Igra');
var TipBota = require('../Klase/TipBota');
var multer = require('multer');

var upload = multer
({
  storage: 
  multer.diskStorage
  ({
    destination: (req, file, callback) => 
    {
      let polje = file.fieldname;
      let path = '';
      
      if (polje === "fajl_igre")
        path = './igre';
      else if (polje === "slika_igre")
        path = './public/images/slike_igara';
      else if (polje == "slika_pozadine_igre")
        path = './public/images/slike_pozadine_igara';

      callback(null, path);
    },
    filename: (req, file, callback) => 
    {
      let polje = file.fieldname;
      let naziv = '';

      if (polje === "slika_igre")
        naziv = "" + Date.now() + "_" + file.originalname;
      else if(polje === "slika_pozadine_igre")
        naziv = "" + Date.now() + "_" + file.originalname;
      else
        naziv = file.originalname;

      callback(null, naziv);
    }
  })
});


router.use(bodyParser.json());

router.post('/', upload.fields([{ name: 'fajl_igre', maxCount: 1 }, { name: 'slika_igre', maxCount: 1 },{ name: 'slika_pozadine_igre', maxCount: 1 } ]), (req, res, next) =>
{
  osnovnaBaza.db.serialize(function()
  {
      let igra = new Igra();
      igra.naziv_igre = JSON.parse(req.body.igra).naziv_igre.toProperCase();
      igra.broj_igraca = JSON.parse(req.body.igra).broj_igraca;
      igra.trajanje_u_sekundama = JSON.parse(req.body.igra).trajanje_u_sekundama;  
      igra.putanja_do_fajla = req.files['fajl_igre'][0].filename;
      igra.slika_igre = req.files['slika_igre'] ? req.files['slika_igre'][0].filename : "default.png";
      igra.slika_pozadine_igre = req.files['slika_pozadine_igre'] ? req.files['slika_pozadine_igre'][0].filename : "default.jpg";
      igra.pravila_igre_en = JSON.parse(req.body.igra).pravila_igre_en;
      igra.pravila_igre_srb = JSON.parse(req.body.igra).pravila_igre_srb;
      igra.kratak_opis_en = JSON.parse(req.body.igra).kratak_opis_en;
      igra.kratak_opis_srb = JSON.parse(req.body.igra).kratak_opis_srb;

      // Tipovi botova
      let tipovi_botova = JSON.parse(req.body.tipovi_botova);

      let tip = JSON.parse(req.body.igra).naziv_tipa_igre;
      tip = tip.toProperCase();

      let sql = `SELECT id_tipa_igre as ID 
                 FROM TipIgre 
                 WHERE naziv_tipa_igre = ?`;
      let podaci = [tip];
      
      osnovnaBaza.db.get(sql, podaci, (err, row) =>
      {
        if (err)
        {
          console.log(err.message);
          res.status(404).send({errorMessage: "Operation failed."});
        }
        
        if (row == null)
        {
          // Potrebno je dodati novi tip igre.
          sql = `INSERT INTO TipIgre(naziv_tipa_igre) VALUES(?)`;
          podaci = [tip];

          osnovnaBaza.db.run(sql, podaci, (err) => 
          {
            if (err)
            {
              console.log(err.message);
              res.status(404).send({errorMessage: "Operation failed."});
            }
            else
            {
              sql = `SELECT MAX(id_tipa_igre) as Maksimum 
                     FROM TipIgre`;
              
              osnovnaBaza.db.get(sql, [], (err, row) =>
              {
                if (err)
                {
                  console.log(err.message);
                  res.status(404).send({errorMessage: "Operation failed."});
                }
                else
                {
                  igra.id_tipa_igre = row.Maksimum;
                  let odg = UpisiIgru(igra, res, tipovi_botova);
                }
              });
            }
          });
        }
        else 
        {
          igra.id_tipa_igre = row.ID;
          let odg = UpisiIgru(igra, res, tipovi_botova);
        }
      });
  }); 
});


router.post('/tipoviIgara', (req, res, next) =>
{
    let sql = `SELECT *
               FROM TipIgre 
               ORDER BY naziv_tipa_igre ASC`;
    
    osnovnaBaza.db.all(sql, [], function (err, rows) 
    {
        if (err)
            console.log(err);
        else
        {
            tipovi = JSON.stringify(rows);
            res.send(tipovi);
        }
    });
});



function UpisiIgru(igra, res, tipovi_botova)
{
  sql = `INSERT INTO Igra(naziv_igre, broj_igraca, pravila_igre_en, pravila_igre_srb, putanja_do_fajla, trajanje_u_sekundama, id_tipa_igre, slika_igre, kratak_opis_en, kratak_opis_srb,slika_pozadine_igre) 
             VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
      
  podaci=[igra.naziv_igre, igra.broj_igraca, igra.pravila_igre_en, igra.pravila_igre_srb, igra.putanja_do_fajla, igra.trajanje_u_sekundama, igra.id_tipa_igre, igra.slika_igre, igra.kratak_opis_en, igra.kratak_opis_srb, igra.slika_pozadine_igre];

  osnovnaBaza.db.run(sql, podaci, (err) =>
  {
    if (err)
    {
      console.log(err.message);
      res.status(404).send({errorMessage: "Operation failed."});
    }
    else
    {
      sql = `SELECT MAX(id_igre) as Maksimum 
             FROM Igra`;
              
      osnovnaBaza.db.get(sql, [], (err, row) =>
      {
        if (err)
        {
          console.log(err.message);
          res.status(404).send({errorMessage: "Operation failed."});
        }
        else
        {
          igra.id_igre = row.Maksimum;
          
          // Izgraditi upit
          sql = `INSERT INTO TipBota (naziv_tipa_bota, id_igre) VALUES (?, ` + igra.id_igre + `)`;
          for (let i=1 ; i < tipovi_botova.length ; i++)
            sql += `,(?, ` + igra.id_igre + `)`;

          osnovnaBaza.db.run(sql, tipovi_botova, (err) =>
          {
            if (err)
            {
              console.log(err.message);
              res.status(404).send({errorMessage: "Operation failed."});
            }
            else
            {
              res.status(200).send({'success': true, 'igra': igra});
            }
          });
        }
      });
    }
  });
}


// Funkcija koja pretvara string u Titlecase
String.prototype.toProperCase = function() 
{
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};


module.exports = router;