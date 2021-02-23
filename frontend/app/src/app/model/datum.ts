export class Datum {
    datum: string;
    vreme: string;

    kreirajDatum()
    {
        return new Date(this.datum + "T" + this.vreme + ".000Z");
    }

    constructor(){
        this.datum = "";
        this.vreme = "00:00:00";
    }

}

