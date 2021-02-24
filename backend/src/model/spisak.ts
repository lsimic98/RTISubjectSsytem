import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Spisak = new Schema({
    _id : String,
    naziv : String,
    datumOdrzavanja : Date,
    maxBrojStudenata : Number,
    trenutniBrojStudenata : Number,
    sifraPredmeta : String,
    folder : String,
    otvoren : Boolean,
    upload : Boolean,
    datumOtvaranja : Date,
    datumZatvaranja : Date,
    prijavljeni : Array
});

export default mongoose.model('Spisak', Spisak, 'spiskovi');