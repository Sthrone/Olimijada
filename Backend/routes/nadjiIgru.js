var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyPareser = require('body-parser');

router.use(bodyPareser.json());

router.post('/', function (req, res, next) 
{
    osnovnaBaza.db.serialize(function()
    {
        let id=req.body.id_igre;
        let podaci=[id];
        let sql =`SELECT i.*,t.naziv_tipa_igre as naziv_tipa_igre, t.naziv_tipa_igre_srb as naziv_tipa_igre_srb 
                  FROM Igra i INNER JOIN TipIgre t on i.id_tipa_igre=t.id_tipa_igre 
                  WHERE i.id_igre=?`;
                  
        osnovnaBaza.db.all(sql,podaci, function (err, row) 
        {
            if (err)
                console.log(err);
            else
            {
                igra=JSON.stringify(row);   
                res.send(igra); 
            }
        });
    });
});


router.post('/alfabet', function (req, res, next) 
{
    let sql = `SELECT id_igre AS ID FROM Igra ORDER BY naziv_igre ASC LIMIT 1`;
                
    osnovnaBaza.db.get(sql, [], function (err, row) 
    {
        if (err)
            console.log(err);
        else
        {
            res.send({'id_igre': row.ID});
        }
    });
});



module.exports = router;
