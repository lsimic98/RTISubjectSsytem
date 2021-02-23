import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import korisnik from './model/korisnik';
import obavestenje from './model/obavestenje';
import predmet from './model/predmet';
import obavestenjePredmet from './model/obavestenjePredmet';
import planAngazovanja from './model/planAngazovanja';
import fajl from './model/fajl';

mongoose.connect("mongodb://localhost:27017/rti");
const conn = mongoose.connection;
conn.once('open', () => {
    console.log('Connection open!');
});



const app = express();
const fs = require('fs');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        let destPath = './uploads/' + req.headers.subfolder;
        let folders = destPath.split('/');

        console.log(file);
        if(!fs.existsSync(destPath))
            fs.mkdirSync(destPath, { recursive: true });
        
        if(fs.existsSync(destPath + '/' + file.originalname)){
            console.log("POSTOJI!");
            fajl.collection.updateOne(
                {sifraPredmeta: folders[2], folder:folders[2], podFolder: folders[3], naziv: file.originalname},
                {$set: {velicina: file.size, korime: req.headers.korime, ime: req.headers.ime, prezime: req.headers.prezime, datumObjave: new Date()}}
            );
        }
        else{
            fajl.collection.insertOne(
                {
                    sifraPredmeta: folders[2],
                    folder: folders[2],
                    podFolder: folders[3], 
                    naziv: file.originalname,
                    tip: path.extname(file.originalname).toUpperCase(),
                    velicina: 0, 
                    korime: req.headers.korime, 
                    ime: req.headers.ime, 
                    prezime: req.headers.prezime,
                    datumObjave: new Date()
                }
            );
        }


        cb(null, destPath);
    },
    filename: (req: any, file: any, cb: any) => {
        
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});
app.use(express.static('./uploads'));
app.use(cors({origin:'*'}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 



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

//getSubjectsNotifications
router.route('/getSubjectsNotifications').post((req, res) => {
    obavestenjePredmet.find({sifraPredmeta: {$in : req.body.predmeti}}).sort({datumObjave: -1}).exec( (err, obavestenja) => {
        // console.log(zaposlen);
        if(err)
            console.log(err);
        else
            res.json(obavestenja);
    });
});
//END_getSubjectsNotifications




//subjectNotifications/:id ----------IZMENA
router.route('/subjectNotifications/:id').get((req, res) => {
    obavestenjePredmet.find({sifraPredmeta: {$elemMatch:{$eq: req.params.id}}}).sort({datumObjave: 'desc'}).exec( (err, obavestenja) => {
        // console.log(zaposlen);
        if(err)
            console.log(err);
        else
            res.json(obavestenja);
    });
});
//END_subjectNotifications/:id 

//subjectNotification/:id
router.route('/subjectNotification/:id').get((req, res) => {
    let _id = new mongoose.Types.ObjectId(req.params.id);
    obavestenjePredmet.collection.findOne({_id: _id}, (err, obavestenje) => {
        // console.log(zaposlen);
        if(err)
            console.log(err);
        else
            res.json(obavestenje);
    });
});
//END_subjectNotification/:id 

//updateSubjectNotification
router.route('/updateSubjectNotification').post((req, res) => {
    let _id = new mongoose.Types.ObjectId(req.body._id);
    let updateObject = {
        sifraPredmeta: req.body.sifraPredmeta,
        nasolv: req.body.nasolv,
        sadrzaj: req.body.sadrzaj,
        datumObjave: req.body.datumObjave
    };
    console.log(updateObject);
    obavestenjePredmet.collection.updateOne({_id: _id}, {$set: updateObject}, (err) => {
        // console.log(zaposlen);
        if(err){
            // console.log(err);
            res.json({'poruka' : 'Infromacije o obaveštenju za predmet nisu ažurirane!'});
        }
        else
            res.json({'poruka' : 'Infromacije o obaveštenju za predmet uspešno ažurirane!'});
    });
});
//END_updateSubjectNotification



//uploadSubjectNotification
router.route('/uploadSubjectNotification').post((req, res) => {
    let novoObavestenjePredmeta = {
        sifraPredmeta: req.body.sifraPredmeta,
        naslov: req.body.naslov,
        sadrzaj: req.body.sadrzaj,
        datumObjave: new Date(req.body.datumObjave),
        fajlovi: new mongoose.Types.DocumentArray<any>(0),
        folder: req.body.folder
    };

    obavestenjePredmet.collection.insertOne(novoObavestenjePredmeta);

    res.send({poruka: 'Obavestenje uspesno objavljeno!'});
});

//END_uploadSubjectNotification

//updateSubjectExamInfo
router.route('/updateSubjectExamInfo').post((req, res) => {
    // let _id = new mongoose.Types.ObjectId(req.body._id);
    predmet.updateOne({sifraPredmeta: req.body.sifraPredmeta}, 
        {$set:{ispitiVidljiv: req.body.ispitiVidljiv}},(err, raw) => {
        if(err)
            console.log(err);
        else{
            res.json({poruka: 'OK', raw: raw});
        }
    });
});
//END_updateSubjectExamInfo


//updateSubjectLabInfo
router.route('/updateSubjectLabInfo').post((req, res) => {
    // let _id = new mongoose.Types.ObjectId(req.body._id);
    predmet.updateOne({sifraPredmeta: req.body.sifraPredmeta}, 
        {$set:{labInfo: req.body.labInfo, labVidljiv: req.body.labVidljiv}},(err, raw) => {
        if(err)
            console.log(err);
        else{
            res.json({poruka: 'OK', raw: raw});
        }

    });
});
//END_updateSubjectLabInfo

//updateSubjectProjectInfo
router.route('/updateSubjectProjectInfo').post((req, res) => {
    // let _id = new mongoose.Types.ObjectId(req.body._id);
    predmet.updateOne(
        {sifraPredmeta: req.body.sifraPredmeta}, 
        {$set:{projekatInfo: req.body.projekatInfo, projekatVidljiv: req.body.projekatVidljiv}},(err, raw) => {
        if(err)
            console.log(err);
        else{
            res.json({poruka: 'OK', raw: raw});
        }

    });
});
//END_updateSubjectProjectInfo


//updateSubjectInfo
router.route('/updateSubjectInfo').post((req, res) => {
    console.log(req.body)
    let _id = new mongoose.Types.ObjectId(req.body._id);
    let noviPredmet = {
        naziv: req.body.naziv,
        tip: req.body.tip,
        godina: req.body.godina,
        semestar: req.body.semestar,
        odseci: req.body.odseci,
        fondCasova: req.body.fondCasova,
        espb: req.body.espb,
        cilj: req.body.cilj,
        ishod: req.body.ishod,
        termini: req.body.termini,
        dodatneInformacije: req.body.dodatneInformacije
    };
    
    predmet.collection.updateOne(
        {_id: _id},
        {$set:noviPredmet},
        (err, raw) => {
        if(err)
            console.log(err);
        else{
            res.json({poruka: 'OK', raw: raw});
        }

    });
});



//END_updateSubjectInfo








// uploadSingle
// router.route('/uploadSingle').post(multer({storage:storage}).single('file'), (req, res) => {
//   console.log(req.file);
//   res.status(200).send();
// });
//END_uploadSingle


//engagePlan/:id
router.route('/engagePlan/:id').get((req, res) => {
    planAngazovanja.find({predavaci: {$elemMatch : {$eq : req.params.id}}}, {_id:0, sifraPredmeta: 1, naziv: 1}).sort({sifraPredmeta: 1}).exec( (err, plan) => {
        // console.log(zaposlen);
        if(err)
            console.log(err);
        else
            res.json(plan);
    });
});
//END_engagePlan/:id 

//getSubjectFiles/:id
router.route('/getSubjectFiles/:id').get((req, res) => {
    fajl.find({sifraPredmeta: req.params.id}).sort({datumObjave: -1}).exec( (err, fajlovi) => {
        // console.log(zaposlen);
        if(err)
            console.log(err);
        else
            res.json(fajlovi);
    });
});
//END_getSubjectFiles/:id 

//updateSubjectFilesOrder
router.route('/updateSubjectFilesOrder').post((req, res) => {

    // let _id = new mongoose.Types.ObjectId(req.body._id);
    console.log(req.body.novRedosled);
    predmet.collection.updateOne(
        {sifraPredmeta: req.body.sifraPredmeta}, 
        {$set:{[req.body.tipMaterijala]: req.body.novRedosled}}
    );

    res.json({'poruka': 'OK'});

});
//END_updateSubjectFilesOrder


//deleteFile
router.route('/deleteFile').post((req, res) => {
    let folders = req.body.path.split('/');
    console.log(folders);

    try{
        fs.unlinkSync(req.body.path);
        fajl.remove({sifraPredmeta: folders[1], podFolder: folders[2], naziv: folders[3]}, (err) => {
            console.log(err);
        });
        predmet.updateOne({sifraPredmeta: folders[1]}, {$pull: {[folders[2]]:  folders[3]}}, (err, raw) => {
            if(err)
                console.log(err);
            else
                console.log(raw);
        });
        res.json({poruka : 'OK'});
    }
    catch(err) {
        console.error(err)
    }
});


//END_deleteFile






//Samo za materijale predmeta
app.post('/uploadSingle', upload.single('file'),function (req: any, res, next) {
    const file = req.file;
    // console.log(file);
    // console.log(req.headers);

 

    if(!file){
        const error = new Error('No File');
        return next(error);
    }

    let folders = file.path.split(path.sep);
    console.log(folders);
    console.log(file.size);
    fajl.findOneAndUpdate(
        {sifraPredmeta: folders[1], podFolder: folders[2], naziv: file.originalname},
        {$set:{velicina: file.size}},
        {new: true},
        (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            
            console.log(doc);
            res.send(doc);
        });

    predmet.collection.updateOne({sifraPredmeta: folders[1]}, {$push : { [folders[2]] : file.originalname}});

 
});


app.post('/uploadMultiple', upload.array('files'),function (req: any, res, next) {
    const files = req.files;
    console.log(files);

    if(!files){
        const error = new Error('No File');
        return next(error);
    }





    res.send({status: "OK"});
}); 


//Samo za materijale obavestenja predmeta
app.post('/uploadSubjectNotificationWithFiles', upload.array('files'),function (req: any, res, next) {
    const files = req.files;
    console.log(files);

    if(!files){
        const error = new Error('No File');
        return next(error);
    }

    console.log("Headers\n");
    console.log(req.headers);

   

    let novoObavestenjePredmeta = {
        sifraPredmeta: req.headers.sifrapredmeta.split(','),
        naslov: req.headers.naslov,
        sadrzaj: req.headers.sadrzaj,
        datumObjave: new Date(req.headers.datumobjave),
        fajlovi: new mongoose.Types.DocumentArray<any>(0),
        folder: req.headers.folder
    };

    obavestenjePredmet.collection.insertOne(novoObavestenjePredmeta);



    for(let i = 0; i < files.length; i++){
        let folders = files[i].path.split(path.sep);
        console.log(folders);
        console.log(files[i].size);
        fajl.findOneAndUpdate(
            {sifraPredmeta: folders[1], podFolder: folders[2], naziv: files[i].originalname},
            {$set:{velicina: files[i].size}},
            {new: true},
            (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                
                console.log(doc);
                // res.send(doc);
            });

        obavestenjePredmet.collection.updateOne({folder: folders[2]}, {$push : { fajlovi : files[i].originalname}});
    }
    res.send({status: "OK"});
});



app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));