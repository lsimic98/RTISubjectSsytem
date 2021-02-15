import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Korisnik = new Schema({
    korime:{
        type: String
    },
    lozinka:{
        type: String
    },
    ime:{
        type: String
    },
    prezime:{
        type: String
    },
    adresa:{
        type: String
    },
    kontakt:{
        type: String
    },
    webAdresa:{
        type: String
    },
    biografija:{
        type: String
    },
    zvanje:{
        type: String
    },
    brojKabineta:{
        type: Number
    },
    status:{
        type: String
    },
    tip:{
        type: String
    },
    brojIndeksa:{
        type: String
    },
    tipStudija:{
        type: String
    },
    predmeti:{
        type: Array
    }
});

export default mongoose.model('Korisnik', Korisnik, 'korisnici');