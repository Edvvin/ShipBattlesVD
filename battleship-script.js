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
        window.open("./battleship-setup.html", "_self");
    });

    //Setup page
});