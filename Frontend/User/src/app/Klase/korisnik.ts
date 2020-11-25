import { Igrac } from "./igrac";

export class Korisnik
{
    public id_korisnika:number;
    public korisnicko_ime:string;
    public lozinka:string;
    public email:string;
    public avatar:string;
    public odgovor:string;
    public id_tipa_korisnika:number;
    public tip_korisnika:string;
    public drzava:string;
    public organizacija:string;
    public rejting:number;
    public ban:any;

    // Nema ban.
    public static FromJson(objekat:any):Korisnik
    {  
        let korisnik=new Korisnik();
        korisnik.korisnicko_ime=objekat.korisnicko_ime;
        korisnik.id_korisnika = objekat.id_korisnika;
        korisnik.lozinka=objekat.lozinka;
        korisnik.email=objekat.email;
        korisnik.avatar=objekat.avatar;
        korisnik.odgovor=objekat.odgovor;
        korisnik.id_tipa_korisnika=objekat.id_tipa_korisnika;
        korisnik.drzava=objekat.drzava;
        korisnik.organizacija=objekat.organizacija;
        korisnik.rejting=objekat.rejting;
        //korisnik.ban=objekat.ban;

        if (objekat.id_tipa_korisnika==1) korisnik.tip_korisnika="Admin";
        if (objekat.id_tipa_korisnika==2) korisnik.tip_korisnika="User";
        if (objekat.id_tipa_korisnika==3) korisnik.tip_korisnika="Moderator";

     

        return korisnik;
    }

    // Ima ban.
    public static FromJSON(objekat:any):Korisnik
    {  
        let korisnik=new Korisnik();
        korisnik.korisnicko_ime=objekat.korisnicko_ime;
        korisnik.id_korisnika = objekat.id_korisnika;
        korisnik.lozinka=objekat.lozinka;
        korisnik.email=objekat.email;
        korisnik.avatar=objekat.avatar;
        korisnik.odgovor=objekat.odgovor;
        korisnik.id_tipa_korisnika=objekat.id_tipa_korisnika;
        korisnik.drzava=objekat.drzava;
        korisnik.organizacija=objekat.organizacija;
        korisnik.rejting=objekat.rejting;
        korisnik.ban=objekat.ban;

        if (objekat.id_tipa_korisnika==1) korisnik.tip_korisnika="Admin";
        if (objekat.id_tipa_korisnika==2) korisnik.tip_korisnika="User";
        if (objekat.id_tipa_korisnika==3) korisnik.tip_korisnika="Moderator";

     

        return korisnik;
    }


    public static FromJsonToArray(objekat:any):Korisnik[]
    {
        let n=objekat.length;
        let korisnici:Korisnik[]=[]; 

        for(let i=0;i<n;i++)
        {
            korisnici.push(this.FromJson(objekat[i]));
        }

        return korisnici;
    }


    public static FromJsonOne(objekat:any):Korisnik
    {        
      
        let korisnik=new Korisnik();
        korisnik.id_korisnika=objekat[0].id_korisnika;
        korisnik.korisnicko_ime=objekat[0].korisnicko_ime;
        korisnik.lozinka=objekat[0].lozinka;
        korisnik.email=objekat[0].email;
        korisnik.odgovor=objekat[0].odgovor;
        korisnik.avatar=objekat[0].avatar;
        korisnik.id_tipa_korisnika=objekat[0].id_tipa_korisnika;
        korisnik.drzava=objekat[0].drzava;
        korisnik.organizacija=objekat[0].organizacija;
        korisnik.rejting=objekat[0].rejting;    

       
        if (objekat[0].id_tipa_korisnika==1) korisnik.tip_korisnika="Admin";
        if (objekat[0].id_tipa_korisnika==2) korisnik.tip_korisnika="User";
        if (objekat[0].id_tipa_korisnika==3) korisnik.tip_korisnika="Moderator";

        return korisnik;
    }


    public static VratiKorisnike(igraci: Igrac[]): Korisnik[]
    {
        let korisnici: Korisnik[] = [];

        for (let i = 0 ; i<igraci.length ; i++)
        {
            if (korisnici.findIndex(x => x.id_korisnika == igraci[i].id_korisnika) == -1)
            {
                let k = new Korisnik();
                k.id_korisnika = igraci[i].id_korisnika;
                k.korisnicko_ime = igraci[i].korisnicko_ime;
                k.organizacija = igraci[i].organizacija;
                k.rejting = igraci[i].rejting;
                k.drzava = igraci[i].drzava;
                
                korisnici.push(k);
            }
        }

        return korisnici;   
    }
    

    toString()
    {
        return `${this.korisnicko_ime} | ${this.email}  | ${this.id_tipa_korisnika} | ${this.odgovor} `;
    }

}