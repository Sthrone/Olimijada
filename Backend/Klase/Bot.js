class Bot
{
    constructor()
    {
        this.id_bota = '';
        this.id_igre = '';
        this.id_korisnika = '';
        this.id_tipa_bota = '';
        this.naziv_tipa_bota = '';
        this.putanja_do_fajla = '';
    }

    toString()
    {
        return `${this.id_bota} | ${this.id_igre} | ${this.id_korisnika} | ${this.id_tipa_bota} | ${this.naziv_tipa_bota} | ${this.putanja_do_fajla}`;
    }

    Print()
    {
        console.log(this.toString());
    }
}

module.exports = Bot;