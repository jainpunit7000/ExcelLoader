$(document).ready(function(){
    $('input[type="file"]').change(function(e){
        // let fileName = e.target.files[0] ;
        const extension = e.target.files[0].name.split(".")[1] ;
        if( extension == "xls" || extension == "xlsx" ){
            document.getElementById("fileDesc").innerHTML = e.target.files[0].name ;
            document.getElementById("btn").style.display = "inline";
            document.getElementById("fileDesc").style.color = "#0C6980" ;
        } else {
            document.getElementById("fileDesc").innerHTML = e.target.files[0].name +  "<br>Please Upload a .xlsx or .xls file" ;
            document.getElementById("fileDesc").style.color = "red" ;
            document.getElementById("btn").style.display = "none";
        }
    });
});
