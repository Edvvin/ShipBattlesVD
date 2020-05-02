var rowCnt=10, colCnt = 10;

function checkHit(i,j,boats){
    for(let k = 0; k < boats.length; k++)
        if(boats[k].r1<=i && i<=boats[k].r2 && boats[k].c1<=j && j<=boats[k].c2){
            return true;
        }
    return false;
}

function getBoatSize(boat){
    difRow = boat.r2 - boat.r1 + 1;
    difCol = boat.c2 - boat.c1 + 1;
    if(difRow == 1 && difCol <= 4){
        return difCol;
    }
    if(difCol == 1 && difRow <= 4){
        return difRow;
    }
    return -1;
}


//SetUp page

var GSmousePressed = false;
var GSrow;
var GScol;
var remaining = [4,3,2,1];
var placements = [[],[]];
var currPlayer = 1;

function checkBoat(boat, boats, remaining){
    if(getBoatSize(boat) < 0)
        return false;
    if(remaining[getBoatSize(boat)-1] == 0)
        return false;
    for(let i = boat.r1; i <= boat.r2; i++){
        for(let j = boat.c1; j <= boat.c2; j++){
            if(checkHit(i,j,boats)){
                return false;
            }
        }
    }
    return true;
}

function cellDownGS(row, col){
    GSmousePressed = true;
    GSrow = row;
    GScol = col;
    cellOverGS(row, col); 
}

function cellUpGS(row, col){
    GSmousePressed = false;
    var r1 = Math.min(row, GSrow);
    var r2 = Math.max(row, GSrow);
    var c1 = Math.min(col, GScol);
    var c2 = Math.max(col, GScol);

    var placement = {
        r1 : r1,
        r2 : r2,
        c1 : c1,
        c2 : c2
    }

    var okPlacement = checkBoat(placement, placements[currPlayer-1],remaining);
    
    if(okPlacement){
        placements[currPlayer-1] = placements[currPlayer-1].concat(placement);
        remaining[getBoatSize(placement)-1] -= 1;
        $("#smCnt").html(""+remaining[0]);
        $("#mdCnt").html(""+remaining[1]);
        $("#lgCnt").html(""+remaining[2]);
        $("#xlCnt").html(""+remaining[3]);
        if(remaining.reduce((a, b) => a + b) == 0){
            if(currPlayer == 2){
                //Next Phase
                localStorage.setItem("placements", JSON.stringify(placements));
                window.open("./battleship-game.html", "_self");
            }
            else{
                //Player Switch
                remaining = [4,3,2,1];
                $("#smCnt").html(""+remaining[0]);
                $("#mdCnt").html(""+remaining[1]);
                $("#lgCnt").html(""+remaining[2]);
                $("#xlCnt").html(""+remaining[3]);
                $("#CurrentPlayerGS").html(localStorage.getItem("P2Name"));
                $("#CurrentPlayerGS").css("color", "red");
                currPlayer = 2;
                for(let i = 0; i < rowCnt; i++){
                    for(let j = 0; j < colCnt; j++){
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "blue";
                    }
                }
            }
        }
    }
}



function cellOverGS(row, col){
    if(GSmousePressed){
        var r1 = Math.min(row, GSrow);
        var r2 = Math.max(row, GSrow);
        var c1 = Math.min(col, GScol);
        var c2 = Math.max(col, GScol);
        var placement = {
            r1 : r1,
            r2 : r2,
            c1 : c1,
            c2 : c2
        }
        var okPlacement = checkBoat(placement, placements[currPlayer-1],remaining);
        for(let i = 0; i < rowCnt; i++){
            for(let j = 0; j < colCnt; j++){
                if(r1<=i && i<=r2 && c1<=j && j<=c2){
                    if(okPlacement)
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "green";
                    else
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "red";
                }
                else{
                    if(checkHit(i,j,placements[currPlayer-1]))
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "green";
                    else
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "blue";

                }
            }
        }
    }
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

    //SetUp page
    
    $("#setUpGrid").ready(function() {
        for(var i=0; i < rowCnt; i++){
            $("#setUpGrid").append("<div class='gridRow'></div>");
        }
        for(var j=0; j < colCnt; j++){
            $(".gridRow").each(function(ind, elem){
               $(this).append("<div class='gridCell' id='GS"+ind+","+j+"' onmousedown='cellDownGS("+ind+","+j+")'\
                onmouseup='cellUpGS("+ind+","+j+")' onmouseover='cellOverGS("+ind+","+j+")'></div>"); 
            });
        }
        $("#smCnt").html(""+remaining[0]);
        $("#mdCnt").html(""+remaining[1]);
        $("#lgCnt").html(""+remaining[2]);
        $("#xlCnt").html(""+remaining[3]);
        $("#CurrentPlayerGS").html(localStorage.getItem("P1Name"));
        $("#CurrentPlayerGS").css("color", "blue");
    });

});