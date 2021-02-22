export class Predmet {
    _id: string;
    naziv: string;
    sifraPredmeta: string;
    tip: string;
    godina: number;
    semestar: number;
    odseci: Array<string>;
    fondCasova: number;
    espb: number;
    cilj: string;
    ishod: string;
    termini: string;
    dodatneInformacije: string;
    predavanja: Array<string>;
    vezbe: Array<string>;
    ispiti: Array<string>;
    labInfo: string;
    lab: Array<string>;
    projekatInfo: string;
    projekat: Array<string>;
    predavaci: Array<string>;
    ispitiVidljiv: boolean;
    labVidljiv: boolean;
    projekatVidljiv: boolean;
}

