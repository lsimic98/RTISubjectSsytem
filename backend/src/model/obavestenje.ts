import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Obavestenje = new Schema({
    _id:{
        type: String
    },
    nasolv:{
        type: String
    },
    tekst:{
        type: String
    },
    kategorija:{
        type: String
    },
    datumObjave:{
        type: Date
    }
});

export default mongoose.model('Obavestenje', Obavestenje, 'obavestenja');