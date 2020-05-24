const express= require('express');
const app= express();
const morgan = require('morgan');
const bodyparser=require('body-parser');
const multer= require('multer');
const mongoose= require('mongoose')
const article= require('./model/article')
const date=require('date-and-time')
var ObjectId = require('mongodb').ObjectID;



app.use('/upload', express.static('upload'));
app.use('/modifier/upload', express.static(__dirname + '/upload'));

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/admin/assets', express.static(__dirname + '/assets'));
app.use('/modifier/assets', express.static(__dirname + '/assets'));

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
app.use(morgan('dev'));
let datepost;
const storage = multer.diskStorage({
        destination : function(req, file, cb){
            cb(null, './upload/');
        },
        filename: function (req, file, cb){
            datepost = date.format(new Date(), 'YY-MM-DD HH-mm-ss SSS');
           cb(null, datepost+file.originalname);
        }
});
const upload = multer({storage: storage});


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Origin",
    "Origin, X-Requested-With, Content-Type, Accept, Authorizatio"
    );
    if (req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE,PATH,GET ');
        return res.status(200).json({});
    }
    next(); 
});

//8NfYl1TOWhyZfeLt
mongoose
.connect('mongodb+srv://noulahuser:8NfYl1TOWhyZfeLt@noulahdatabase-pqzpw.mongodb.net/test?retryWrites=true&w=majority',
{useNewUrlParser : true, useUnifiedTopology: true  }, (error)=>{
 console.log(error);
})
//mongoose.connect("mongodb://localhost:27017/Noulahdatabase", {useNewUrlParser : true, useUnifiedTopology: true});

//mongosse.Promise = global.Promise;

app.get('/',(req,response)=>{
      response.render('client/index')
});

app.get('/index',(req,response)=>{
    response.render('client/index')
});

app.get('/blog',(req,response)=>{

    article.find()
    .select('link titre message lienImage mediatype date')
    .exec()
    .then( docs=>{
        docs=docs.reverse()
        var firstelement;
        var i=0
        for (i=0; i< docs.length; i++){ 
            if (i ==0 ){
               firstelement=docs[0]
            }
        }
      response.render('client/blog', {articles:docs, firstelement: firstelement})
    })
    .catch( err=>{
        console.log(err);
        response.status(500);
    });

});

app.get('/contact',(req,response)=>{
    response.render('client/contact')
});

app.get('/apropos',(req,response)=>{
    response.render('client/apropos')
});

app.get('/dashboard',(req,response)=>{

    article.find()
    .select('link titre message lienImage mediatype date')
    .exec()
    .then( docs=>{
      response.render('admin/dashboard', {articles:docs.reverse()})
    })
    .catch( err=>{
        console.log(err);
        response.status(500);
    });
});

app.get('/modifier/:id', (req, response)=>{
    var id= req.params.id

    article.findById({_id :ObjectId(id)})
    .select('_id link titre message lienImage mediatype date')
    .exec()
    .then( docs=>{
        article.find()
        .select('_id link titre message lienImage mediatype date')
        .exec()
        .then( doc => {
            response.render('admin/dashboard', {articles:doc, modi:docs })
        })
        .catch( err=>{
            console.log(err)
            response.status(500);
        })
    })
    .catch( err=>{
        console.log(err);
        response.status(500);
    });
})

app.post('/modifier', (req, res)=>{

    console.log(req.body)
    //res.redirect('/dashboard')

})

app.get('/supprimer/:id', (req, response)=>{
    article.findByIdAndDelete(req.params.id)
    .then( ()=>{
        response.redirect('/dashboard')
    })
    .catch(error=>{
        console.log(error);
    })
})


app.post('/admin/ajouter', upload.single("postmedia"), (req, res, next)=>{
    let chemin="";
    let mediatype="false";
    if(req.file===undefined){
        chemin=false;
    }else{
        mediatype=req.file.mimetype;
        chemin=req.file.path;
    }
    const post = new article({
        _id : new mongoose.Types.ObjectId,
        link: req.body.link,
        titre : req.body.titre,
        message: req.body.message,
        lienImage: chemin,
        mediatype: mediatype,
        date: datepost
    });
    post.save()
    .then( ()=>{
        res.redirect('/dashboard')
    })
    .catch(err=>{
        console.log(err)
    });

})









//gestion des erreus dans les urls
app.use((req, res, next)=>{
    const error = new Error('Page Non trouvee');
    error.status=404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports=app;
