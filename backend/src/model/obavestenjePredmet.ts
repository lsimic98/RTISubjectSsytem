import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ObavestenjePredmet = new Schema({
    _id: String,
    sifraPredmeta: String,
    nasolv: String,
    sadrzaj: String,
    datumObjave: Date,
    fajlovi: Array
});

export default mongoose.model('ObavestenjePredmet', ObavestenjePredmet, 'predmetObavestenja');