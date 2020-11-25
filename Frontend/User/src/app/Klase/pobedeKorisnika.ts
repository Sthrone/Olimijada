export class PobedeKorisnika
{
    


    public id_korisnika:number;
    public korisnicko_ime:string;
    public broj_pobeda:number;
    public avatar:string;
    public broj_poraza:number;

    public static FromJson(objekat:any):PobedeKorisnika
    {
        let protivnik = new PobedeKorisnika();

        
        protivnik.id_korisnika = objekat.id_korisnika;
        protivnik.korisnicko_ime = objekat.korisnicko_ime;
        protivnik.broj_pobeda = objekat.broj_pobeda;
        protivnik.avatar= objekat.avatar;
        protivnik.broj_poraza=0;
        return protivnik;
    }

    public static FromJsonToArray(objekat:any): PobedeKorisnika[]
    {
        let n = objekat.length;
        let protivnici: PobedeKorisnika[] = []; 

        for(let i=0 ; i<n ; i++)
        {
            protivnici.push(this.FromJson(objekat[i]));
        }

        return protivnici;
    }

    toString()
    {
        return `${this.id_korisnika} | ${this.korisnicko_ime} | ${this.broj_pobeda} `;
    }
}