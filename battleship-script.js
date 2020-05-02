var rowCnt=10, colCnt = 10;

function cellClickGameSetup(row, col){
    console.log("hello world");
}

$("document").ready(function(){

    //Welcome Page
    $("#NameBtn").click(function () {
        let P1Name = $("#P1Name").val();
        let P2Name = $("#P2Name").val();
        let NameCheckExp = /^\w{3,15}$/;
        if(!NameCheckExp.test(P1Name) || !NameCheckExp.test(P2Name)){
            alert("Names should have between 3 and 15 characters which are letters, digits or _")
            return;
        }
        localStorage.setItem("P1Name", P1Name);
        localStorage.setItem("P2Name", P2Name);
        localStorage.setItem("welcomed", true);
        window.open("./battleship-setup.html", "_self");
    });

    //Setup page
    
    $("#setUpGrid").ready(function() {
        for(var i=0; i < rowCnt; i++){
            $("#setUpGrid").append("<div class='gridRow'></div>");
        }
        for(var j=0; j < colCnt; j++){
            $(".gridRow").append("<div class='gridCell' onclick='cellClickGameSetup()'></div>");
        }
    });

});