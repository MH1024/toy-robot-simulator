window.onload = function(){
    initAll(); 
    displayReport.displayPlace();
};

function initAll(){
    DrawTable();
    document.getElementById("start-btn").addEventListener("click",getCommand); 
    document.getElementById("reset").addEventListener("click",refeshPage);
    document.getElementById("example-1").addEventListener("click",exampleOne);
    document.getElementById("example-2").addEventListener("click",exampleTwo);
    document.getElementById("example-3").addEventListener("click",exampleThree);
    document.getElementById("example-4").addEventListener("click",exampleFour);
    document.getElementById("example-5").addEventListener("click",exampleFive);
    document.getElementById("example-6").addEventListener("click",exampleSix);  
};

function refeshPage(){
    document.location.reload();
};

/* Command to control robot */
function getCommand(){
    
    var readCommand = document.getElementById("inputCommand").value;
    displayReport.resetReport();
    if (readCommand ==''){
        var isEmpty = "Please input some Command to start"
        displayReport.alertError(isEmpty);  
    } else {
        displayReport.resetReport();
        processCommand(readCommand);
    }

};

function processCommand(command){
    var arr = command.split('\n').filter(function(n){return n});
    var validateCommand = [ "MOVE", "LEFT", "RIGHT", "REPORT"];
    var regex = /^(PLACE)\s(\d+),(\d+),(NORTH|SOUTH|EAST|WEST)+$/;

    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if(splitCommand(element,index) === false) {
            break;  
        }
    }

    function splitCommand(value,key){
            var formCommand = value.trim().toUpperCase();
           if (validateCommand.indexOf(formCommand) > -1){
                validateFunc.isActiveCommand(formCommand);          
           } else if(formCommand.match(regex)) {
                validateFunc.isPlaceCommand(formCommand);
           } else {
                validateFunc.isErrorCommand();
                return false;
           }

    }
  
}; 
           
var validateFunc ={
    isErrorCommand: function(){
        var error = "Invalid Input, Please try again."
        displayReport.alertError(error);
    },
    isOnTable: function (numX,numY) {
        let min = 0;
        let max = 5;
        if ((numX >= min && numX < max) && (numY >= min && numY < max)){
            return true;
        } else{
            return false;
        }
    },
    isActiveCommand: function(command){   
        ctrlRobot[(command).toLowerCase()]();
    },
    isPlaceCommand: function(command){
        let place = command.split(',');
        let preX = place[0].split(' ');
        let setX = parseInt(preX[1]);
        let setY = parseInt(place[1]);
        let setF = place[2];
        this.isPositionCommand(setX,setY,setF);
    },
    isPositionCommand: function (numX,numY,dirF) {
        
        var robot_on_table = Robot.creatNew();
        if (this.isOnTable(numX,numY)){
                robot_on_table.setRobotPosition(numX,numY,dirF);
        } else {
            var error = "Invalid position, Please input the valid X and Y value."
            displayReport.alertError(error);
            robot_on_table.resetRobot();
        }}
};

        
var displayReport = {
    displayPlace: function(){
        this.displayRobotReport = document.getElementById("display-report");
    },
    resetReport: function(){
        this.displayRobotReport.innerHTML = '';
    },
    alertError: function(error){
        this.displayRobotReport.innerHTML = '<span class="error">' + error + '<br>' + '</span>';
    },
    displayPosition: function(x,y,facing){
    this.displayRobotReport.innerHTML = '<ul id="result" class="result">' + '<li><span class="badge">X: </span>' + x + '</li><li>' + '<span class="badge">Y: </span>' + y + '</li><li>' + '<span class="badge">Facing: </span>' + facing + '</li></ul>'; 
    }
};
var Robot = {
    position:{
        x : 0,
        y : 0,
        facing : "NORTH"
    },
    creatNew:function(){
        var robot = {};
        robot.setRobotPosition = function (setX,setY,setF) {
            Robot.position.x = setX;
            Robot.position.y = setY;
            Robot.position.facing = setF;
        };
        robot.moveRobotPosition = function (setX,setY) {
            Robot.position.x = setX;
            Robot.position.y = setY;
        };
        robot.turnRobotDirection = function (dirF) {
            Robot.position.facing = dirF
        };
        robot.getRobotPosition = function () {
            return Robot.position;
        };
        robot.reportRobotPosition = function() {
            var _x = Robot.position.x;
            var _y = Robot.position.y;
            var _facing = Robot.position.facing;
            displayReport.displayPosition(_x,_y,_facing);
            canvasRobot.clearTable();
            canvasRobot.origin(_x,_y,_facing);
              
        };
        robot.resetRobot = function () {
            Robot.position.x = 0;
            Robot.position.y = 0;
            Robot.position.facing = "NORTH";
        }
        return robot;
    }  
};

var ctrlRobot ={
    build : function(){
        return Robot.creatNew();
    },
    move : function(){
        var robot_move = null;
        robot_move = this.build().getRobotPosition();
        var robot_stay = {
            x: robot_move.x,
            y: robot_move.y,
            f: robot_move.facing
        };   
        let facingObj = {
            'NORTH': forwardN,
            'EAST': forwardE,
            'SOUTH': forwardS,
            'WEST': forwardW
        };
        if (robot_move.facing in facingObj){
            facingObj[robot_move.facing]();
        }
        function forwardN(){
            robot_move.y++;
        };
        function forwardE(){
            robot_move.x++;
        };
        function forwardS(){
            robot_move.y--;
        };
        function forwardW(){
            robot_move.x--;
        };
        if (validateFunc.isOnTable(robot_move.x, robot_move.y)){
            this.build().moveRobotPosition(robot_move.x, robot_move.y);
            canvasRobot.clearTable();
            canvasRobot.origin(robot_move.x,robot_move.y,robot_stay.f);
        } else {
            robot_move = null
            this.build().moveRobotPosition(robot_stay.x, robot_stay.y);
            var error = "Robot will Falling, Stop!"
            displayReport.alertError(error);
            canvasRobot.clearTable();
            canvasRobot.origin(robot_stay.x,robot_stay.y,robot_stay.f);
            return false;
        }
    },
    left : function(){
        let left_turn = -1;
        this.turnRobot(left_turn);
    },
    right : function(){
        let right_turn = 1; 
        this.turnRobot(right_turn);
    },
    report : function(){
        var robot_report = this.build();
        robot_report.reportRobotPosition();
    },
    turnRobot: function(turn){
        var robot_turn = this.build().getRobotPosition();
        
        let dir_array = new Array("NORTH", "EAST", "SOUTH", "WEST");
        let turning = dir_array.indexOf(robot_turn.facing);
        turning += turn;
        if (turning === -1){
            turning = 3;
        } 
        if ( turning === 4){
            turning = 0;
        } 
        let robot_turned = dir_array[turning];
        this.build().turnRobotDirection(robot_turned);
        canvasRobot.clearTable();
        canvasRobot.origin(robot_turn.x,robot_turn.y,robot_turned);
    }
}
/* test by example */
function exampleOne(){
    let test = "PLACE 0,0,NORTH\nMOVE\nREPORT";
    changeCommandInput(test);
}
function exampleTwo(){
    let test = "PLACE 0,0,NORTH\nMOVE\nRIGHT\nMOVE\nMOVE\nRIGHT\nREPORT";
    changeCommandInput(test);
}
function exampleThree(){;
    let test = "PLACE 1,2,EAST\nMOVE\nMOVE\nLEFT\nMOVE\nREPORT";
    changeCommandInput(test);
}
function exampleFour(){
    let test = "PLACE 0,0,SOUTH\nMOVE\nLEFT\nMOVE\nREPORT";
    changeCommandInput(test);
}
function exampleFive(){
    let test = "PLACE 0,0,NORTH\nMOVE\nMOVE\nMOVE\nRIGHT\nMOVE\nREPORT";
    changeCommandInput(test);
}
function exampleSix(){
    let test = "PLACE 0,0,EAST\nMOVE\nLEFT\nMOVE\nREPORT";
    changeCommandInput(test);
}
function changeCommandInput(text){
    document.getElementById('inputCommand').value = text;
}

/*  draw table for place toy robot */
function DrawTable() {

    var table=document.getElementById("table");
    var tb=table.getContext("2d");
    tb.strokeStyle="#BFBFBF";    
    var each = 100;
    var side = 50;
    var tablesize = 600;
    for(i=0;i<6;i++) {

      tb.moveTo(side,side+i*each);

      tb.lineTo((tablesize-side),side+i*each);

      tb.stroke(); 

      tb.moveTo(side+i*each,side);

      tb.lineTo(side+i*each,(tablesize-side));

      tb.stroke();

    }
    canvasRobot.origin(0,0,"NORTH");
}

var canvasRobot = {
    
    origin: function(robotX,robotY,robotF) {
        var tablesize= 600;
        var side = 60;
        var robotArm = 20;
        var robotSize = 80
        var emptySpace = 40
        var h=robotY;
        var i=robotX;
        this.drawRobotBody(i*100+side, (tablesize-(h*100+side+robotSize)), robotSize, robotSize);   

        var ArmE_x = i*100+emptySpace+side;
        var ArmE_y = tablesize-(h*100+side+emptySpace+robotArm);
        let facingObj = {
            'NORTH': faceN,
            'EAST': faceE,
            'SOUTH': faceS,
            'WEST': faceW
        };
        if (robotF in facingObj){
            facingObj[robotF]();
        }
        function faceN(){
            canvasRobot.drawRobotArm(ArmE_x-robotArm,ArmE_y-robotArm,emptySpace,emptySpace );
        };
        function faceE(){
            canvasRobot.drawRobotArm(ArmE_x,ArmE_y,emptySpace,emptySpace);
        };
        function faceS(){
            canvasRobot.drawRobotArm(ArmE_x-robotArm,ArmE_y+robotArm,emptySpace,emptySpace );
        };
        function faceW(){
            canvasRobot.drawRobotArm(ArmE_x-emptySpace,ArmE_y,emptySpace,emptySpace );
        };
    },
    clearTable: function(){
        var robot2d=table.getContext("2d");
        var tablesize = 600;
        for (m=0;m<5;m++){
            for(i=0;i<5;i++) {
                var side = 60;
                robotSize = 80;
                var cleanX = i*100+side;
                var cleanY = tablesize-(m*100+side+robotSize);
                robot2d.clearRect(cleanX,cleanY,robotSize,robotSize);
            }
        }
    },
    drawRobotBody: function(fillX,fillY,width,height){
        var robot2d=table.getContext("2d");
        robot2d.fillStyle = "#2E81CE"; 
        robot2d.fillRect(fillX, fillY, width, height);
    },
    drawRobotArm: function(clearX,clearY,width,height){
        var robot2d=table.getContext("2d");
        robot2d.clearRect(clearX, clearY, width, height);
    }
}

