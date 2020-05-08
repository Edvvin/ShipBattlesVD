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

function checkClose(i, j, boats){
    for(let k = 0; k < boats.length; k++)
        if(boats[k].r1-1<=i && i<=boats[k].r2+1 && boats[k].c1-1<=j && j<=boats[k].c2+1){
			//Add this code if you wish to be able to make ships touch diagonally
			//if((boats[k].r1-1==i || i==boats[k].r2+1) && (boats[k].c1-1==j || j==boats[k].c2+1)) 
				//continue;
            return true;
        }
    return false;
}

function checkBoat(boat, boats, remaining){
    if(getBoatSize(boat) < 0)
        return false;
    if(remaining[getBoatSize(boat)-1] == 0)
        return false;
    for(let i = boat.r1; i <= boat.r2; i++){
        for(let j = boat.c1; j <= boat.c2; j++){
            if(checkClose(i,j,boats)){
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
        c2 : c2,
		lives: (r2 - r1 + 1)*(c2 - c1 + 1)
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
                $("#mdCnt").html(""+remaining[1]);
                $("#lgCnt").html(""+remaining[2]);
                $("#xlCnt").html(""+remaining[3]);
                $("#CurrentPlayerGS").html(localStorage.getItem("P2Name"));
                $("#CurrentPlayerGS").css("color", "red");
                currPlayer = 2;
                for(let i = 0; i < rowCnt; i++){
                    for(let j = 0; j < colCnt; j++){
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "MediumAquaMarine";
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
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "SaddleBrown";
                    else
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "red";
                }
                else{
                    if(checkHit(i,j,placements[currPlayer-1]))
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "SaddleBrown";
                    else
                        document.getElementById("GS"+i+","+j).style.backgroundColor = "MediumAquaMarine";

                }
            }
        }
    }
}

// Game Page
var shots = [[],[]];
var boatCnt = [10, 10];
var names;
function cellClickG(row, col){
	for(let k = 0; k < shots[currPlayer - 1].length; k++){
		if(shots[currPlayer - 1][k].r == row && shots[currPlayer - 1][k].c == col)
			return;
	}
	shot = {r:row, c:col}
	shots[currPlayer-1] = shots[currPlayer-1].concat(shot);
	if(!checkHit(row, col, placements[2 - currPlayer])){
		boardRedraw();
		alert("Player be switchin'");
		currPlayer = 3 - currPlayer;
		$("#PName").html("Shootin': " + names[currPlayer-1]);
		let colors = ["blue", "red"];
		$("#PName").css("color",colors[currPlayer-1]);
	}
	else{
		placements[2 - currPlayer].forEach(b => {
			if(b.r1 <= row && row <= b.r2 && b.c1 <= col && col <= b.c2){
				b.lives -= 1;
				if(b.lives == 0)
					boatCnt[2 - currPlayer] -= 1;
				return;
			}
		});
		if(boatCnt[2 - currPlayer]==0){
			//Victory
			boardRedraw();
			alert("" + names[2 - currPlayer] + " be walking the plank! " +
				names[currPlayer -1] + " won all the booty with " + boatCnt[currPlayer -1] + " ship to sparrre!");
			window.open("./battleship-welcome.html", "_self");
		}
	}
	boardRedraw();
}

function boardRedraw(){
	for(let i = 0; i < rowCnt; i++){
		for(let j = 0; j < colCnt; j++){
			document.getElementById("g"+i+","+j)
				.innerHTML = "";
			document.getElementById("G"+i+","+j)
				.innerHTML = "";

			document.getElementById("G" + i + "," + j).style.backgroundColor = "MediumAquaMarine";
			//Draw MyBoardCell
			if(checkHit(i,j,placements[currPlayer-1])){
				document.getElementById("g"+i+","+j).style.backgroundColor = "SaddleBrown";
			}
			else{
				document.getElementById("g"+i+","+j).style.backgroundColor = "MediumAquaMarine";
			}
		}
	}

	// Enemy Shots
	for(let k = 0; k < shots[2-currPlayer].length; k++){
		document.getElementById("g"+shots[2-currPlayer][k].r+","+shots[2-currPlayer][k].c)
			.innerHTML = "<img src='./battleship-assets/x.png' class='smShot'>";
	}
	
	// My Shots
	for(let k = 0; k < shots[currPlayer - 1].length; k++){
		if(checkHit(shots[currPlayer - 1][k].r, shots[currPlayer - 1][k].c, placements[2-currPlayer])){
			document.getElementById("G" + shots[currPlayer - 1][k].r + "," + shots[currPlayer - 1][k].c).style.backgroundColor = "SaddleBrown";
		}
		document.getElementById("G"+shots[currPlayer - 1][k].r+","+shots[currPlayer - 1][k].c)
			.innerHTML = "<img src='./battleship-assets/x.png' class='shot'>";
	}

	placements[2 - currPlayer].forEach(b => {
		if(b.lives == 0){
			for(let i = b.r1; i <= b.r2; i++)
				for(let j = b.c1; j <= b.c2; j++)
					document.getElementById("G"+i+","+j)
						.innerHTML = "<img src='./battleship-assets/ded.png' class='shot'>";
		}
	});

	placements[currPlayer - 1].forEach(b => {
		if(b.lives == 0){
			for(let i = b.r1; i <= b.r2; i++)
				for(let j = b.c1; j <= b.c2; j++)
					document.getElementById("g"+i+","+j)
						.innerHTML = "<img src='./battleship-assets/ded.png' class='smShot'>";
		}
	});

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
		if($("#setUpGrid").length){
			for(var i=0; i < rowCnt; i++){
				$("#setUpGrid").append("<div class='gridRow'></div>");
			}
			$(".gridRow").each(function(ind, elem){
				$(this).append("<div class='headCell'>"+(ind+1)+"</div>"); 
			});
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
		}
    });

    //Game page

    $("#gameGrids").ready(function() {
		if($("#gameGrids").length){
			placements = localStorage.getItem("placements");
			placements = JSON.parse(placements);
			names = [localStorage.getItem("P1Name"), localStorage.getItem("P2Name")];
			$("#PName").html("Shootin': " + names[currPlayer-1]);
			for(var i=0; i < rowCnt; i++){
				$("#EnemyBoard").append("<div class='gridRow'></div>");
				$("#MyBoard").append("<div class='smGridRow'></div>");
			}
			$(".gridRow").each(function(ind, elem){
				$(this).append("<div class='headCell'>"+(ind+1)+"</div>"); 
			});
			$(".smGridRow").each(function(ind, elem){
				$(this).append("<div class='smHeadCell'>"+(ind+1)+"</div>"); 
			});
			for(var j=0; j < colCnt; j++){
				$(".gridRow").each(function(ind, elem){
					$(this).append("<div class='gridCell' id='G"+ind+","+j+"' onclick='cellClickG("+ind+","+j+")'></div>"); 
				});
				$(".smGridRow").each(function(ind, elem){
					$(this).append("<div class='smGridCell' id='g"+ind+","+j+"'></div>"); 
				});
			}
			boardRedraw();

		}
    });

});
