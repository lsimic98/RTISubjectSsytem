export class Spisak {
    _id : string;
    naziv : string;
    mestoOdrzavanja: string;
    datumOdrzavanja : Date;
    maxBrojStudenata : number;
    trenutniBrojStudenata : number;
    sifraPredmeta : string;
    folder : string;
    otvoren : boolean;
    upload : boolean;
    datumOtvaranja : Date;
    datumZatvaranja : Date;
    prijavljeni : Array<string>;
}