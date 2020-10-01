const db = require("../app").getDB ;

class Candidate{
    constructor(name,address,mobileNo,dob,email,experience,resumeTitle,cLocation,pLocation,cEmployer,cDesignation,salary,education){
        this.name = name;
        this.address = address;
        this.mobileNo = mobileNo;
        this.dob = dob;
        this.email = email;
        this.experience = experience;
        this.resumeTitle = resumeTitle;
        this.cLocation = cLocation;
        this.pLocation = pLocation;
        this.cEmployer = cEmployer;
        this.cDesignation = cDesignation;
        this.salary = salary;
        this.education = education;
    }
    save(){
        const db = require("../app")() ;
        // console.log("----> " + db) ;
        return db.collection('candidates')
        .insertOne(this)
        .then( result => {
            console.log(result) ;
        } )
        .catch( err => {
            console.log(err) ;
        })
    }
    static uniqueEmail(email){
        const db = require("../app")() ;
        return db.collection("candidates").find({email}).next()
            .then( result => {
                if( result ){
                    console.log(email + " present") ;
                    return false;
                }
                else{
                    console.log(email + " absent") ;
                    return true ;
                }
                // console.log(result) ;
            } )
            .catch(err => {
                console.log(err) ;
            })
    }
}

module.exports = Candidate ;