var mongo = require("mongoose");

var mdb = mongo.connect("mongodb://localhost:27017/local", function(err, response)
{  
   if (err)
        console.log(err);  
   else
       console.log('MongoDB connected.'); 
});

var Schema = mongo.Schema;

var MecSchema = new Schema
({
    id_meca: String,
    id_igraca: Number,
    koordinate: [{x: Number, y: Number}],
    rezultati: [Number]
});

var Mec = mongo.model('local', MecSchema, 'Mec');

module.exports.Mec = Mec;