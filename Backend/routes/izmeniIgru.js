var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');
var Igra = require('../Klase/Igra');
var multer = require('multer');
var fs = require('fs');

router.use(bodyParser.json());

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

      if (polje === "slika_igre" && file.originalname !== "prazan.txt")
      {
        naziv = "" + Date.now() + "_" + file.originalname;
      }
      else if(polje === "slika_pozadine_igre" && file.originalname !== "prazan.txt")
      {
        naziv = "" + Date.now() + "_" + file.originalname;
      }
      else
        naziv = file.originalname;

      callback(null, naziv);
    }
  })
});

router.post('/', upload.fields([{ name: 'fajl_igre', maxCount: 1 }, { name: 'slika_igre', maxCount: 1 },{ name: 'slika_pozadine_igre', maxCount: 1 } ]), (req, res, next) =>
{
  osnovnaBaza.db.serialize(function()
  {
    console.log('dada');
      let igra = new Igra();
      igra.id_igre = JSON.parse(req.body.igra).id_igre;
      igra.naziv_igre = JSON.parse(req.body.igra).naziv_igre.toProperCase();
      igra.broj_igraca = JSON.parse(req.body.igra).broj_igraca;
      igra.trajanje_u_sekundama = JSON.parse(req.body.igra).trajanje_u_sekundama; 
      igra.putanja_do_fajla = JSON.parse(req.body.igra).putanja_do_fajla;
      igra.slika_igre = JSON.parse(req.body.igra).slika_igre;
      igra.pravila_igre_en =  JSON.parse(req.body.igra).pravila_igre_en;
      igra.pravila_igre_srb =  JSON.parse(req.body.igra).pravila_igre_srb;
      igra.kratak_opis_en = JSON.parse(req.body.igra).kratak_opis_en;
      igra.kratak_opis_srb = JSON.parse(req.body.igra).kratak_opis_srb;
      igra.slika_pozadine_igre = JSON.parse(req.body.igra).slika_pozadine_igre;

    

      let tipoviBotova = JSON.parse(req.body.tipovi_botova);

      if (req.files['fajl_igre'][0].filename != "prazan.txt")
      {
        fs.unlinkSync('./igre/' + igra.putanja_do_fajla);
        igra.putanja_do_fajla = req.files['fajl_igre'][0].filename;
      }

      if (req.files['slika_pozadine_igre'][0].filename !== "prazan.txt")
      {
        // Brisem jedino ako izmenjena slika nije default-na.
        if (igra.slika_pozadine_igre !== "default.jpg")
        {
          // U objektu igra se trenutno nalazi naziv stare slike.
          fs.unlinkSync('./public/images/slike_pozadine_igara/' + igra.slika_pozadine_igre);
        }
      
        // Setujem naziv nove slike.
        igra.slika_pozadine_igre = req.files['slika_pozadine_igre'][0].filename;
      }


      if (req.files['slika_igre'][0].filename !== "prazan.txt")
      {
        //console.log("IZMENA SLIKE IGRE!");

        if (igra.slika_igre !== "default.png")
        {
          //console.log("OBRISAO STARU!");
          fs.unlinkSync('./public/images/slike_igara/' + igra.slika_igre);
        }

        //console.log("STARA: " + igra.slika_igre);
        igra.slika_igre = req.files['slika_igre'][0].filename;
        //console.log("NOVA: " + igra.slika_igre);
      }

      /*   -------------- DO OVDE RADI  --------------   */

      // Na frontend se ne salju ispravno tipovi igara - pogledati combobox, u njemu treba da budu izlistani svi tipovi, a prikazan je samo jedan.
      // Tipove igara pokupiti iz tabele u bazi podataka. (uradjeno)
      
      /* igra.id_tipa_igre = ovde treba da se da id izabranog tipa igre, koji sada ne postoji na frontend-u. */
      // Pogledati kako je sve to oko combobox-a izvedeno u dodaj-igru.component.

      //UpisiIgru(igra, res, tipoviBotova);


      // ZAKOMENTARISAN DEO ISPOD NIJE POTREBAN, NJIME SE DODAJU NOVI TIPOVI IGARA, A TO SMO IZBACILI.
      
      let tip = JSON.parse(req.body.igra).naziv_tipa_igre;
      tip = tip.toProperCase();

      let sqlTipIGre = `SELECT id_tipa_igre as ID 
                 FROM TipIgre 
                 WHERE naziv_tipa_igre = ?`;
      let podaciTipIgre = [tip];
      
      
      osnovnaBaza.db.get(sqlTipIGre, podaciTipIgre, (err, row) =>
      {
        if (err)
        {
          console.log(err.message);
          res.status(404).send({errorMessage: "Operation failed."});
        }
        
        if (row == null)
        {
          
        }
        else 
        {
          igra.id_tipa_igre = row.ID;
          let odg = UpisiIgru(igra, res, tipoviBotova);
        }
      });
  }); 
});


function UpisiIgru(igra, res, tipoviBotova)
{
  sql = `UPDATE Igra 
        SET naziv_igre = ?, broj_igraca = ?, pravila_igre_en = ?,pravila_igre_srb = ?, putanja_do_fajla = ?, trajanje_u_sekundama = ?, id_tipa_igre = ?, slika_igre = ?, kratak_opis_en = ?,kratak_opis_srb = ?, slika_pozadine_igre = ? 
        WHERE id_igre = ?`;
      
  podaci=[igra.naziv_igre, igra.broj_igraca, igra.pravila_igre_en, igra.pravila_igre_srb, igra.putanja_do_fajla, igra.trajanje_u_sekundama, igra.id_tipa_igre, igra.slika_igre, igra.kratak_opis_en, igra.kratak_opis_srb, igra.slika_pozadine_igre,igra.id_igre];

  osnovnaBaza.db.run(sql, podaci, (err) =>
  {
    if (err)
    {
      console.log('dsadasda');
      res.status(404).send({errorMessage: "Operation failed."});
    }
    else
    {
      indexIgre=[igra.id_igre];
      sqlBrisanje=`DELETE FROM TipBota WHERE id_igre = ?`;

      osnovnaBaza.db.run(sqlBrisanje, indexIgre, (err)=>
      {
        if(err)
        {
          console.log(err.message);
          res.status(404).send({errorMessage: "Operation failed."});
        }
        else
        {
          sqlInsertTipovaBotova = `INSERT INTO TipBota (naziv_tipa_bota, id_igre) VALUES (?, ` + igra.id_igre + `)`;
          for (let i=1 ; i < tipoviBotova.length ; i++)
            sqlInsertTipovaBotova += `,(?, ` + igra.id_igre + `)`;
          
          osnovnaBaza.db.run(sqlInsertTipovaBotova, tipoviBotova, (err) =>
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

/* Ova funkcija je kompletno prebacena u funckiju iznad
function UpisiTipoveBotovaZaIgru(igra, tipoviBotova, res)
{

  podaci=[igra.id_igre];
  sqlBrisanje=`DELETE FROM TipBota WHERE id_igre = ?`;

  osnovnaBaza.db.run(sqlBrisanje, podaci, (err)=>
  {
    if(err)
    {
      console.log(err.message);
      res.status(404).send({errorMessage: "Operation failed."});
    }
    else
    {
      sql = `INSERT INTO TipBota (naziv_tipa_bota, id_igre) VALUES (?, ` + igra.id_igre + `)`;
      for (let i=1 ; i < tipoviBotova.length ; i++)
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
  })
  
}*/

// Funkcija koja pretvara string u Titlecase
String.prototype.toProperCase = function() 
{
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};





module.exports = router;