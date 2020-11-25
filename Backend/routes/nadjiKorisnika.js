var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyPareser = require('body-parser');


router.use(bodyPareser.json());


/* GET users listing. */
router.post('/', function (req, res, next) 
{
    osnovnaBaza.db.serialize(function()
    {
     
        let id=req.body.id_korisnika;
        let podaci=[id];
        let sql =`SELECT * 
                  FROM Korisnik k 
                  WHERE k.id_korisnika=?`;
                  
        osnovnaBaza.db.all(sql,podaci, function (err, row) 
        {
            if (err)
                console.log(err);
            else
            {
                korisnik=JSON.stringify(row);
                
                res.send(korisnik);
            
            }
                
        });
    });
});


module.exports = router;