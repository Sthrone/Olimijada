var express = require('express');
var router = express.Router();
var osnovnaBaza=require('../config/database');
var bodyParser=require('body-parser');
var Korisnik=require('../Klase/Korisnik');
var sha1 = require('sha1');
var multer = require('multer'); 

/*
var storage = multer.diskStorage
({
  destination: function (req, file, cb) {
    cb(null, 'public/images/avatar')
  },
  filename: function (req, file, cb) {
    cb(null, "" + Date.now() + "_" + file.originalname)
  }
});

var upload = multer({storage: storage});
*/

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

router.post('/', upload.single('avatar'), function(req, res) 
{
  //console.log(req.body);
  //console.log(req.file);
  
  osnovnaBaza.db.serialize(function()
  {
    let k = new Korisnik();
    k.korisnicko_ime = JSON.parse(req.body.user).korisnicko_ime;
    k.lozinka = JSON.parse(req.body.user).lozinka;
    k.email = JSON.parse(req.body.user).email;
    k.odgovor = JSON.parse(req.body.user).odgovor;
    k.id_tipa_korisnika = JSON.parse(req.body.user).id_tipa_korisnika;

    //let pom = validator.validate(k.email); 

    k.avatar = req.file.filename;
    if (k.avatar === "prazan.txt")
      k.avatar = "default_user_picture.png";

    let sql = "INSERT INTO Korisnik(korisnicko_ime, lozinka, email, odgovor, avatar, id_tipa_korisnika, rejting) VALUES(?,?,?,?,?,?,?)";
    let podaci = [k.korisnicko_ime, sha1(k.lozinka), k.email, k.odgovor, k.avatar, k.id_tipa_korisnika, 0];

    osnovnaBaza.db.run(sql, podaci, (err) =>
    {
      if (err)
      {
        res.status(404).send({success: false});
        return console.log(err.message);
      }
  
      res.status(200).send({success: true});
    });    
   
/*
    emailCheck('lazafiju44@gmail.com', function(error, response){
      console.log('res: '+response);
      console.log('jedan');
      if(response == true)
      {
        console.log('dva');
        k.avatar = req.file.filename;
        if (k.avatar === "prazan.txt")
          k.avatar = "default_user_picture.png";

        let sql = "INSERT INTO Korisnik(korisnicko_ime, lozinka, email, odgovor, avatar, id_tipa_korisnika) VALUES(?,?,?,?,?,?)";
        let podaci = [k.korisnicko_ime, sha1(k.lozinka), k.email, k.odgovor, k.avatar, k.id_tipa_korisnika];

        osnovnaBaza.db.run(sql, podaci, (err) =>
        {
          if (err)
          {
            res.status(404).send({success: false});
            return console.log(err.message);
          }
      
          res.status(200).send({success: true});
        });    
      }
      else
      {
        console.log('tri');
        res.status(404).send({'success': false, 'greska': true});
      }
        
    });*/

  });  
});



router.post('/proveriPostojanjeEmaila', function (req, res, next) 
{ 
   
    podaci = [req.body.email];

    let sql =   `SELECT count(*) as broj
                From Korisnik
                Where email = ?`;

    osnovnaBaza.db.all(sql,podaci, function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
            
            //igre=JSON.stringify(rows);
            res.send(rows); 
        }
    })
});
router.post('/proveriPostojanjeUsername', function (req, res, next) 
{ 
   
    podaci = [req.body.korisnicko_ime];

    let sql =   `SELECT count(*) as broj
                From Korisnik
                Where korisnicko_ime = ?`;

    osnovnaBaza.db.all(sql,podaci, function (err, rows) 
    {        
        if (err)
            console.log(err);
        else
        {
          
          //igre=JSON.stringify(rows);
          res.send(rows); 
        }
    })
});


module.exports = router;