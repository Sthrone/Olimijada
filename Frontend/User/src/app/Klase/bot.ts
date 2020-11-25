export class Bot
{
    public id_bota: number;
    public putanja_do_fajla: string;
    public id_korisnika: number;
    public id_tipa_bota: number;
    public naziv_tipa_bota: string;
    public id_igre: number;

    public static FromJson(objekat:any): Bot
    {   
        let bot = new Bot();
        
        bot.id_bota = objekat.id_bota;
        bot.id_igre = objekat.id_igre;
        bot.id_korisnika = objekat.id_korisnika;
        bot.id_tipa_bota = objekat.id_tipa_bota;
        bot.naziv_tipa_bota = objekat.naziv_tipa_bota;
        bot.putanja_do_fajla = objekat.putanja_do_fajla;
      
        return bot;
    }

    public static FromJsonToArray(objekat:any): Bot[]
    {
       
        let n = objekat.length;
        let botovi: Bot[] = []; 
        
        for(let i=0 ; i<n ; i++)
        {
            botovi.push(this.FromJson(objekat[i]));
        }

        return botovi;
    }

    toString()
    {
        return `${this.id_bota} | ${this.id_igre} | ${this.id_korisnika} | ${this.id_tipa_bota} | ${this.naziv_tipa_bota} | ${this.putanja_do_fajla}`;
    }

}