class Mec
{
    
    constructor()
    {
        this.id_meca = "";
        this.id_korisnika = "";
        this.id_korisnika2 = "";
        this.ucinak = "";
        this.ucinak2 = "";
        this.pobedio = "";
        this.pobedio2 = "";
        this.runda = "";
        this.pozicija = "";
        this.pozicija2 = "";
        this.mongo_mec = "";
    }

    NapraviBezIDa(idKorisnika, idKorisnika2, ucinak, ucinak2, pobedio,pobedio2,runda,pozicija,pozicija2)
    {
        //this.id_meca="";
        this.id_korisnika=idKorisnika;
        this.id_korisnika2=idKorisnika2;
        this.ucinak=ucinak;
        this.ucinak2=ucinak2;
        this.pobedio=pobedio;
        this.pobedio2=pobedio2;
        this.runda=runda;
        this.pozicija=pozicija;
        this.pozicija2=pozicija2;
    }
    
    NapraviSaIDom(idMeca, idKorisnika, idKorisnika2, ucinak, ucinak2, pobedio,pobedio2,runda,pozicija,pozicija2)
    {
       this.id_meca=idMeca;
       this.id_korisnika=idKorisnika;
       this.id_korisnika2=idKorisnika2;
       this.ucinak=ucinak;
       this.ucinak2=ucinak2;
       this.pobedio=pobedio;
       this.pobedio2=pobedio2;
       this.runda=runda;
       this.pozicija=pozicija;
       this.pozicija2=pozicija2;
    }

    toString()
    {
        return `${this.id_meca} | ${this.id_korisnika} | ${this.id_korisnika2}  | ${this.ucinak} | ${this.ucinak2} | ${this.pobedio} | ${this.pobedio2} | ${this.runda} | ${this.pozicija} | ${this.pozicija2}`;
    }

    Print()
    {
        console.log(this.toString());
    }
    
}

module.exports = Mec;