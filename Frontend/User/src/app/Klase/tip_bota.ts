export class TipBota
{
    public id_tipa_bota: number;
    public naziv_tipa_bota: string;
    public id_igre: number;

    public static FromJson(objekat: any): TipBota
    {   
        let tip = new TipBota();
        
        tip.id_tipa_bota = objekat.id_tipa_bota;
        tip.naziv_tipa_bota = objekat.naziv_tipa_bota;
        tip.id_igre = objekat.id_igre;

        return tip;
    }

    public static FromJsonToArray(objekat: any): TipBota[]
    {
        let n = objekat.length;
        let tipovi: TipBota[] = []; 

        for(let i=0 ; i<n ; i++)
        {
            tipovi.push(this.FromJson(objekat[i]));
        }

        return tipovi;
    }

    toString()
    {
        return `${this.id_tipa_bota} | ${this.naziv_tipa_bota} | ${this.id_igre}`;
    }

}