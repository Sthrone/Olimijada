var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');
var Korisnik = require('../Klase/Korisnik');
var jwt = require('../config/jwt');
var sha1 = require('sha1');

router.use(bodyParser.json());

router.post('/', function(req, res, next) 
{
    k = new Korisnik();
    k.korisnicko_ime = req.body.korisnicko_ime;
    k.lozinka = req.body.lozinka;
    k.email = req.body.email;

    osnovnaBaza.db.serialize(() =>
    {
        let sql;
        let podaci;

        if (k.korisnicko_ime != null && k.korisnicko_ime != "")  // Uneto je korisnicko ime
        {
            sql = `SELECT * 
                   FROM Korisnik 
                   WHERE korisnicko_ime = ? AND lozinka = ?`;

            podaci = [k.korisnicko_ime, sha1(k.lozinka)];
        }
        else                // Unet je email
        {
            sql = `SELECT * 
                   FROM Korisnik 
                   WHERE email = ? AND lozinka = ?`;

            podaci = [k.email, sha1(k.lozinka)];
        }
        
        osnovnaBaza.db.get(sql, podaci, (err, row) =>
        {
            if (err)
            {
                console.log(err);
            }
            else
            {
                if (row !== undefined)
                {
                    let user = new Korisnik();
                    user.NapraviSve(row.id_korisnika, row.korisnicko_ime, '', row.email, row.avatar, '', row.id_tipa_korisnika, row.drzava, row.organizacija, row.rejting, row.ban);
                    let token = jwt.PotpisiToken(JSON.stringify(user));
                    res.status(200).send({user: user, token: token});
                }
                else
                {
                    res.status(404).send({errorMessage: "Wrong username or password"});
                }
            }   
        });
    });
});

module.exports = router;