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
import spisak from './model/spisak';

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
                            status: req.body.status,
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

router.route('/uploads/*').get((req, res) => {
    // const testFolder = './uploads';
    const path = './uploads/' + req.params[0];

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


router.route('/download/*').get((req, res) => {
    let fileName =  req.params[0];
    console.log(fileName);
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

router.route('/getAllNotifications').get((req, res) => {
    obavestenje.find({}).sort({datumObjave: 'desc'}).exec((err, obavestenja) => {
        if(err)
            console.log(err);
        else
            res.json(obavestenja);    
    });
});

router.route('/deleteNotificationAdmin').post((req, res) => {
    let _id = mongoose.Types.ObjectId(req.body._id);
    obavestenje.collection.deleteOne({_id: _id});
    res.json({poruka: "Obavestenje izbrisano!"});
});

router.route('/updateNotificationAdmin').post((req, res) => {
    let _id = mongoose.Types.ObjectId(req.body._id);
    const data = {
        naslov: req.body.naslov,
        tekst: req.body.tekst,
        kategorija: req.body.kategorija
    }

    obavestenje.collection.updateOne({_id: _id}, {$set: data});

    res.json({poruka:"Obavestenje uspesno azurirano!"});
});


router.route('/registerNotificationAdmin').post((req, res) => {
    const data = {
        naslov: req.body.naslov,
        tekst: req.body.tekst,
        kategorija: req.body.kategorija,
        datumObjave: new Date()
    }

    obavestenje.collection.insertOne(data, );

    res.json({poruka:"Obavestenje uspesno dodato!"});
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


//getSubjectNotificationFiles
router.route('/getSubjectNotificationFiles/:id').get((req, res) => {
    fajl.find({podFolder: req.params.id}, (err, fajlovi) => {
        if(err)
            console.log(err);
        else
            res.json(fajlovi);
    });
});
//END_getSubjectNotificationFiles

//updateSubjectNotification
router.route('/updateSubjectNotification').post((req, res) => {
    // let _id = new mongoose.Types.ObjectId(req.body._id);

    let noviFolder = req.body.naslov.replace(/ /g,"_") + "_" + Date.now();

    let updateObject = {
        sifraPredmeta: req.body.sifraPredmeta,
        naslov: req.body.naslov,
        sadrzaj: req.body.sadrzaj,
        datumObjave: new Date(req.body.datumObjave),
        folder: noviFolder
    };
    console.log(updateObject);
    obavestenjePredmet.collection.updateOne({folder: req.body.folder}, {$set: updateObject}, (err) => {
        // console.log(zaposlen);
        if(err){
            // console.log(err);

            res.json({'poruka' : 'Infromacije o obaveštenju za predmet nisu ažurirane!'});
        }
        else{
            try {
                fajl.collection.updateMany({podFolder: req.body.folder}, {$set: {podFolder: noviFolder}})
                fs.renameSync('./uploads/obavestenjaPredmeta/'+ req.body.folder, './uploads/obavestenjaPredmeta/'+ noviFolder);
                console.log("Successfully renamed the directory.");
              } catch(err) {
                console.log(err)
              }
            res.json({
                'poruka' : 'Infromacije o obaveštenju za predmet uspešno ažurirane!',
                'noviFolder' : noviFolder
            });
        }
    });
});
//END_updateSubjectNotification


//deleteSubjectNotification
router.route('/deleteSubjectNotification').post((req, res) => {
    try{
        fajl.collection.deleteMany({podFolder: req.body.folder});
        obavestenjePredmet.collection.deleteMany({folder: req.body.folder});
        fs.rmdirSync('./uploads/obavestenjaPredmeta/' + req.body.folder, { recursive: true });

  
        res.json({poruka : 'OK'});
    }
    catch(err) {
        console.error(err)
    }

});

//END_deleteSubjectNotification

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


//getSubjectList/:id
router.route('/getSubjectList/:id').get((req, res) => {
    spisak.find({sifraPredmeta: req.params.id}, (err, spiskovi) => {
        if(err)
            console.log(err);
        else
            res.json(spiskovi);
    });

});
//END_getSubjectList/:id

//uploadSubjectList
router.route('/uploadSubjectList').post((req, res) => {
    let noviSpisak = {
        naziv : req.body.naziv,
        mestoOdrzavanja: req.body.mestoOdrzavanja,
        datumOdrzavanja : new Date(req.body.datumOdrzavanja),
        maxBrojStudenata : req.body.maxBrojStudenata,
        trenutniBrojStudenata : req.body.trenutniBrojStudenata,
        sifraPredmeta : req.body.sifraPredmeta,
        folder : req.body.folder,
        otvoren : req.body.otvoren,
        upload : req.body.upload,
        datumOtvaranja : new Date(req.body.datumOtvaranja),
        datumZatvaranja : new Date(req.body.datumZatvaranja),
        prijavljeni : new mongoose.Types.DocumentArray<any>(0)

    }

    spisak.collection.insertOne(noviSpisak);

    res.json({poruka: 'OK'});



});

//END_uploadSubjectList


//updateSubjectList
router.route('/updateSubjectList').post((req, res) => {

    let noviFolder = req.body.naziv.replace(/ /g,"_") + "_" + req.body.sifraPredmeta + "_" + Date.now();


    let noviSpisak = {
        naziv : req.body.naziv,
        mestoOdrzavanja: req.body.mestoOdrzavanja,
        datumOdrzavanja : new Date(req.body.datumOdrzavanja),
        maxBrojStudenata : req.body.maxBrojStudenata,
        trenutniBrojStudenata : req.body.trenutniBrojStudenata,
        sifraPredmeta : req.body.sifraPredmeta,
        folder : noviFolder,
        otvoren : req.body.otvoren,
        upload : req.body.upload,
        datumOtvaranja : new Date(req.body.datumOtvaranja),
        datumZatvaranja : new Date(req.body.datumZatvaranja)
    }

    spisak.collection.updateOne({folder: req.body.folder}, {$set: noviSpisak},  (err) => {
        // console.log(zaposlen);
        if(err){
            // console.log(err);
            res.json({'poruka' : 'Spisak bezuspesno azuriran!'});
        }
        else{
            try {
                if(fs.existsSync('./uploads/spiskovi/'+ req.body.folder)){
                    fajl.collection.updateMany({podFolder: req.body.folder}, {$set: {podFolder: noviFolder}})
                    fs.renameSync('./uploads/spiskovi/'+ req.body.folder, './uploads/spiskovi/'+ noviFolder);
                    console.log("Successfully renamed the directory.");
                }
              } catch(err) {
                console.log(err)
              }
            res.json({
                'poruka' : 'Spisak uspesno azuriran!',
                'noviFolder' : noviFolder
            });
        }
    });



    // res.json({poruka: 'OK'});



});

//END_updateSubjectList


//deleteSubjectList
router.route('/deleteSubjectList').post((req, res) => {
    try{
        // fajl.collection.deleteMany({podFolder: req.body.folder});
        spisak.collection.deleteOne({folder: req.body.folder});

        // if(fs.existsSync('./uploads/spiskovi/' + req.body.folder))
        //     fs.rmdirSync('./uploads/spiskovi/' + req.body.folder, { recursive: true });

  
        res.json({poruka : 'OK'});
    }
    catch(err) {
        console.error(err)
    }

});

//END_deleteSubjectList



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


router.route('/getAllUsers').get((req, res) =>{
    korisnik.find({tip: {$ne : 'admin'}}, (err, sviKorisnici) => {
        if(err)
            console.log(err);
        else
            res.json(sviKorisnici);
    });

});

router.route('/getAllSubjects').get((req, res) =>{
    predmet.find({}, (err, sviPredmeti) => {
        if(err)
            console.log(err);
        else
            res.json(sviPredmeti);
    });

});

router.route('/getAllEngagePlans').get((req, res) =>{
    planAngazovanja.find({}, (err, sviPlanoviAngazovanja) => {
        if(err)
            console.log(err);
        else
            res.json(sviPlanoviAngazovanja);
    });

});

router.route('/updateStudentAdmin').post((req, res) => {
    let korime = req.body.prezime[0] + req.body.ime[0] + req.body.brojIndeksa[2] + req.body.brojIndeksa[3] 
    + req.body.brojIndeksa.split('/')[1] + req.body.tipStudija;
    korime = korime.toLowerCase();
    console.log(korime);

    if(req.body.staroKorime != korime){
        korisnik.findOne({brojIndeksa: req.body.brojIndeksa}, (err, user) => {
            if(err){
                console.log(err);
                res.json({'poruka':'Podaci su nisu ažurirani!'});
            }
            else
            {
                if(user)
                    res.json( res.json({'status':false}));
                else
                {


                    let data = {
                        ime : req.body.ime,
                        prezime : req.body.prezime,
                        tipStudija : req.body.tipStudija,
                        lozinka : req.body.lozinka,
                        korime: korime, //+ "@student.etf.rs";
                        status: req.body.status,
                        brojIndeksa: req.body.brojIndeksa
                    }

                    // { nastavnici: { $elemMatch: { predavac: "milo001"} } }
                    spisak.collection.updateMany({prijavljeni: req.body.staroKorime}, {$set: {'prijavljeni.$': korime}});
                    planAngazovanja.collection.updateMany({studenti: req.body.staroKorime}, {$set: {'studenti.$': korime}});
                    korisnik.collection.updateOne({korime: req.body.staroKorime}, {$set:data});
                    res.json({poruka: 'Student uspesno azuriran!'});
                }
            }
        
        });
    }
    else
    {
        korisnik.collection.updateOne(
            {brojIndeksa:req.body.brojIndeksa}, 
            {$set:{lozinka: req.body.lozinka, status: req.body.status}}
        ); 
        
        res.json({poruka: 'Student uspesno azuriran!'});

    }
});


router.route('/deleteStudentAdmin').post((req, res) => {


    spisak.collection.updateMany({prijavljeni: req.body.korime}, {$pull: {prijavljeni:  req.body.korime}});
    planAngazovanja.collection.updateMany({studenti: req.body.korime}, {$pull: {studenti:  req.body.korime}});
    korisnik.collection.deleteOne({korime:req.body.korime});

    res.json({poruka: 'Student uspesno izbrisan!'});


});
//Worker

router.route('/registerWorkerAdmin').post((req, res) => {
    let data = {
        korime: req.body.korime,
        lozinka: req.body.lozinka,
        ime: req.body.ime,
        prezime: req.body.prezime,
        adresa: req.body.adresa,
        kontakt: req.body.kontakt,
        webAdresa: req.body.webAdresa,
        biografija: req.body.biografija,
        zvanje: req.body.zvanje,
        brojKabineta: req.body.brojKabineta,
        status: 'neaktivan',
        tip: 'zaposlen',
        predmeti: new mongoose.Types.DocumentArray<any>(0)
    }

    korisnik.findOne({korime: req.body.korime}, (err, user) => {
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
                
                korisnik.collection.insertOne(data);
                res.json({'status':true});
            }
        }
    });
});

router.route('/updateWorkerAdmin').post((req, res) => {
    let data = {
        korime: req.body.korime,
        lozinka: req.body.lozinka,
        ime: req.body.ime,
        prezime: req.body.prezime,
        adresa: req.body.adresa,
        kontakt: req.body.kontakt,
        webAdresa: req.body.webAdresa,
        biografija: req.body.biografija,
        zvanje: req.body.zvanje,
        brojKabineta: req.body.brojKabineta
    }

    if(req.body.staroKorime != req.body.korime) //Korisnicko ime se promenilo - normalizacija baze level -999
    {
        korisnik.findOne({korime: req.body.korime}, (err, user) => {
            if(err){
                console.log(err);
                res.json({'poruka':'Podaci su nisu ažurirani!'});
            }
            else
            {
                if(user)
                    res.json( res.json({'status':false}));
                else
                {

                    // { nastavnici: { $elemMatch: { predavac: "milo001"} } }
                    fajl.collection.updateMany(
                        {korime: req.body.staroKorime}, 
                        {$set:{korime: req.body.korime, ime: req.body.ime, prezime: req.body.prezime}}
                    );

                    planAngazovanja.collection.updateMany(
                        {
                            predavaci: req.body.staroKorime,
                            P1: req.body.staroKorime, 
                            P2: req.body.staroKorime, 
                            V1: req.body.staroKorime, 
                            V2: req.body.staroKorime
                        }, 
                        {$set: {
                            'predavaci.$': req.body.korime, 
                            'P1.$': req.body.korime, 
                            'P2.$': req.body.korime, 
                            'V1.$': req.body.korime, 
                            'V2.$': req.body.korime, 
                        }}
                    );

                    predmet.collection.updateMany(
                        {predavaci: req.body.staroKorime}, 
                        {$set: {'predavaci.$': req.body.korime}}
                    );
                    
                    korisnik.collection.updateOne({korime: req.body.staroKorime}, {$set:data});

                    res.json({poruka: 'Zaposlen uspesno azuriran!'});
                }
            }
        
        });


    }
    else
    {
        korisnik.collection.updateOne({korime: req.body.korime}, {$set:data});
        res.json({poruka: 'Zaposlen uspesno azuriran!'});
    }

});


router.route('/deleteWorkerAdmin').post((req, res) => {
    fajl.collection.updateMany(
        {korime: req.body.korime}, 
        {$set:{korime: undefined, ime: undefined, prezime: undefined}}
    );

    planAngazovanja.collection.updateMany(
        {
            predavaci: req.body.korime,
        }, 
        {$pull: {
            predavaci: req.body.korime, 
            P1: req.body.korime, 
            P2: req.body.korime, 
            V1: req.body.korime, 
            V2: req.body.korime
        }}
    );

    predmet.collection.updateMany(
        {predavaci: req.body.korime}, 
        {$pull: {predavaci: req.body.korime}}
    );
    
    korisnik.collection.deleteOne({korime: req.body.korime});
    res.json({poruka: 'Zaposlen uspesno izbrisan!'});

});

//Predmeti

router.route('/registerSubjectAdmin').post((req, res) => {
    let data = {
        naziv: req.body.naziv,
        sifraPredmeta: req.body.sifraPredmeta,
        tip: req.body.tip,
        godina: req.body.godina,
        semestar: req.body.semestar,
        odseci: req.body.odseci,
        fondCasova: req.body.fondCasova,
        espb: req.body.espb,
        cilj: req.body.cilj,
        ishod: req.body.ishod,
        termini: req.body.termini,
        dodatneInformacije: req.body.dodatneInformacije,
        labInfo: req.body.labInfo,
        projekatInfo: req.body.projekatInfo,
        ispitiVidljiv: false,
        labVidljiv: false,
        projekatVidljiv: false,
        predavaci: new mongoose.Types.DocumentArray<any>(0),
        ispiti: new mongoose.Types.DocumentArray<any>(0),
        lab: new mongoose.Types.DocumentArray<any>(0),
        predavanja: new mongoose.Types.DocumentArray<any>(0),
        projekat: new mongoose.Types.DocumentArray<any>(0),
        vezbe: new mongoose.Types.DocumentArray<any>(0)
    }

    predmet.findOne({sifraPredmeta: req.body.sifraPredmeta}, (err, pred) => {
        if (err)
            console.log(err);
        else
        {
            if(pred)
            {
                res.json({'status':false});
            }
            else
            {
                
                predmet.collection.insertOne(data);
                res.json({'status':true});
            }
        }
    });
});

router.route('/updateSubjectAdmin').post((req, res) => {
    let data = {
        naziv: req.body.naziv,
        sifraPredmeta: req.body.sifraPredmeta,
        tip: req.body.tip,
        godina: req.body.godina,
        semestar: req.body.semestar,
        odseci: req.body.odseci,
        fondCasova: req.body.fondCasova,
        espb: req.body.espb,
        cilj: req.body.cilj,
        ishod: req.body.ishod,
        termini: req.body.termini,
        dodatneInformacije: req.body.dodatneInformacije,
        labInfo: req.body.labInfo,
        projekatInfo: req.body.projekatInfo,
        ispitiVidljiv: req.body.ispitiVidljiv,
        labVidljiv: req.body.labVidljiv,
        projekatVidljiv: req.body.projekatVidljiv,
        predavaci: req.body.predavaci,
        ispiti: req.body.ispiti,
        lab: req.body.lab,
        predavanja: req.body.predavanja,
        projekat: req.body.projekat,
        vezbe: req.body.vezbe
    }

    if(req.body.staraSifraPredmeta != req.body.sifraPredmeta) //Korisnicko ime se promenilo - normalizacija baze level -999
    {
        predmet.findOne({sifraPredmeta: req.body.sifraPredmeta}, (err, user) => {
            if(err){
                console.log(err);
                res.json({'poruka':'Podaci su nisu ažurirani!'});
            }
            else
            {
                if(user)
                    res.json( res.json({'status':false}));
                else
                {

                    // { nastavnici: { $elemMatch: { predavac: "milo001"} } }
                    fajl.collection.updateMany(
                        {sifraPredmeta: req.body.staraSifraPredmeta}, 
                        {$set:{sifraPredmeta: req.body.sifraPredmeta, folder: req.body.sifraPredmeta}}
                    );

                    try {
                        if(fs.existsSync('./uploads/'+ req.body.staraSifraPredmeta)){
                            fs.renameSync('./uploads/'+ req.body.staraSifraPredmeta, './uploads/'+ req.body.sifraPredmeta);
                            console.log("Successfully renamed the directory.");
                        }
                      } catch(err) {
                        console.log(err);
                      }

                    korisnik.collection.updateMany(
                        {predmeti: req.body.staraSifraPredmeta},
                        {$set:{'predmeti.$': req.body.sifraPredmeta}}
                    );

                    planAngazovanja.collection.updateOne(
                        {sifraPredmeta: req.body.staraSifraPredmeta},
                        {$set:{sifraPredmeta: req.body.sifraPredmeta}}
                    );



                    obavestenjePredmet.collection.updateMany(
                        {sifraPredmeta: req.body.staraSifraPredmeta}, 
                        {$set:{'sifraPredmeta.$': req.body.sifraPredmeta}}
                    );

                    spisak.collection.updateMany(
                        {sifraPredmeta: req.body.staraSifraPredmeta}, 
                        {$set:{sifraPredmeta: req.body.sifraPredmeta}}
                    );


                    predmet.collection.updateOne(
                        {sifraPredmeta: req.body.staraSifraPredmeta}, 
                        {$set:{sifraPredmeta: req.body.sifraPredmeta}}
                    );
                    
                    res.json({poruka: 'Predmet uspesno azuriran!'});
                }
            }
        
        });


    }
    else
    {
        predmet.collection.updateOne({sifraPredmeta: req.body.sifraPredmeta}, {$set:data});
        res.json({poruka: 'Predmet uspesno azuriran!'});
    }

});


router.route('/deleteSubjectAdmin').post((req, res) => {

    fajl.collection.deleteMany({sifraPredmeta: req.body.sifraPredmeta});

    try{
        if(fs.existsSync('./uploads/'+ req.body.sifraPredmeta)){
            fs.rmdirSync('./uploads/'+ req.body.sifraPredmeta, { recursive: true });
            console.log("Successfully deleted the directory.");
        }
    }
    catch(err){
        console.log(err);
    }

    korisnik.collection.updateMany(
        {predmeti: req.body.sifraPredmeta}, 
        {$pull: {predmeti: req.body.sifraPredmeta}
    });

    planAngazovanja.collection.deleteOne({sifraPredmeta: req.body.sifraPredmeta});

    obavestenjePredmet.collection.updateMany(
        {sifraPredmeta: req.body.sifraPredmeta}, 
        {$pull: {sifraPredmeta: req.body.sifraPredmeta}}
    );

    spisak.collection.deleteOne({sifraPredmeta: req.body.staraSifraPredmeta});

    predmet.collection.deleteOne({sifraPredmeta: req.body.sifraPredmeta});

    res.json({poruka: 'Predmet uspesno izbrisan!'});

});


//Plan angazovanja

router.route('/registerEngagePlanAdmin').post((req, res) => {
    let data = {
        naziv: req.body.naziv,
        sifraPredmeta: req.body.sifraPredmeta,
        predavaci: new mongoose.Types.DocumentArray<any>(0),
        studenti: new mongoose.Types.DocumentArray<any>(0),
        grupe: new mongoose.Types.DocumentArray<any>(0),
        brojGrupa: req.body.brojGrupa

    }

    planAngazovanja.findOne({sifraPredmeta: req.body.sifraPredmeta}, (err, pred) => {
        if (err)
            console.log(err);
        else
        {
            if(pred)
            {
                res.json({'status':false});
            }
            else
            {
                
                planAngazovanja.collection.insertOne(data);
                res.json({'status':true});
            }
        }
    });
});

router.route('/updateEngagePlanAdmin').post((req, res) => {
    
    let data = {
        naziv: req.body.naziv,
        predavaci: req.body.predavaci,
        studenti: req.body.studenti,
        grupe: req.body.grupe,
    }

    console.log(req.body.predavaci);

    planAngazovanja.collection.updateOne({sifraPredmeta: req.body.sifraPredmeta}, {$set: data});

    predmet.collection.updateOne({sifraPredmeta: req.body.sifraPredmeta}, {$set:{predavaci: req.body.predavaci}});

    req.body.predavaci.forEach((element: string) => {
        korisnik.collection.updateOne({korime: element}, {$addToSet: {predmeti: req.body.sifraPredmeta}});
    });

    res.json({poruka: 'Plan agazovanja uspesno azuriran!'});


});


router.route('/deleteEngagePlanAdmin').post((req, res) => {
    
    planAngazovanja.collection.deleteOne({sifraPredmeta: req.body.sifraPredmeta});

    korisnik.collection.updateMany(
        {predmeti: req.body.sifraPredmeta},
        {$pull:{predmti: req.body.sifraPredmeta}}
    );

    res.json({poruka: 'Plan agazovanja uspesno izbrisan!'});


});


router.route('/changeUserPassword').post((req, res) => {
    

    korisnik.collection.updateOne(
        {korime: req.body.korime},
        {$set:{lozinka: req.body.novaLozinka, status:'aktivan'}}
    );

    res.json({poruka: 'Lozinka uspesno promenjena!'});


});


app.post('/registerOnSubjectListFile', upload.single('file'),function (req: any, res, next) {
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

    let _id = mongoose.Types.ObjectId(req.headers._id);
    spisak.collection.updateOne({_id: _id}, {$addToSet : { prijavljeni: req.headers.korime}});

 
});

router.route('/registerOnSubjectList').post((req, res) => {
    let _id = mongoose.Types.ObjectId(req.body._id);
    spisak.collection.updateOne({_id: _id}, {$addToSet : { prijavljeni: req.body.korime}});

    res.json({poruka: "Uspesno ste privaljeni na spisak"})
});









app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));