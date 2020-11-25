class Korisnik
{
    constructor()
    {
        this.id_korisnika = '';
        this.korisnicko_ime = '';
        this.lozinka = '';
        this.email = '';
        this.avatar = '';
        this.odgovor = '';
        this.id_tipa_korisnika = '';
        this.drzava = '';
        this.organizacija = '';
        this.rejting = '';
        this.ban = '';
    }

    NapraviBezIDa(korisnickoIme, lozinka, email, avatar, odgovor, idTipaKorisnika,drzava,organizacija,rejting)
    {
        this.korisnicko_ime = korisnickoIme;
        this.lozinka = lozinka;
        this.email = email;
        this.avatar = avatar;
        this.odgovor = odgovor;
        this.id_tipa_korisnika = idTipaKorisnika;
        this.drzava=drzava;
        this.organizacija=organizacija;
        this.rejting=rejting;
    }
    
    NapraviSaIDom(idKorisnika, korisnickoIme, lozinka, email, avatar, odgovor, idTipaKorisnika,drzava,organizacija,rejting)
    {
        this.id_korisnika = idKorisnika;
        this.korisnicko_ime = korisnickoIme;
        this.lozinka = lozinka;
        this.email = email;
        this.avatar = avatar;
        this.odgovor = odgovor;
        this.id_tipa_korisnika = idTipaKorisnika;
        this.drzava=drzava;
        this.organizacija=organizacija;
        this.rejting=rejting;
    }

    NapraviSve(idKorisnika, korisnickoIme, lozinka, email, avatar, odgovor, idTipaKorisnika, drzava, organizacija, rejting, ban)
    {
        this.id_korisnika = idKorisnika;
        this.korisnicko_ime = korisnickoIme;
        this.lozinka = lozinka;
        this.email = email;
        this.avatar = avatar;
        this.odgovor = odgovor;
        this.id_tipa_korisnika = idTipaKorisnika;
        this.drzava = drzava;
        this.organizacija = organizacija;
        this.rejting = rejting;
        this.ban = ban;
    }

    toString()
    {
        return `${this.id_korisnika} | ${this.korisnicko_ime} | ${this.lozinka}  | ${this.email} | ${this.avatar} | ${this.odgovor} | ${this.id_tipa_korisnika}`;
    }

    Print()
    {
        console.log(this.toString());
    }
}

module.exports = Korisnik;