import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ObavestenjePredmet = new Schema({
    _id: String,
    sifraPredmeta: Array,
    naslov: String,
    sadrzaj: String,
    datumObjave: Date,
    fajlovi: Array,
    folder: String

});

export default mongoose.model('ObavestenjePredmet', ObavestenjePredmet, 'predmetObavestenja');