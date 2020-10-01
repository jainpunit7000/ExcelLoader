const express =  require("express") ;
const bodyParser = require('body-parser');
const path = require('path') ;
const multer = require("multer") ;
const mongodb = require("mongodb") ;
const mongoClient = mongodb.MongoClient ;

let _db = null ;

const PortalRoutes = require("./routes/portal") ;
const ErrorRoutes = require("./routes/error") ;

const app = express() ;

const fileStorage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,"excelFiles")
    },
    filename : (req,file,cb) => {
        cb(null,"current.xlsx")
    }
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage:fileStorage}).single('xlFile'));
app.use(express.static(path.join(__dirname,"/public"))) ;

app.set('view engine','ejs');
app.set('views','views') ;

app.use(PortalRoutes) ;

app.use(ErrorRoutes) ;
mongoClient.connect("mongodb+srv://punit:punit@main1.bhsyj.mongodb.net/KlimbInternProject?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then( client => {
        _db = client.db() ;
        console.log("mongoDB is Connected") ;
        app.listen(3000) ;
        console.log("server is running") ;
    } )
    .catch( err => {
        console.log(err) ;
    } ) ;

const getDB = () => {
    return _db ;
}

module.exports = getDB ;