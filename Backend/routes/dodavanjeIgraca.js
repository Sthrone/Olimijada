var express = require('express');
var router = express.Router();
var osnovnaBaza=require('../config/database');
var bodyParser=require('body-parser');
var Igra = require('../Klase/Igra');
var TipBota = require('../Klase/TipBota');
var Igrac=require('../Klase/Igrac');
var multer = require('multer');




router.use(bodyParser.json());

router.post('/',(req, res, next) =>
{
  //console.log(req.body);
  //console.log(req.file);
  
  osnovnaBaza.db.serialize(function()
  {
    
    let igraci;
    igraci = JSON.parse(req.body.igraci);

    //let igrac = new Igrac();
    //igrac.naziv_igraca = JSON.parse(req.body.igrac).naziv_igraca;
    //igrac.id_bota = JSON.parse(req.body.igrac).id_bota;
    //igrac.id_korisnika = JSON.parse(req.body.igrac).id_korisnika;
    //igrac.slika_igraca = req.file.filename;
    //console.log('dsada');
    id_turnira=JSON.parse(req.body.turnir).id_turnira;

    //console.log(id_turnira);






    let sql = "INSERT INTO Igrac(naziv_igraca, id_bota, id_korisnika,id_turnira) VALUES (?,?,?,?)";
    for(let i=1 ; i<igraci.length; i++)
    {
      sql+=",(?, ?, ?, ?)";
    }  
      //sql+=")";
    
    // VALUES(?,?,?,?)";
    let podaci=[];
    for(let i=0;i<igraci.length;i++)
    {
      podaci.push(igraci[i].naziv_igraca);
      podaci.push(igraci[i].id_bota);
      podaci.push(igraci[i].id_korisnika);
      podaci.push(id_turnira);
    }  

    //console.log(sql);
    //console.log(podaci);

    osnovnaBaza.db.run(sql, podaci, (err) =>
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





module.exports = router;