class Turnir
{
    constructor()
    {
       this.id_turnira = ''; 
       this.datum_pocetka_prijave = '';
       this.datum_kraja_prijave = '';
       this.id_tipa_turnira = '';
       this.id_igre = '';
       this.broj_ucesnika = '';
       this.naziv_tipa_turnira='';
       this.naziv_turnira='';
       this.datum_odigravanja='';
       this.naziv_stanja='';
    }

    NapraviBezIDa(datum_pocetka_prijave, datum_kraja_prijave, id_tipa_turnira, id_igre, broj_ucesnika,naziv_tipa_turnira,naziv_turnira,datum_odigravanja,naziv_stanja)
    {
        this.datum_pocetka_prijave = datum_pocetka_prijave;
        this.datum_kraja_prijave = datum_kraja_prijave;
        this.id_tipa_turnira = id_tipa_turnira;
        this.id_igre = id_igre;
        this.broj_ucesnika = broj_ucesnika;
        this.naziv_tipa_turnira=naziv_tipa_turnira;
        this.naziv_turnira=naziv_turnira;
        this.datum_odigravanja=datum_odigravanja;
        this.naziv_stanja_turnira=naziv_stanja;
    }

    NapraviSaIDom(id_turnira, datum_pocetka_prijave, datum_kraja_prijave, id_tipa_turnira, id_igre, broj_ucesnika,naziv_stanja)
    {
        this.id_turnira = id_turnira;
        this.datum_pocetka_prijave = datum_pocetka_prijave;
        this.datum_kraja_prijave = datum_kraja_prijave;
        this.id_tipa_turnira = id_tipa_turnira;
        this.id_igre = id_igre;
        this.broj_ucesnika = broj_ucesnika;
        this.naziv_tipa_turnira=naziv_tipa_turnira;
        this.naziv_turnira=naziv_turnira;
        this.datum_odigravanja=datum_odigravanja;
        this.naziv_stanja_turnira=naziv_stanja;
    }

    toString()
    {
        return `${this.id_turnira} | ${this.datum_pocetka_prijave} | ${this.datum_kraja_prijave}  | ${this.id_tipa_turnira} | ${this.id_igre} | ${this.broj_ucesnika}`;
    }

    Print()
    {
        console.log(this.toString());
    }
}

module.exports = Turnir;