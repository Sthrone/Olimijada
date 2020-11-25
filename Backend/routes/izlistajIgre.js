
var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyPareser = require('body-parser');


router.use(bodyPareser.json());


/* GET users listing. */


router.post('/', function (req, res, next) 
{ 
   
    let sql ="SELECT i.*,t.naziv_tipa_igre as naziv_tipa_igre,t.naziv_tipa_igre_srb as naziv_tipa_igre_srb FROM Igra i INNER JOIN TipIgre t on i.id_tipa_igre=t.id_tipa_igre";
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


module.exports = router;
