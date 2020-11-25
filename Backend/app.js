var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var app = express();
var schedule = require('node-schedule');

app.use(express.static(path.join(__dirname, 'public')));

var whitelist = ['http://localhost:4200','http://147.91.204.116:11022','http://147.91.204.116:11023']
var corsOptions = 
{
  origin: function (origin, callback) 
  {
    if (whitelist.indexOf(origin) !== -1) 
    {
      callback(null, true)
    } 
    else 
    {
      callback(new Error('Access denied!'))
    }
  }
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/*
app.use(function (req, res, next) 
{        
  res.setHeader('Access-Control-Allow-Origin', '*');   
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');      
  res.setHeader('Access-Control-Allow-Credentials', true);     
  next();  
});
*/

//----------------------- RUTE ----------------------------

var nadjiIgru = require('./routes/nadjiIgru');
app.use('/nadjiIgru', nadjiIgru);

var prijava = require('./routes/prijava');
app.use('/prijava', prijava);

var registracija = require('./routes/registracija');
app.use('/registracija', registracija);

var izlistajIgre = require('./routes/izlistajIgre');
app.use('/igre', izlistajIgre);

var dodajIgru = require('./routes/dodajIgru');
app.use('/dodajIgru', dodajIgru);

var izlistajKorisnike = require('./routes/izlistajKorisnike');
app.use('/izlistajKorisnike', izlistajKorisnike);

var nadjiKorisnika = require('./routes/nadjiKorisnika');
app.use('/nadjiKorisnika', nadjiKorisnika);

var botovi = require('./routes/botovi');
app.use('/botovi', botovi);

var izmeniIgru = require('./routes/izmeniIgru');
app.use('/izmeniIgru', izmeniIgru);

var turnir = require('./routes/turniri');
app.use('/turniri', turnir);

var izmenaProfila = require('./routes/izmenaProfila');
app.use('/izmenaProfila', izmenaProfila);

var igraci = require('./routes/igraci');
app.use('/igraci',igraci);

var dodajTurnir = require('./routes/dodajTurnir');
app.use('/dodajTurnir', dodajTurnir);

var dodavanjeIgraca = require('./routes/dodavanjeIgraca');
app.use('/dodavanjeIgraca',dodavanjeIgraca);

var pregledTurnira = require('./routes/pregledTurnira');
app.use('/pregledTurnira', pregledTurnira);

var analiza = require('./routes/analiza');
app.use('/analiza', analiza);

var obradaPrijava = require('./routes/obradaPrijava');
app.use('/obradaPrijava', obradaPrijava);

var pocetna = require('./routes/pocetna');
app.use('/pocetna', pocetna);

//var mecevi = require('./routes/mecevi');
//app.use('/mecevi', mecevi);

var check = require('./routes/check');
app.use('/check', check);





/*
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

var usersRouter = require('./routes/users');
app.use('/users', usersRouter);
*/

//------------------------------------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) 
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;