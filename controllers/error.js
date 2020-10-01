exports.get404 = (req,res,next) => {
    res.render("404") ;
} ;

exports.getError = (req,res,next) => {
    res.render("fileError") ;
} ;