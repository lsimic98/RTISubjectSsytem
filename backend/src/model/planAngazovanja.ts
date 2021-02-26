import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let PlanAngazovanja = new Schema({
    _id: String,
    sifraPredmeta: String,
    naziv: String,
    predavaci: Array,
    studenti: Array,
    grupe: Array,
    brojGrupa: Number
});

export default mongoose.model('PlanAngazovanja', PlanAngazovanja, 'planAngazovanja');