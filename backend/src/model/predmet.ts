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
    predavanja: Array,
    vezbe: Array,
    ispiti: Array,
    labInfo: String,
    lab: Array,
    projekatInfo: String,
    projekat: Array,
    predavaci: Array,
    ispitiVidljiv: Boolean,
    labVidljiv: Boolean,
    projekatVidljiv: Boolean

});

export default mongoose.model('Predmet', Predmet, 'predmeti');