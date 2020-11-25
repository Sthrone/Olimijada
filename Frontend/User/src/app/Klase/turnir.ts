export class Turnir
{
    public id_turnira:number;
    public datum_pocetka_prijave:Date;
    public datum_kraja_prijave:Date;
    public id_tipa_turnira:number;
    public id_igre:number;
    public broj_ucesnika:number;
    public naziv_tipa_turnira:string;
    public naziv_turnira:string;
    public datum_odigravanja:Date;
    public naziv_stanja:string;
    public broj_prijavljenih: number;


    public static FromJson(objekat:any):Turnir
    {
        let turnir = new Turnir();

        turnir.id_turnira = objekat.id_turnira;
        turnir.datum_pocetka_prijave = objekat.datum_pocetka_prijave;
        turnir.datum_kraja_prijave = objekat.datum_kraja_prijave;
        turnir.id_tipa_turnira = objekat.id_tipa_turnira;
        turnir.id_igre = objekat.id_igre;
        turnir.broj_ucesnika = objekat.broj_ucesnika
        turnir.naziv_tipa_turnira=objekat.naziv_tipa_turnira;
        turnir.naziv_turnira=objekat.naziv_turnira;
        turnir.datum_odigravanja=objekat.datum_odigravanja;
        turnir.naziv_stanja=objekat.naziv_stanja;
        turnir.broj_prijavljenih = 0;  //broj prijavljenih korisnika za turnir

        return turnir;
    }

    public static FromJsonToArray(objekat:any): Turnir[]
    {
        let n = objekat.length;
        let turniri: Turnir[] = []; 

        for(let i=0 ; i<n ; i++)
        {
            turniri.push(this.FromJson(objekat[i]));
        }

        return turniri;
    }

    toString()
    {
        return `${this.id_turnira} | ${this.datum_pocetka_prijave} | ${this.datum_kraja_prijave} | ${this.id_tipa_turnira} | ${this.id_igre} | ${this.broj_ucesnika}`;
    }
}