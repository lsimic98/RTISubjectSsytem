import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Predmet = new Schema({
    _id: String,
    naziv: String,
    sifraPredmeta: String,
    tip: String,
    godina: Number,
    semestar: Number,
    odseci: Array,
    fondCasova: Number,
    espb: Number,
    cilj: String,
    ishod: String,
    termini: String,
    dodatneInformacije: String,
    predavanjaM: Array,
    vezbeM: Array,
    ispitiM: Array,
    labInfo: String,
    labM: Array,
    projekatInfo: String,
    projekatM: Array,
    predavaci: Array

});

export default mongoose.model('Predmet', Predmet, 'predmeti');