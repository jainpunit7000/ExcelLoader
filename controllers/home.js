const readXlsxFile = require('read-excel-file/node');
const fs = require("fs") ;
const Candidate = require("../models/candidate") ;
const each = require('async-each-series');


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
        readXlsxFile("./excelFiles/current.xlsx")
        .then((rows) => {
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
            ///////////
            // const data = [] ;
            // for(let i=1;i<rows.length;++i)
            //     data.push(rows[i]) ;
            // let inserts=0 ;
            // console.log("starting") ;
            // each(data, (ele,next) => {
            //     Candidate.uniqueEmails([ele[4]])
            //         .then( result => {
            //             console.log(result) ;
            //             if( !result ){
            //                 let name = ele[0];
            //                 let email =  ele[4];
            //                 if( !name || !email )
            //                     return ;
            //                 let address = ele[1];
            //                 let mobileNo = ele[2];
            //                 let dob = ele[3];
            //                 let experience = ele[5];
            //                 experience = {
            //                     years : experience.split(" ")[0] || "0" ,
            //                     months : experience.split(" ")[2] || "0" 
            //                 }
            //                 let resumeTitle = ele[6];
            //                 let cLocation = ele[7];
            //                 let pLocation = ele[8];
            //                 let cEmployer = ele[9];
            //                 let cDesignation = ele[10];
            //                 let salary = ele[11].split(" ")[1];
            //                 salary = parseFloat(salary) ;
            //                 salary = parseInt(salary*100000) ;
            //                 let education = ele[12].split(",");
            //                 const candidate = new Candidate(
            //                     name,address,mobileNo,dob,email,experience,resumeTitle,cLocation,pLocation,cEmployer,cDesignation,salary,education
            //                 )
            //                 console.log(candidate) ;
            //                 inserts++ ;
            //                 candidate.save()
            //                     .then( result => {
            //                         // console.log(result) ;
            //                     } )
            //                     .catch( err => {
            //                         console.log(err) ;
            //                     } )
            //             }
            //         })
            //         .catch(err => {
            //             console.log(err) ;
            //         })
            //     next() ;
            // }, (err) => {
            //     res.redirect("/success/" + inserts + "-" + (rows.length-1) ) ;
            // } )

            ///////////////

            const unqRows = [] ;
            const unqEmails = [] ;
            for(let i=1;i<rows.length;++i){
                if( rows[i].length != 13 )
                    continue ;
                let name = rows[i][0];
                let email = rows[i][4];
                if( !name || !email )
                    continue ;
                let unique = true ;
                for(let j=0;j<unqEmails.length;++j){
                    if( email == unqEmails[j] ){
                        unique = false ;
                        break ;
                    }
                }
                if( !unique )
                    continue ;
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
                unqEmails.push(email) ;
                unqRows.push([name,address,mobileNo,dob,email,experience,resumeTitle,cLocation,pLocation,cEmployer,cDesignation,salary,education]) ;
            }
            Candidate.uniqueEmails(unqEmails)
            .then( matches => {
                // console.log(unqEmails) ;
                // console.log(matches) ;
                let insertedRows = unqEmails.length - matches.length ;
                if( insertedRows <= 0 ) 
                    insertedRows = 0 ;
                for(let i=0;i<unqEmails.length;++i){
                    let canInsert = true ;
                    for(let j=0;j<matches.length;++j){
                        if( unqEmails[i] == matches[j].email ){
                            canInsert = false ;
                            break ;
                        }
                    }
                    if( !canInsert )
                        continue ;
                    const candidate = new Candidate(
                        ...unqRows[i]
                    ) ;
                    console.log(unqRows[i]) ;
                    console.log(candidate) ;
                    candidate.save()
                        .then(result => {
                            // console.log(result) ;
                        })
                        .catch(err => {
                            console.log(err) ;
                        });
                }
                res.redirect("/success/" + insertedRows + "-" + (rows.length-1) ) ;
                    // console.log(matches) ;
                } )
            .catch( err => {
                console.log(err) ;
            })
            
        }
        })
    .catch( err =>{
        console.log(err)
    }) ;
} ;

