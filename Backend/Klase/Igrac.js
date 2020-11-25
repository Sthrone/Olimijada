class Igrac {
    constructor() {
        this.id_igraca="";
        this.naziv_igraca="";
        this.id_bota="";
        this.id_korisnika="";
        this.slika_igraca="";
        this.korisnicko_ime="";
        this.rejting="";
        this.organizacija="";
        this.drzava="";
    }

    NapraviBezIDa(naziv_igraca, id_bota, id_korisnika,slika_igraca,korisnicko_ime,rejting,drzava,organizacija) {

        this.naziv_igraca=naziv_igraca;
        this.id_bota=id_bota;
        this.id_korisnika=id_korisnika;
        this.slika_igraca=slika_igraca;
        this.korisnicko_ime=korisnicko_ime;
        this.rejting=rejting;
        this.organizacija=organizacija;
        this.drzava=drzava;
    }

    NapraviSaIDom(id_igraca, naziv_igraca, id_bota, id_korisnika,slika_igraca,korisnicko_ime,rejting,drzava,organizacija) {
        this.id_igraca=id_igraca;
        this.naziv_igraca=naziv_igraca;
        this.id_bota=id_bota;
        this.id_korisnika=id_korisnika;
        this.slika_igraca=slika_igraca;
        this.korisnicko_ime=korisnicko_ime;
        this.rejting=rejting;
        this.organizacija=organizacija;
        this.drzava=drzava;
    }

    toString() {
        return `${this.id_igraca} | ${this.naziv_igraca} | ${this.id_bota} | ${this.id_korisnika} | ${this.slika_igraca}`;
    }

    Print() {
        console.log(this.toString());
    }
}

module.exports = Igrac;