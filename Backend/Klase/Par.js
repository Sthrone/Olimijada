class Par
{
    constructor()
    {
        this.id_meca = '';
        this.id_korisnika1 = '';
        this.id_korisnika2 = '';
    }

    Napravi(id_korisnika1, id_korisnika2)
    {
        this.id_korisnika1 = id_korisnika1;
        this.id_korisnika2 = id_korisnika2;
    }

}


module.exports = Par;