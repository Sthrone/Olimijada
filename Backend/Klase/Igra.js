class Igra
{
    constructor()
    {
        this.id_igre = '';
        this.naziv_igre = '';
        this.broj_igraca = '';
        this.pravila_igre_srb = '';
        this.pravila_igre_en = '';
        this.putanja_do_fajla = '';
        this.trajanje_u_sekundama = '';
        this.id_tipa_igre = '';
        this.slika_igre = '';
        this.naziv_tipa_igre = '';
        this.kratak_opis_srb = '';
        this.kratak_opis_en = '';
        this.slika_pozadine_igre='';
    }

    NapraviBezId (nazivIgre, brojIgraca, pravilaIgre_en, pravila_igre_srb, putanjaDoFajla, trajanjeUSekundama, idTipaIgre, slikaIgre, naziv_tipa_igre,kratak_opis_srb, kratak_opis_en,slikaPozadineIgre)
    {
        this.naziv_igre = nazivIgre;
        this.broj_igraca = brojIgraca;
        this.pravila_igre_en = pravilaIgre_en;
        this.pravila_igre_srb = pravilaIgre_srb;
        this.putanja_do_fajla = putanjaDoFajla;
        this.trajanje_u_sekundama = trajanjeUSekundama;
        this.id_tipa_igre = idTipaIgre;
        this.slika_igre = slikaIgre;
        this.naziv_tipa_igre = naziv_tipa_igre;
        this.kratak_opis_srb = kratak_opis_srb;
        this.kratak_opis_en = kratak_opis_en;
        this.slika_pozadine_igre=slikaPozadineIgre;
    }
    
    NapraviSaId (idIgre, nazivIgre, brojIgraca, pravilaIgre_en, pravila_igre_srb, putanjaDoFajla, trajanjeUSekundama, idTipaIgre, slikaIgre, naziv_tipa_igre,kratak_opis_srb, kratak_opis_en, slikaPozadineIgre)
    {
        this.id_igre = idIgre;
        this.naziv_igre = nazivIgre;
        this.broj_igraca = brojIgraca;
        this.pravila_igre_en = pravilaIgre_en;
        this.pravila_igre_srb = pravilaIgre_srb;
        this.putanja_do_fajla = putanjaDoFajla;
        this.trajanje_u_sekundama = trajanjeUSekundama;
        this.id_tipa_igre = idTipaIgre;
        this.slika_igre = slikaIgre;
        this.naziv_tipa_igre = naziv_tipa_igre;
        this.kratak_opis_srb = kratak_opis_srb;
        this.kratak_opis_en = kratak_opis_en;
        this.slika_pozadine_igre=slikaPozadineIgre;
    }
    
    toString()
    {
        return `${this.naziv_igre} | ${this.broj_igraca} | ${this.trajanje_u_sekundama} | ${this.id_tipa_igre} | ${this.naziv_tipa_igre}
               | ${this.putanja_do_fajla} | ${this.pravila_igre} | ${this.slika_igre} | ${this.kratak_opis}}`;
    }

    Print()
    {
        console.log(this.toString());
    }
}

module.exports = Igra;