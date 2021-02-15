import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import korisnik from './model/korisnik';
import obavestenje from './model/obavestenje';
import predmet from './model/predmet';
import obavestenjePredmet from './model/obavestenjePredmet';



const app = express();
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/rti");
const conn = mongoose.connection;
conn.once('open', () => {
    console.log('Connection open!');
});

const router = express.Router();

//Login
router.route('/login').post((req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    
    korisnik.findOne({'korime': username, 'lozinka': password}, (err, user) => {
            if (err)
                console.log(err);
            else
                res.json(user);
        });

});
//END_Login

// function getNextSequenceValueKorisik(sequenceName: string){
//     let seqValue: number;
//     korisnik.collection.findOneAndUpdate(
//         {'_id': sequenceName}, 
//         {$inc: {seqValue: 1}},
//         (err, res) =>{
//             if(err)
//                 console.log(err);
//             else
//                 res;
//         }
//     );
//     return seqValue;
//  }

//registerStudent
router.route('/registerStudent').post((req, res)=>{
    let brojIndeksa = req.body.brojIndeksa;
    
    
    korisnik.findOne({brojIndeksa: brojIndeksa}, (err, user) => {
            if (err)
                console.log(err);
            else
            {
                if(user)
                {
                    res.json({'status':false});
                }
                else
                {
                    let ime = req.body.ime;
                    let prezime = req.body.prezime;
                    let tipStudija = req.body.tipStudija;
                    let lozinka = req.body.lozinka;
                    let broj = brojIndeksa.split('/')[1];
                    let korime:string = 
                        prezime[0] + ime[0] + brojIndeksa[2] + brojIndeksa[3] 
                        + broj + tipStudija ;//+ "@student.etf.rs";
                
                        
                    korisnik.collection.insertOne(
                        {
                            korime: korime.toLowerCase(),
                            lozinka: lozinka,
                            brojIndeksa: brojIndeksa,
                            tipStudija: tipStudija,
                            ime: ime,
                            prezime: prezime,
                            status: 'aktivan',
                            tip: 'student'
                        }
                    );
                    res.json({'status':true});
                }
                
            }
    });

});
//END_registerStudent

//getWorkers
router.route('/getWorkers').get((req, res) => {
    korisnik.find({tip: 'zaposlen'}, (err, zaposleni) => {
        if(err)
            console.log(err);
        else
            res.json(zaposleni);
    });
});
//END_getWorkers


//getWorker
router.route('/getWorker').post((req, res) => {
    let _id:string = req.body.idZaposlen;
    // korisnik.findOne(new mongoose.Types.ObjectId(_id), (err, zaposlen) => {
    korisnik.findOne({korime: _id}, (err, zaposlen) => {
        // console.log(zaposlen);
        if(err)
            console.log(err);
        else
            res.json(zaposlen);
    });

    
});

//END_getWorker

//getWorker
router.route('/updateWorker').post((req, res) => {
    let korime:string = req.body.korime;
    // korisnik.findOne(new mongoose.Types.ObjectId(_id), (err, zaposlen) => {
    korisnik.updateOne({korime: korime}, req.body, (err) => {
        // console.log(zaposlen);
        if(err){
            console.log(err);
            res.json({'poruka':'Podaci su nisu ažurirani!'});
        }  
        else
            res.json({'poruka':'Podaci su uspešno ažurirani!'});
    });

});

//END_updateWorker

router.route('/uploads').get((req, res) => {
    const testFolder = './uploads';
    const path = './uploads/sl170353d.pdf';

    if (fs.existsSync(path)) {
        res.contentType("application/pdf");
        fs.createReadStream(path).pipe(res)
    } else {
        res.status(500)
        console.log('File not found')
        res.send('File not found')
    }
    
    // fs.readdir(testFolder, (err: any, files:any) => {
    //     console.log(files);
    //     res.json({"files": files});
    // });
});


router.route('/download/:fileName').get((req, res) => {
    let fileName =  req.params.fileName;
    if(fs.existsSync('./uploads/'+ fileName))
    {
        res.download('./uploads/'+ fileName);
    }
    else
    {
        res.status(404).send('Fajl ne psotoji!');
    }
        
});


//getNotifications
router.route('/getNotifications').get((req, res) => {
    let now = new Date();
    now.setMonth(now.getMonth() - 3);
    obavestenje.find({datumObjave: {$gte: now}}).sort({datumObjave: 'desc'}).exec((err, obavestenja) => {
        if(err)
            console.log(err);
        else
            res.json(obavestenja);    
    });
});

//END_getNotifications


//subjects/:department
router.route('/subjects/:department').get((req, res) => {
    predmet.aggregate([
        {
            $match:{odseci: { $elemMatch : {$eq: req.params.department}}}
        },
        { 
            $group : { _id : "$semestar", predmeti: {$push: {sifraPredmeta: "$sifraPredmeta", naziv: "$naziv",}}}
        },
        {
            $sort : {_id : 1}
        } 
    ]).exec((err, predmeti) => {
        if(err)
            console.log(err);
        else{
            res.json(predmeti);
        }
                
    });
});
//END_subjects/:department
// { nastavnici: { $elemMatch: { predavac: "milo001"} } }
//subject/:id
router.route('/subject/:id').get((req, res) => {
    predmet.findOne({sifraPredmeta: req.params.id}, (err, predmet) => {
        // console.log(zaposlen);
        if(err)
            console.log(err);
        else
            res.json(predmet);
    });
});
//END_subject/:id

//subjectNotifications/:id
router.route('/subjectNotifications/:id').get((req, res) => {
    obavestenjePredmet.find({sifraPredmeta: req.params.id}).sort({datumObjave: 'desc'}).exec( (err, obavestenja) => {
        // console.log(zaposlen);
        if(err)
            console.log(err);
        else
            res.json(obavestenja);
    });
});
//END_subjectNotifications/:id









app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));