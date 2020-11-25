var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var provera = require('../config/jwt');

router.use(bodyParser.json());
router.use(provera.ProveriToken);

router.post('/', function(req, res, next)
{
    let real = req.decoded;
    let probe = JSON.parse(req.body.korisnik);

    if ((real.id_korisnika == probe.id_korisnika) && (real.id_tipa_korisnika == probe.id_tipa_korisnika))
        res.send({success: true});
    else
        res.send({success: false});
});


module.exports = router;

