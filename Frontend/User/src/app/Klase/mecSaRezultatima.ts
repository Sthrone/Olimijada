export class mecSaRezultatima
{
    public id_meca:number;
    public korisnicko_ime1:string;
    public korisnicko_ime2: string;
    public id_korisnika1: number;
    public id_korisnika2: number;
    public ucinak1: any;
    public ucinak2: any;
    public runda:number;
    public avatar1:string;
    public avatar2:string;
    public vreme_pocetka: Date;

    public static FromJson(objekat:any):mecSaRezultatima
    {
        let turnir = new mecSaRezultatima();

        turnir.id_meca= objekat.id_meca;
        turnir.korisnicko_ime1 = objekat.korisnicko_ime1;
        turnir.korisnicko_ime2 = objekat.korisnicko_ime2;
        turnir.id_korisnika1 = objekat.id_korisnika1;
        turnir.id_korisnika2 = objekat.id_korisnika2;
        turnir.ucinak1 = objekat.ucinak1;
        turnir.ucinak2 = objekat.ucinak2
        turnir.runda = objekat.runda;
        turnir.avatar1 = objekat.avatar1;
        turnir.avatar2 = objekat.avatar2;
        turnir.vreme_pocetka = objekat.vreme_pocetka;

        return turnir;
    }

    public static FromJsonToArray(objekat:any): mecSaRezultatima[]
    {
        let n = objekat.length;
        let turniri: mecSaRezultatima[] = []; 

        for(let i=0 ; i<n ; i++)
        {
            turniri.push(this.FromJson(objekat[i]));
        }

        return turniri;
    }

    toString()
    {
        return `${this.korisnicko_ime1} | ${this.korisnicko_ime2} | ${this.id_korisnika1} | ${this.id_korisnika2} | ${this.ucinak1} | ${this.ucinak2}`;
    }
}