export class DatumRejting
{
    public datum_odigravanja: Date;
    public rejting: number;
    

    public static FromJson(objekat:any): DatumRejting
    {   
        let rej = new DatumRejting();
        
        rej.datum_odigravanja = new Date(objekat.datum_odigravanja+"");
        rej.rejting = parseInt(objekat.prvi)*10+parseInt(objekat.drugi)*5;
        
      
        return rej;
    }

    public static FromJsonToArray(objekat:any): DatumRejting[]
    {
       
        let n = objekat.length;
        let rejtinzi: DatumRejting[] = []; 
        
        for(let i=0 ; i<n ; i++)
        {
            rejtinzi.push(this.FromJson(objekat[i]));
        }

        return rejtinzi;
    }

    toString()
    {
        return `${this.datum_odigravanja} | ${this.rejting}`;
    }

}