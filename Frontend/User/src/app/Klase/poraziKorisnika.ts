export class PoraziKorisnika
{
    


    public id_korisnika:number;
    public korisnicko_ime:string;
    public broj_poraza:number;
    public avatar:string;
    public broj_pobeda:number;

    public static FromJson(objekat:any):PoraziKorisnika
    {
        let protivnik = new PoraziKorisnika();

        
        protivnik.id_korisnika = objekat.id_korisnika;
        protivnik.korisnicko_ime = objekat.korisnicko_ime;
        protivnik.broj_poraza = objekat.broj_poraza;
        protivnik.avatar= objekat.avatar;
        protivnik.broj_pobeda=0;

        return protivnik;
    }

    public static FromJsonToArray(objekat:any): PoraziKorisnika[]
    {
        let n = objekat.length;
        let protivnici: PoraziKorisnika[] = []; 

        for(let i=0 ; i<n ; i++)
        {
            protivnici.push(this.FromJson(objekat[i]));
        }

        return protivnici;
    }

    toString()
    {
        return `${this.id_korisnika} | ${this.korisnicko_ime} | ${this.broj_poraza} `;
    }
}