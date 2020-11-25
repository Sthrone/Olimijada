var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');
var Igra = require('../Klase/Igra');
var Korisnik = require('../Klase/Korisnik');
var multer = require('multer');
var sha1 = require('sha1');
var fs = require('fs');

var upload = multer
({
  storage: 
  multer.diskStorage
  ({
    destination: (req, file, callback) => 
    {
      callback(null, 'public/images/avatar');
    },
    filename: (req, file, callback) => 
    {
      let naziv = file.originalname;

      if (file.originalname !== "prazan.txt")
        naziv = "" + Date.now() + "_" + file.originalname;

      callback(null, naziv);
    }
  })
});

router.use(bodyParser.json());



router.post('/', upload.single('avatar'), function (req, res) {

  osnovnaBaza.db.serialize(function () {
    let k = new Korisnik();

    k.id_korisnika = JSON.parse(req.body.user).id_korisnika;

    k.korisnicko_ime = JSON.parse(req.body.user).korisnicko_ime;
    k.lozinka = JSON.parse(req.body.user).lozinka;
    k.email = JSON.parse(req.body.user).email;
    k.odgovor = JSON.parse(req.body.user).odgovor;
    k.id_tipa_korisnika = JSON.parse(req.body.user).id_tipa_korisnika;
    k.organizacija = JSON.parse(req.body.user).organizacija;
    k.drzava = JSON.parse(req.body.user).drzava;
    
    if (req.file.filename!=='prazan.txt')
    {
      k.avatar = req.file.filename;
      if((JSON.parse(req.body.user).avatar != null) && (JSON.parse(req.body.user).avatar !== "default_user_picture.png"))
        fs.unlinkSync('./public/images/avatar/' + JSON.parse(req.body.user).avatar);
    }
    else 
    {
      k.avatar = JSON.parse(req.body.user).avatar;
    }


  
    
    let podaci = [];
    let sql = "UPDATE Korisnik SET korisnicko_ime = ?,";

    if (k.lozinka != '') {
      sql += "lozinka=?,";
      podaci = [k.korisnicko_ime, sha1(k.lozinka), k.email, k.avatar, k.id_tipa_korisnika, k.drzava, k.organizacija, k.id_korisnika];
    }
    else {
      podaci = [k.korisnicko_ime, k.email, k.avatar, k.id_tipa_korisnika, k.drzava, k.organizacija, k.id_korisnika];
    }
    sql += "email=?,avatar=?,id_tipa_korisnika=?,drzava=?,organizacija=? WHERE id_korisnika = ?";

  

    osnovnaBaza.db.run(sql, podaci, (err) => 
    {
      
      if (err) 
      {
        res.status(404).send({ success: false });
        return console.log(err.message);
      }

      res.status(200).send({ 'user': k });
    });

  });

});





router.post('/proveraSifre', (req, res, next) => {

  osnovnaBaza.db.serialize(function () {
    let sql = `Select count(*) as broj 
               From Korisnik k
               Where k.id_korisnika=? and k.lozinka=?`;

    let id = req.body.id_korisnika;
    let lozinka = req.body.lozinka;




    let podaci = [id, sha1(lozinka)];


    osnovnaBaza.db.all(sql, podaci, function (err, row) {

      if (err)
        console.log(err);
      else {
        res.send(row);
      }
    });
  });
});


router.post('/banKorisnika', function (req, res, next) 
{ 
    let id = req.body.id_korisnika;
    let vreme = req.body.vreme;
    console.log(id + " " + vreme);
    let sql =   `UPDATE Korisnik
                SET ban = ?
                WHERE id_korisnika = ?`;
    
    let podaci = [vreme, id];

    osnovnaBaza.db.all(sql, podaci, function (err, rows) 
    {        
      if (err)
        console.log({success: false});
      else
      {
        res.send({success: true});
      }
    })
});

router.post('/promeniTipKorisnika', function (req, res, next) 
{ 
    let id = req.body.id_korisnika;
    let tip = req.body.tip_korisnika;

    let sql =   `UPDATE Korisnik
                SET id_tipa_korisnika = ?
                WHERE id_korisnika = ?`;
    
    let podaci = [tip, id];

    osnovnaBaza.db.all(sql, podaci, function (err, rows) 
    {        
        if (err)
            console.log({success: false});
        else
        {
            res.send({success: true});
        }
    }) 
});

/*


router.post('/izmenaBezSlike', (req, res, next) =>
{
  
  osnovnaBaza.db.serialize(function()
  {
    
    let k = new Korisnik();
    
    k.id_korisnika=req.body.user.id_korisnika;
    
    k.korisnicko_ime = req.body.user.korisnicko_ime;
    k.lozinka = req.body.user.lozinka;
    k.email = req.body.user.email;
    k.odgovor = req.body.user.odgovor;
    k.id_tipa_korisnika = req.body.user.id_tipa_korisnika;
    k.organizacija=req.body.user.organizacija;
    k.drzava=req.body.user.drzava;
    
    
   
     

    
   
   
    let podaci=[];
    let sql = `UPDATE Korisnik 
               SET korisnicko_ime = ?,`;
               
    if(k.lozinka!='')
    {
      sql+=`lozinka=?,`;
      podaci = [k.korisnicko_ime, sha1(k.lozinka), k.email, k.id_tipa_korisnika,k.drzava,k.organizacija,k.id_korisnika];
    }
    else{
      podaci = [k.korisnicko_ime, k.email, k.id_tipa_korisnika,k.drzava,k.organizacija,k.id_korisnika];
    } 
    sql+=`email=?,odgovor=?,id_tipa_korisnika=?,drzava=?,organizacija=?
               WHERE id_korisnika = ?`;
    
   
    osnovnaBaza.db.run(sql,podaci, (err)=>
    {
        
      if (err)
      {
        res.status(404).send({success: false});
        return console.log(err.message);
      }
  
      res.status(200).send({success: true});
    }); 
  }); 
});

*/

module.exports = router;