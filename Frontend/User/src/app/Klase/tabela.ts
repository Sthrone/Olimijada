export class Tabela
{
    


    public id_korisnika:number;
    public korisnicko_ime:string;
    public broj_pobeda:number;
    public broj_poraza:number;
    public broj_neresenih:number;
    public id_turnira:number;
    public broj_bodova:number;

    public static FromJson(objekat:any):Tabela
    {
        let tabela = new Tabela();

        
        tabela.id_korisnika = objekat.id_korisnika;
        tabela.korisnicko_ime = objekat.korisnicko_ime;
        tabela.broj_pobeda = objekat.broj_pobeda;
        tabela.broj_poraza = objekat.broj_poraza;
        tabela.broj_neresenih = objekat.broj_neresenih
        tabela.id_turnira=objekat.id_turnira;
     
        return tabela;
    }

    public static FromJsonToArray(objekat:any): Tabela[]
    {
        let n = objekat.length;
        let tabela: Tabela[] = []; 

        for(let i=0 ; i<n ; i++)
        {
            tabela.push(this.FromJson(objekat[i]));
        }

        return tabela;
    }

    toString()
    {
        return `${this.id_korisnika} | ${this.korisnicko_ime} | ${this.broj_pobeda} | ${this.broj_poraza} | ${this.broj_neresenih} | ${this.id_turnira}`;
    }
}