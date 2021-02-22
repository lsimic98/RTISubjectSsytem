import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Fajl = new Schema({
    _id: String,
    sifraPredmeta: String,
    folder: String,
    podFolder: String,
    naziv: String,
    tip: String,
    velicina: Number,
    korime: String,
    ime: String,
    prezime: String,
    datumObjave: Date
});

export default mongoose.model('Fajl', Fajl, 'fajlovi');