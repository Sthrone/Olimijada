export class Igrac
{
    public id_igraca:number;
    public naziv_igraca:String;
    public id_bota:number;
    public id_korisnika:number;
    public slika_igraca:string;
    public korisnicko_ime:string;
    public rejting:number;
    public drzava:string;
    public organizacija:string;
    public naziv_tipa_bota:string;
    public putanja_do_fajla:string;
    public id_tipa_bota:number;

    public static FromJson(objekat:any):Igrac
    { 
        let igrac=new Igrac();
        
        igrac.id_igraca=objekat.id_igraca;
        igrac.naziv_igraca=objekat.naziv_igraca;
        igrac.id_bota=objekat.id_bota;
        igrac.id_korisnika=objekat.id_korisnika;
        igrac.slika_igraca=objekat.slika_igraca;
        igrac.korisnicko_ime=objekat.korisnicko_ime;
        igrac.rejting=objekat.rejting;
        igrac.drzava=objekat.drzava;
        igrac.organizacija=objekat.organizacija;
        igrac.naziv_tipa_bota=objekat.naziv_tipa_bota;
        igrac.putanja_do_fajla=objekat.putanja_do_fajla;
        igrac.id_tipa_bota=objekat.id_tipa_bota;
        return igrac;
    }

    public static FromJsonToArray(objekat:any):Igrac[]
    {
        let n=objekat.length;
        let igraci:Igrac[]=[]; 
   

        for(let i=0;i<n;i++)
        {
            igraci.push(this.FromJson(objekat[i]));   
        }
  
        return igraci;
    }

    public static FromJsonOne(objekat:any):Igrac
    {
        let igrac=new Igrac();
       
        
        igrac.id_igraca=objekat[0].id_igraca;
        igrac.naziv_igraca=objekat[0].naziv_igraca;
        igrac.id_bota=objekat[0].id_bota;
        igrac.id_korisnika=objekat[0].id_korisnika;
        igrac.slika_igraca=objekat[0].slika_igraca;
        igrac.korisnicko_ime=objekat[0].korisnicko_ime;
        igrac.rejting=objekat[0].rejting;
        igrac.drzava=objekat[0].drzava;
        igrac.organizacija=objekat[0].organizacija;
        igrac.naziv_tipa_bota=objekat[0].naziv_tipa_bota;
        igrac.putanja_do_fajla=objekat[0].putanja_do_fajla;
        igrac.id_tipa_bota=objekat[0].id_tipa_bota;
        return igrac;
    }

    toString()
    {
        return `${this.id_igraca} | ${this.naziv_igraca} | ${this.id_bota} }`;
    }
}
