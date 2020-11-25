class Tabela
{
    constructor()
    {
        this.id_korisnika = '';
        this.korisnicko_ime = '';
        this.broj_pobeda="";
        this.broj_poraza="";
        this.broj_neresenih="";
        this.id_turnira="";
    }

    NapraviBezIDa(korisnickoIme, broj_pobeda, broj_poraza, broj_neresenih, id_turnira)
    {
        
        this.korisnicko_ime = this.korisnickoIme;
        this.broj_pobeda=broj_pobeda;
        this.broj_poraza=broj_poraza;
        this.broj_neresenih=broj_neresenih;
        this.id_turnira=id_turnira;
    }
    
    NapraviSaIDom(idKorisnika, korisnickoIme, broj_pobeda, broj_poraza, broj_neresenih, id_turnira)
    {
        this.id_korisnika = idKorisnika;
        this.korisnicko_ime = korisnickoIme;
        this.broj_pobeda=broj_pobeda;
        this.broj_poraza=broj_poraza;
        this.broj_neresenih=broj_neresenih;
        this.id_turnira=id_turnira;
    }

    toString()
    {
        return `${this.id_korisnika} | ${this.korisnicko_ime} | ${this.broj_pobeda}  | ${this.broj_poraza} | ${this.broj_neresenih} | ${this.id_turnira} `;
    }

    Print()
    {
        console.log(this.toString());
    }
}

module.exports = Tabela;