var express = require('express');
var router = express.Router();
var osnovnaBaza = require('../config/database');
var bodyParser = require('body-parser');
var Par = require('../Klase/Par');
var Mec = require('../Klase/Mec');
var Turnir = require('../Klase/Turnir');
var Tabela = require('../Klase/Tabela');
var Dot = require('../Klase/Dot');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport
({
  service: 'gmail',
  auth: 
  {
    user: 'purelogicgames@gmail.com',
    pass: 'warm!tree!africa!'
  }
});

router.use(bodyParser.json());

router.post('/', (req, res, next) =>
{
  osnovnaBaza.db.serialize(function()
  {
      let turnir = new Turnir();
      turnir.datum_pocetka_prijave = req.body.turnir.datum_pocetka_prijave;
      turnir.datum_kraja_prijave = req.body.turnir.datum_kraja_prijave;
      turnir.id_tipa_turnira = req.body.turnir.id_tipa_turnira;  
      turnir.id_igre = req.body.turnir.id_igre; 
      turnir.broj_ucesnika = req.body.turnir.broj_ucesnika;
      turnir.id_stanja = 1;
      turnir.naziv_turnira = req.body.turnir.naziv_turnira;
      turnir.datum_odigravanja = req.body.turnir.datum_odigravanja;

      //console.log(turnir);

      UpisiTurnir(turnir, res);
  });
});


function UpisiTurnir(turnir, res)
{
  let sql = `INSERT INTO Turnir(datum_pocetka_prijave, datum_kraja_prijave, id_tipa_turnira, id_igre, id_stanja, naziv_turnira, datum_odigravanja, broj_ucesnika) 
         VALUES(?,?,?,?,?,?,?,?)`;
      
  let podaci = [turnir.datum_pocetka_prijave, turnir.datum_kraja_prijave, turnir.id_tipa_turnira, turnir.id_igre, turnir.id_stanja, turnir.naziv_turnira, turnir.datum_odigravanja, turnir.broj_ucesnika];

  osnovnaBaza.db.run(sql, podaci, (err) =>
  {
    if (err)
    {
      console.log(err.message);
      res.status(404).send({errorMessage: "Operation failed."});
    }
    else
    {
      sql = `SELECT MAX(id_turnira) as Maksimum 
             FROM Turnir`;
              
      osnovnaBaza.db.get(sql, [], function(err, row)
      {
        if (err)
        {
          console.log(err.message);
          res.status(404).send({errorMessage: "Operation failed."});
        }
        else
        {
          turnir.id_turnira = row.Maksimum;
          
          ZakaziRasporedjivanje(turnir);

          res.status(200).send({'success': true, 'turnir': turnir});
        }
      });
    }
  });
}


function ZakaziRasporedjivanje(turnir)
{
  var date = new Date(turnir.datum_kraja_prijave); 
  var rasporedjivanje = schedule.scheduleJob(date, function(turnir)
  {
    // Ukoliko nema dovoljno prijavljenih, onda nista.
    // Ukoliko ima dovoljno prijavljenih, poslati im mejl, kada ce turnir biti odrzan.
    // Treba napraviti sve parove (liga) ili prvi nivo (kup).

    // Provera broja prijavljenih...
    var prijavljeniKorisnici = [];

    let sql = `SELECT DISTINCT id_korisnika 
               FROM Igrac 
               WHERE id_turnira = ?`;
    
    let podaci = [turnir.id_turnira];               
              
    osnovnaBaza.db.all(sql, podaci, function(err, rows)
    {
      if (err)
      {
        console.log(err.message);
        res.status(404).send({errorMessage: "Operation failed."});
      }
      else
      { 
        prijavljeniKorisnici = rows;
        
        if (prijavljeniKorisnici.length === 4)    // U suprotnom nista.
        {
          // Dodati u Mec, pa u RezultatMeca
          // Izmeniti stanje turnira u Active
          // Obavestiti korisnike

          // Ako je kup, onda treba osmisliti samo 2 kombinacije.
          // Ako je liga, onda treba osmisliti 6 kombinacija (3 kola).
          // this.lastID

          // --------------- KUP ---------------
          if (turnir.id_tipa_turnira == 1)        
          {
            let minimum = 1;
            let maximum = 3;
            
            // Broj ce biti 1, 2 ili 3, i to je protivnik korisnika u index-u 0.
            let randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            
            let suprotstavljeni = [];
            suprotstavljeni[0] = prijavljeniKorisnici[0].id_korisnika;
            suprotstavljeni[1] = prijavljeniKorisnici[randomnumber].id_korisnika;

            if (randomnumber == 1)
            {
              suprotstavljeni[2] = prijavljeniKorisnici[2].id_korisnika;
              suprotstavljeni[3] = prijavljeniKorisnici[3].id_korisnika;
            }
            else if (randomnumber == 2)
            {
              suprotstavljeni[2] = prijavljeniKorisnici[1].id_korisnika;
              suprotstavljeni[3] = prijavljeniKorisnici[3].id_korisnika;
            }
            else
            {
              suprotstavljeni[2] = prijavljeniKorisnici[1].id_korisnika;
              suprotstavljeni[3] = prijavljeniKorisnici[2].id_korisnika;
            }
            
            // Dodati u Mec - uzeti lastID.
            sql = `INSERT INTO Mec (vreme_pocetka, id_turnira) 
                   VALUES (?,?),(?,?)`;

            podaci = [turnir.datum_odigravanja, turnir.id_turnira, turnir.datum_odigravanja, turnir.id_turnira];

            osnovnaBaza.db.run(sql, podaci, function(err) 
            {
              if (err)
              {
                console.log(err.message);
                //res.status(404).send({errorMessage: "Operation failed."});
              }
              
              let idMeca01 = this.lastID - 1;
              let idMeca02 = this.lastID;

              sql = `INSERT INTO RezultatMeca (id_meca, id_korisnika, runda, pozicija) 
                     VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?),(?,?,?,?)`;

              podaci = 
              [
                idMeca01, suprotstavljeni[0], 1, 1,
                idMeca01, suprotstavljeni[1], 1, 2,
                idMeca02, suprotstavljeni[2], 1, 3,
                idMeca02, suprotstavljeni[3], 1, 4
              ];

              osnovnaBaza.db.run(sql, podaci, function(err)
              {
                if (err)
                {
                  console.log(err.message);
                  //res.status(404).send({errorMessage: "Operation failed."});
                }

                // Sada treba izmeniti stanje turnira u Active.
                IzmeniStanjeTurnira(turnir, 2);
                
                // Javiti svim ucesnicima kada turnir pocinje!
                IzvestiSveUcesnike(turnir, suprotstavljeni);

                // Zakazati odigravanje.
                // Gurnuti novi event.

                //===============================================================================
                var odigravanje = schedule.scheduleJob(turnir.datum_odigravanja, function(turnir)
                {
                  // Odigraj KUP.
                  // Upotpuniti podatke za sve meceve sa rezultatima.
                  // Upisati novo stanje turnira i pobednike.
                  // Generisati podatke u mongo bazi.

                  // Uzmi sve meceve prve runde.
                  let sql = `SELECT rm.id_meca, rm.id_korisnika 
                             FROM Mec m INNER JOIN RezultatMeca rm ON m.id_turnira = ? AND m.id_meca = rm.id_meca`;

                  let podaci = [turnir.id_turnira];
                  
                  osnovnaBaza.db.all(sql, podaci, function(err, rows) 
                  {
                    if (err)
                    {
                      console.log(err.message);
                      //res.status(404).send({errorMessage: "Operation failed."});
                    }
                    
                    let mec01 = new Mec();
                    mec01.id_meca = rows[0].id_meca;
                    mec01.id_korisnika = rows[0].id_korisnika;
                    mec01.id_korisnika2 = rows[1].id_korisnika;

                    let mec02 = new Mec();
                    mec02.id_meca = rows[2].id_meca;
                    mec02.id_korisnika = rows[2].id_korisnika;
                    mec02.id_korisnika2 = rows[3].id_korisnika;


                    let ishodi = [];
                    ishodi[0] = new Dot();
                    ishodi[0].Napravi(90, 60);
                    ishodi[1] = new Dot();
                    ishodi[1].Napravi(20, 100);

                    let brIgraca;

                    // Treba naci koliko igraca je potrebno za igru ovog turnira.
                    sql = `SELECT broj_igraca as br 
                           FROM Igra 
                           WHERE id_igre = ?`;

                    podaci = [turnir.id_igre];

                    osnovnaBaza.db.get(sql, podaci, function(err, row)
                    {
                      if (err)
                      {
                        console.log(err.message);
                        //res.status(404).send({errorMessage: "Operation failed."});
                      }

                      brIgraca = row.br;

                      // Sada mogu da napravim mongo_mec, za sve meceve.
                      // Odrediti pobednike.
                      let minimum = 0;
                      let maximum = 1;
                      let rnd = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                      mec01.ucinak = ishodi[rnd].x;
                      mec01.ucinak2 = ishodi[rnd].y;
                      mec01.mongo_mec = brIgraca + "|" + ishodi[rnd].x + "|" + ishodi[rnd].y;

                      rnd = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                      mec02.ucinak = ishodi[rnd].x;
                      mec02.ucinak2 = ishodi[rnd].y;
                      mec02.mongo_mec = brIgraca + "|" + ishodi[rnd].x + "|" + ishodi[rnd].y;

                      let mec03 = new Mec();

                      if (mec01.ucinak > mec01.ucinak2)
                      {
                        mec01.pobedio = 1;
                        mec01.pobedio2 = 0;
                        mec03.id_korisnika = mec01.id_korisnika;
                      }
                      else
                      {
                        mec01.pobedio = 0;
                        mec01.pobedio2 = 1;
                        mec03.id_korisnika = mec01.id_korisnika2;
                      }

                      if (mec02.ucinak > mec02.ucinak2)
                      {
                        mec02.pobedio = 1;
                        mec02.pobedio2 = 0;
                        mec03.id_korisnika2 = mec02.id_korisnika;
                      }
                      else
                      {
                        mec02.pobedio = 0;
                        mec02.pobedio2 = 1;
                        mec03.id_korisnika2 = mec02.id_korisnika2;
                      }

                      // Odrediti pobednika finala...
                      rnd = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                      mec03.ucinak = ishodi[rnd].x;
                      mec03.ucinak2 = ishodi[rnd].y;
                      mec03.mongo_mec = brIgraca + "|" + ishodi[rnd].x + "|" + ishodi[rnd].y;
                      mec03.runda = 2;

                      if (mec03.ucinak > mec03.ucinak2)
                      {
                        mec03.pobedio = 1;
                        mec03.pobedio2 = 0;
                      }
                      else
                      {
                        mec03.pobedio = 0;
                        mec03.pobedio2 = 1;
                      }

                      // Izmeniti stanje turnira, id_prvog i id_drugog.
                      sql = `UPDATE Turnir SET id_stanja = ?, id_prvog = ?, id_drugog = ? 
                             WHERE id_turnira = ?`;

                      podaci = [3];

                      if (mec03.pobedio == 1)
                      {
                        podaci.push(mec03.id_korisnika);
                        podaci.push(mec03.id_korisnika2);
                      }
                      else
                      {
                        podaci.push(mec03.id_korisnika2);
                        podaci.push(mec03.id_korisnika);
                      }

                      podaci.push(turnir.id_turnira);

                      osnovnaBaza.db.run(sql, podaci, function(err)
                      {
                        if (err)
                        {
                          console.log(err.message);
                        }

                        // Povecati rejtinge prvog i drugog.
                        PovecajRejting(podaci[1], 10);
                        PovecajRejting(podaci[2], 5);

                        // Sada treba uraditi update postojecih rezultata meca.
                        AzurirajMec(mec01);
                        AzurirajMec(mec02);
                        DodajMec(mec03, turnir);

                        // Izvestiti sve korisnike o rezultatima.
                        GotovTurnir(turnir);
                      });
                    });
                  });
                }.bind(null, turnir));
              });
            });
            
          }
          // LIGA:
          else if (turnir.id_tipa_turnira == 2)
          {
            let suprotstavljeni = [];
            
            suprotstavljeni[0] = new Par();
            suprotstavljeni[0].Napravi(prijavljeniKorisnici[0].id_korisnika, prijavljeniKorisnici[1].id_korisnika);

            suprotstavljeni[1] = new Par();
            suprotstavljeni[1].Napravi(prijavljeniKorisnici[2].id_korisnika, prijavljeniKorisnici[3].id_korisnika);

            suprotstavljeni[2] = new Par();
            suprotstavljeni[2].Napravi(prijavljeniKorisnici[0].id_korisnika, prijavljeniKorisnici[2].id_korisnika);

            suprotstavljeni[3] = new Par();
            suprotstavljeni[3].Napravi(prijavljeniKorisnici[1].id_korisnika, prijavljeniKorisnici[3].id_korisnika);

            suprotstavljeni[4] = new Par();
            suprotstavljeni[4].Napravi(prijavljeniKorisnici[0].id_korisnika, prijavljeniKorisnici[3].id_korisnika);

            suprotstavljeni[5] = new Par();
            suprotstavljeni[5].Napravi(prijavljeniKorisnici[1].id_korisnika, prijavljeniKorisnici[2].id_korisnika);


            sql = `INSERT INTO Mec (vreme_pocetka, id_turnira) 
                   VALUES (?,?),(?,?),(?,?),(?,?),(?,?),(?,?)`;

            podaci = 
            [
              turnir.datum_odigravanja, turnir.id_turnira, 
              turnir.datum_odigravanja, turnir.id_turnira,
              turnir.datum_odigravanja, turnir.id_turnira,
              turnir.datum_odigravanja, turnir.id_turnira, 
              turnir.datum_odigravanja, turnir.id_turnira,
              turnir.datum_odigravanja, turnir.id_turnira,
            ];
            
            osnovnaBaza.db.run(sql, podaci, function(err)
            {
              if (err)
              {
                return console.log(err.message);
              }
              
              suprotstavljeni[0].id_meca = this.lastID - 5;
              suprotstavljeni[1].id_meca = this.lastID - 4;
              suprotstavljeni[2].id_meca = this.lastID - 3;
              suprotstavljeni[3].id_meca = this.lastID - 2;
              suprotstavljeni[4].id_meca = this.lastID - 1;
              suprotstavljeni[5].id_meca = this.lastID;
    
              sql = `INSERT INTO RezultatMeca (id_meca, id_korisnika, runda) 
                     VALUES (?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),
                            (?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?),(?,?,?)`;

              podaci = 
              [
                suprotstavljeni[0].id_meca, suprotstavljeni[0].id_korisnika1, 1,
                suprotstavljeni[0].id_meca, suprotstavljeni[0].id_korisnika2, 1,
                suprotstavljeni[1].id_meca, suprotstavljeni[1].id_korisnika1, 1,
                suprotstavljeni[1].id_meca, suprotstavljeni[1].id_korisnika2, 1,
                suprotstavljeni[2].id_meca, suprotstavljeni[2].id_korisnika1, 2,
                suprotstavljeni[2].id_meca, suprotstavljeni[2].id_korisnika2, 2,
                suprotstavljeni[3].id_meca, suprotstavljeni[3].id_korisnika1, 2,
                suprotstavljeni[3].id_meca, suprotstavljeni[3].id_korisnika2, 2,
                suprotstavljeni[4].id_meca, suprotstavljeni[4].id_korisnika1, 3,
                suprotstavljeni[4].id_meca, suprotstavljeni[4].id_korisnika2, 3,
                suprotstavljeni[5].id_meca, suprotstavljeni[5].id_korisnika1, 3,
                suprotstavljeni[5].id_meca, suprotstavljeni[5].id_korisnika2, 3,
              ];

              osnovnaBaza.db.run(sql, podaci, function(err)
              {
                if (err)
                {
                  return console.log(err.message);
                }

                // Sada treba izmeniti stanje turnira u Active.
                IzmeniStanjeTurnira(turnir, 2);
                
                // Javiti svim ucesnicima kada turnir pocinje!
                let listaKorisnika = [];
                for (let i = 0 ; i < prijavljeniKorisnici.length ; i++)
                  listaKorisnika.push(prijavljeniKorisnici[i].id_korisnika);


                IzvestiSveUcesnike(turnir, listaKorisnika);

                // Zakazati odigravanje.
                // Gurnuti novi event.

                //===============================================================================
                var odigravanje = schedule.scheduleJob(turnir.datum_odigravanja, function(turnir)
                {
                  // Odigraj LIGU.

                  // Ovde samo update.
                  // Potrebno je odigrati za sve meceve.
                  // Koji su to mecevi?

                  let sql = `SELECT rm.id_meca, rm.id_korisnika 
                             FROM Mec m INNER JOIN RezultatMeca rm ON m.id_turnira = ? AND m.id_meca = rm.id_meca`;

                  let podaci = [turnir.id_turnira];
                  
                  osnovnaBaza.db.all(sql, podaci, function(err, rows)
                  {
                    if (err)
                    {
                      console.log(err.message);
                      //res.status(404).send({errorMessage: "Operation failed."});
                    }

                    // Niz meceva.
                    let mecevi = [];

                    let k = 0;

                    for (let i = 0 ; i < rows.length ; i+=2)
                    {
                      mecevi[k] = new Mec();
                      mecevi[k].id_meca = rows[i].id_meca;
                      mecevi[k].id_korisnika = rows[i].id_korisnika;
                      mecevi[k].id_korisnika2 = rows[i+1].id_korisnika;

                      k++;
                    }

                    // Niz korisnika.
                    let tabela = [];
                    tabela[0] = new Tabela();
                    tabela[0].id_korisnika = rows[0].id_korisnika;
                    tabela[0].broj_pobeda = 0;

                    for (let i = 1 ; i < rows.length / 2 ; i++)
                    {
                      if (tabela.findIndex(x => x.id_korisnika == rows[i].id_korisnika) == -1)
                      {
                        let t = new Tabela();
                        t.id_korisnika = rows[i].id_korisnika;
                        t.broj_pobeda = 0;

                        tabela.push(t);
                      }
                    }

                    let ishodi = [];
                    ishodi[0] = new Dot();
                    ishodi[0].Napravi(90, 60);
                    ishodi[1] = new Dot();
                    ishodi[1].Napravi(20, 100);
                    ishodi[2] = new Dot();
                    ishodi[2].Napravi(50, 50);


                    // Treba naci koliko igraca je potrebno za igru ovog turnira.
                    sql = `SELECT broj_igraca as br 
                           FROM Igra 
                           WHERE id_igre = ?`;

                    podaci = [turnir.id_igre];

                    osnovnaBaza.db.get(sql, podaci, function(err, row)
                    {
                      if (err)
                      {
                        console.log(err.message);
                        //res.status(404).send({errorMessage: "Operation failed."});
                      }

                      let brIgraca = row.br;
                      let minimum = 0;
                      let maximum = 2;

                      let rnd;
                      for (let i = 0 ;  i < mecevi.length ; i++)
                      {
                        rnd = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                        mecevi[i].ucinak = ishodi[rnd].x;
                        mecevi[i].ucinak2 = ishodi[rnd].y;
                        mecevi[i].mongo_mec = brIgraca + "|" + ishodi[rnd].x + "|" + ishodi[rnd].y;

                        if (mecevi[i].ucinak > mecevi[i].ucinak2)
                        {
                          mecevi[i].pobedio = 1;
                          mecevi[i].pobedio2 = 0;
                          
                          let ind = tabela.findIndex(x => x.id_korisnika == mecevi[i].id_korisnika);
                          tabela[ind].broj_pobeda += 3;
                        }
                        else if (mecevi[i].ucinak < mecevi[i].ucinak2)
                        {
                          mecevi[i].pobedio = 0;
                          mecevi[i].pobedio2 = 1;

                          let ind = tabela.findIndex(x => x.id_korisnika == mecevi[i].id_korisnika2);
                          tabela[ind].broj_pobeda += 3;
                        }
                        else
                        {
                          mecevi[i].pobedio = 0;
                          mecevi[i].pobedio = 0;

                          let ind = tabela.findIndex(x => x.id_korisnika == mecevi[i].id_korisnika);
                          tabela[ind].broj_pobeda++;

                          ind = tabela.findIndex(x => x.id_korisnika == mecevi[i].id_korisnika2);
                          tabela[ind].broj_pobeda++;
                        }
                      }

                      // Izmeniti stanje turnira, id_prvog i id_drugog.
                      // Naci prva dva najbolja korisnika... Sortiraj niz.

                      tabela.sort(function(a, b) { return (b.broj_pobeda - a.broj_pobeda); });

                      // Izmeniti stanje turnira, id_prvog i id_drugog.
                      sql = `UPDATE Turnir SET id_stanja = ?, id_prvog = ?, id_drugog = ? 
                             WHERE id_turnira = ?`;

                      podaci = [3, tabela[0].id_korisnika, tabela[1].id_korisnika, turnir.id_turnira];

                      osnovnaBaza.db.run(sql, podaci, function(err)
                      {
                        if (err)
                        {
                          console.log(err.message);
                          //res.status(404).send({errorMessage: "Operation failed."});
                        }

                        // Povecati rejtinge prvog i drugog.
                        PovecajRejting(podaci[1], 10);
                        PovecajRejting(podaci[2], 5);

                        // Sada treba uraditi update postojecih rezultata meca.
                        for (let i=0 ; i<mecevi.length ; i++)
                          AzurirajMec(mecevi[i]);

                        // Izvestiti sve korisnike o rezultatima.
                        GotovTurnir(turnir);
                      });
                    });
                  });
                }.bind(null, turnir));
              });
            });
          }
        }
        else
          console.log("Nema dovoljno prijavljenih korisnika na turniru: " + turnir.id_turnira);
      }
    });
  }.bind(null, turnir));
}



//------------- Pomocne funkcije -------------

function IzmeniStanjeTurnira(turnir, stanje)
{
  let sql = `UPDATE Turnir 
             SET id_stanja = ? 
             WHERE id_turnira = ?`;

  let podaci = [stanje, turnir.id_turnira];

  osnovnaBaza.db.run(sql, podaci, function(err)
  {
    if (err)
    {
      console.log(err.message);
      return;
    }
  });
}


function IzvestiSveUcesnike(turnir, ucesnici)
{
  // Treba da pokupim email-ove na osnovu id-eva korisnika.
  
  let sql = `SELECT * 
             FROM Korisnik 
             WHERE id_korisnika = ? `;

  let n = ucesnici.length;
  for (let i=1 ; i<n ; i++)
    sql += `OR id_korisnika = ? `;

  osnovnaBaza.db.all(sql, ucesnici, function(err,rows)
  {
    if (err)
    {
      console.log(err.message);
      return;
    }

    // U rows imam objekte korisnika, sa njihovim email-ovima.
    // Sada pravim sadrzaj poruke, i saljem korisnicima.
    let emails = "";
    emails += rows[0].email;
    for (let i=1 ; i<rows.length ; i++)
      emails += ", " + rows[i].email;

    let dat = turnir.datum_odigravanja + "";
    let poruka = 
    `
    <h1>`+ turnir.naziv_turnira +` tournament is close!</h1>
    <hr>
    <p>You have signed up for participation in this tournament. The entry period has ended and all other participants are set and ready!</p>
    <p>We are happy to announce that tournament will be held on:</p>
    <h4 style='text-align: center;'>`+ dat.replace(/T/, ' ').replace(/\..+/, '') +`</h4><br>
    <p>Be sure to check out our site for more information:</p>
    <p><a href='http://147.91.204.116:11022'>OLIMIJADA</a></p>
    `;

    var mailOptions = 
    {
      from: 'purelogicgames@gmail.com',
      to: emails,
      subject: 'Olimijada - Tournament play time',
      html: poruka
    };
    
    transporter.sendMail(mailOptions, function(error, info)
    {
      if (error) 
      {
        console.log(error);
      } 
      /*
      else 
      {
        console.log('Email sent: ' + info.response);
      }
      */
    });

  });
}


function PovecajRejting(id_korisnika, rate)
{
  let sql = `UPDATE Korisnik SET rejting = rejting + ? 
             WHERE id_korisnika = ?`;

  let podaci = [rate, id_korisnika];

  osnovnaBaza.db.run(sql, podaci, function(err)
  {
    if (err)
    {
      console.log(err.message);
    }
  });
}


function AzurirajMec(mec)
{
  // Azuriranje RezultataMeca.

  let sql = `UPDATE RezultatMeca SET ucinak = ?, pobedio = ? 
             WHERE id_meca = ? AND id_korisnika = ?`;

  let podaci = [mec.ucinak, mec.pobedio, mec.id_meca, mec.id_korisnika];

  osnovnaBaza.db.run(sql, podaci, function(err)
  {
    if (err)
    {
      return console.log(err.message);
    }

    podaci = [mec.ucinak2, mec.pobedio2, mec.id_meca, mec.id_korisnika2];

    osnovnaBaza.db.run(sql, podaci, function(err)
    {
      if (err)
      {
        return console.log(err.message);
      }

      // Azuriranje Meca.
      sql = `UPDATE Mec SET mongo_mec = ? 
             WHERE id_meca = ?`;

      podaci = [mec.mongo_mec, mec.id_meca];

      osnovnaBaza.db.run(sql, podaci, function(err)
      {
        if (err)
        {
          return console.log(err.message);
        }
      });
    });
  });
}


function DodajMec(mec, turnir)
{
  // Dodavanje u Mec.

  let sql = `INSERT INTO Mec(vreme_pocetka, id_turnira, mongo_mec) VALUES(?,?,?)`;
  let podaci = [turnir.datum_odigravanja, turnir.id_turnira, mec.mongo_mec];

  osnovnaBaza.db.run(sql, podaci, function(err)
  { 
    if (err)
    {
      return console.log(err.message);
    }

    mec.id_meca = this.lastID;

    // Dodavanje u RezultatMeca.

    sql = `INSERT INTO RezultatMeca(id_meca, id_korisnika, ucinak, pobedio, runda, pozicija) VALUES (?,?,?,?,?,?),(?,?,?,?,?,?)`;
    podaci = 
    [
      mec.id_meca, mec.id_korisnika, mec.ucinak, mec.pobedio, mec.runda, 1,
      mec.id_meca, mec.id_korisnika2, mec.ucinak2, mec.pobedio2, mec.runda, 2
    ];

    osnovnaBaza.db.run(sql, podaci, function(err)
    {
      if (err)
      {
        return console.log(err.message);
      }
    });
  });
}


function GotovTurnir(turnir)
{
  let sql = `SELECT DISTINCT k.id_korisnika, k.email 
             FROM Igrac igr INNER JOIN Korisnik k ON igr.id_korisnika = k.id_korisnika 
             WHERE igr.id_turnira = ?`;
    
  let podaci = [turnir.id_turnira];               
            
  osnovnaBaza.db.all(sql, podaci, function(err, rows)
  {
    if (err)
    {
      return console.log(err.message);
    }

    let emails = "";
    emails += rows[0].email;
    for (let i=1 ; i<rows.length ; i++)
      emails += ", " + rows[i].email;

    let poruka = 
    `
    <h1>`+ turnir.naziv_turnira +` tournament is over!</h1>
    <hr>
    <p>You have successfully participated in this tournament. The results and matches can be seen on our site.</p>
    <p>Be sure to check out our site for more information:</p>
    <p><a href='http://147.91.204.116:11022'>OLIMIJADA</a></p>
    `;

    var mailOptions = 
    {
      from: 'purelogicgames@gmail.com',
      to: emails,
      subject: 'Olimijada - Finished tournament',
      html: poruka
    };
    
    transporter.sendMail(mailOptions, function(error, info)
    {
      if (error) 
      {
        console.log(error);
      } 
      /*
      else 
      {
        console.log('Email sent: ' + info.response);
      }
      */
    });
  });
}


module.exports = router;