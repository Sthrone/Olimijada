class TipBota
{
    constructor()
    {
        this.id_tipa_bota = '';
        this.naziv_tipa_bota = '';
        this.id_igre = '';
    }

    toString()
    {
        return `${this.id_tipa_bota} | ${this.naziv_tipa_bota} | ${this.id_igre}`;
    }

    Print()
    {
        console.log(this.toString());
    }
}

module.exports = TipBota;