const readXlsxFile = require('read-excel-file/node');
const fs = require("fs") ;
const Candidate = require("../models/candidate") ;

exports.getHome = (req,res,next) => {
    res.render("home") ;
} ;

exports.getSuccess = (req,res,next) => {
    const data = req.params.data ;
    // console.log(data) ;
    const inserted = data.split("-")[0] ;
    const total = data.split("-")[1] ;
    res.render("success",{
        inserted : inserted,
        total : total
    }) ;
} ;


exports.postUpload = (req,res,next) => {
    // const xls = req.file ;
    // const fileName = xls.originalname ;
    // const extension = fileName.split(".")[1].trim() ;
    // // console.log(fileName) ;
    // if( extension == "xls" || extension == "xlsx"  ){
        
        readXlsxFile("./excelFiles/current.xlsx")
        .then((rows) => {
            // console.log(rows) ; 
            //delete xls file
            fs.unlink("./excelFiles/current.xlsx", (err) => {
                if( err ){
                    console.log(err) ;
                }
            })
            const dataFormat = [
            'name of the candidate',
            'postal address',
            'mobile no.',
            'date of birth',
            'email',
            'work experience',
            'resume title',
            'current location',
            'preferred location',
            'current employer',
            'current designation',
            'annual salary',
            'education'
        ]
        if( rows[0].length != 13 ){
            res.redirect("/fileError") ;
        } else {
            for(let i=0;i<13;++i){
                if( rows[0][i].toLowerCase() !== dataFormat[i] )
                    res.redirect("/fileError") ;
            }
            let insertedRows=0;
            for(let i=1;i<rows.length;++i){
                if( rows[i].length != 13 )
                    continue ;
                let name = rows[i][0];
                let email = rows[i][4];
                if( !name || !email )
                    continue ;
                if( !Candidate.uniqueEmail(email) ){
                    console.log("shpiing") ;
                    continue ;
                }
                let address = rows[i][1];
                let mobileNo = rows[i][2];
                let dob = rows[i][3];
                let experience = rows[i][5];
                experience = {
                    years : experience.split(" ")[0] || "0" ,
                    months : experience.split(" ")[2] || "0" 
                }
                let resumeTitle = rows[i][6];
                let cLocation = rows[i][7];
                let pLocation = rows[i][8];
                let cEmployer = rows[i][9];
                let cDesignation = rows[i][10];
                let salary = rows[i][11].split(" ")[1];
                salary = parseFloat(salary) ;
                salary = parseInt(salary*100000) ;
                let education = rows[i][12].split(",");
                const candidate = new Candidate(
                    name,address,mobileNo,dob,email,experience,resumeTitle,cLocation,pLocation,cEmployer,cDesignation,salary,education
                ) ;
                insertedRows++ ;
                // candidate.save()
                //     .then(result => {
                //         // console.log(result) ;
                //     })
                //     .catch(err => {
                //         console.log(err) ;
                //     });
            }
            res.redirect("/success/" + insertedRows + "-" + (rows.length-1) ) ;
        }
        })
    .catch( err =>{
        console.log(err)
    }) ;
} ;

