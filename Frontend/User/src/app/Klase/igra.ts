export class Igra
{
    public id_igre:number;
    public naziv_igre:string;
    public broj_igraca:number;
    public pravila_igre_en:any;
    public pravila_igre_srb:any;
    public putanja_do_fajla:any;
    public trajanje_u_sekundama:number;
    public id_tipa_igre:number;
    public slika_igre:any;
    public naziv_tipa_igre:string;
    public naziv_tipa_igre_srb:string;
    public kratak_opis_en:string;
    public kratak_opis_srb:string;
    public slika_pozadine_igre:any;

    public static FromJson(objekat:any):Igra
    { 
        let igra=new Igra();
        //console.log(objekat);
        //console.log(objekat[0].id_igre);
        igra.id_igre=objekat.id_igre;
        igra.naziv_igre=objekat.naziv_igre;
        igra.broj_igraca=objekat.broj_igraca;
        igra.pravila_igre_en=objekat.pravila_igre_en;
        igra.pravila_igre_srb=objekat.pravila_igre_srb;
        igra.putanja_do_fajla=objekat.putanja_do_fajla;
        igra.trajanje_u_sekundama=objekat.trajanje_u_sekundama;
        igra.id_tipa_igre=objekat.id_tipa_igre;
        igra.slika_igre=objekat.slika_igre;
        igra.naziv_tipa_igre=objekat.naziv_tipa_igre;
        igra.naziv_tipa_igre_srb=objekat.naziv_tipa_igre_srb;
        igra.kratak_opis_en=objekat.kratak_opis_en;
        igra.kratak_opis_srb=objekat.kratak_opis_srb;
        igra.slika_pozadine_igre=objekat.slika_pozadine_igre;

        return igra;
    }

    public static FromJsonToArray(objekat:any):Igra[]
    {
        let n=objekat.length;
        let igre:Igra[]=[]; 
   

        for(let i=0;i<n;i++)
        {
            igre.push(this.FromJson(objekat[i]));   
        }
  
        return igre;
    }

    public static FromJsonOne(objekat:any):Igra
    {
        let igra=new Igra();
        //console.log(objekat);
        //console.log(objekat[0].id_igre);
        igra.id_igre=objekat[0].id_igre;
        igra.naziv_igre=objekat[0].naziv_igre;
        igra.broj_igraca=objekat[0].broj_igraca;
        igra.pravila_igre_en=objekat[0].pravila_igre_en;
        igra.pravila_igre_srb=objekat[0].pravila_igre_srb;
        igra.putanja_do_fajla=objekat[0].putanja_do_fajla;
        igra.trajanje_u_sekundama=objekat[0].trajanje_u_sekundama;
        igra.id_tipa_igre=objekat[0].id_tipa_igre;
        igra.slika_igre=objekat[0].slika_igre;
        igra.naziv_tipa_igre=objekat[0].naziv_tipa_igre;
        igra.naziv_tipa_igre_srb=objekat[0].naziv_tipa_igre_srb;
        igra.kratak_opis_en=objekat[0].kratak_opis_en;
        igra.kratak_opis_srb=objekat[0].kratak_opis_srb;
        igra.slika_pozadine_igre=objekat[0].slika_pozadine_igre;
        return igra;
    }


    toString()
    {
        return `${this.naziv_igre} | ${this.broj_igraca} | ${this.trajanje_u_sekundama} | ${this.id_tipa_igre} | ${this.naziv_tipa_igre} | ${this.naziv_tipa_igre_srb} 
               | ${this.putanja_do_fajla} | ${this.pravila_igre_en} | ${this.slika_igre} | ${this.kratak_opis_en}}`;
    }
}

  

