import { Grupa } from "./grupa";

export class PlanAngazovanja {
    _id: string;
    sifraPredmeta: string;
    naziv: string;
    nastavnici: Array<string>;
    studenti: Array<string>;
    grupe: Array<Grupa>;
    brojGrupa: number;

    constructor()
    {
        this.brojGrupa = 1;
    }
   


}

