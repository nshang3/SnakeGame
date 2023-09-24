//SETTING UP THE CANVAS//
var canvas= document.getElementById("canvas");
var ctx= canvas.getContext("2d");

var width= canvas.width;
var height= canvas.height;
//get the canvas' width and height and assign them to width and height

//start with the grid
//have every grid square be represented as a block that is 10x10 pixels thus convert the pixel grid to a block grid
var blockSize= 10;
var widthInBlocks= width/blockSize;
var heightInBlocks= height/blockSize;

var drawBorder= function(){
    //ctx.fillRect(x, y, width, height)
    ctx.fillStyle= "Gray";
    
    ctx.fillRect(0, 0, width, blockSize);//top x=0, y=0, width=400, height=10
    
    ctx.fillRect(0, height-blockSize, width, blockSize);//bottom x=0, y=390, width=400, height= 10
    
    ctx.fillRect(0, 0, blockSize, height);//left x=0, y=0, width=10 height=400 
    
    ctx.fillRect(width-blockSize, 0, blockSize, height);//right x=390, y=0, width= 10, height=400
    //have to keep in mind of the blockSize since it has a thickness
}


//SETTING THE SCORE TO 0//


var score= 0;

var drawScore= function(){
    ctx.font= "20px Courier";
    ctx.fillStyle= "Black";
    ctx.textAlign= "left";//the horizontal position of text relative to baseline
    ctx.textBaseline= "middle";//baseline, where the text's startpoint is
    ctx.fillText("Score: " +score, 20, 20); //not 0, 0 since your border is there
}

var gameOver= function(){
    clearInterval(intervalId);//setInterval() method returns a interval Id and we store that id value into variable intervalId
    //clearInterval Id will then read a specific interval id and stop the setInterval
    ctx.font= "60px Courier";
    ctx.fillStyle= "Black";
    ctx.textAlign= "center";
    ctx.textBaseline= "middle";
    ctx.fillText("Game Over", width/2, height/2);
}


//SETTING THE BLOCK OBJECT//


var circle = function (x, y, radius, fillCircle) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);//false means clockwise
        if (fillCircle) {//if parameter holds true, essentially if has parameter that must be met to execute bracketed function
          ctx.fill();
          } else {
          ctx.stroke();
          }
        };

var Block = function(col, row){
//Block constructor here is an object constructor, creates instances of this Block object(a little different than java).
    this.col= col;
    this.row= row;//assign properties to new objects using .this which refers to the new objects name
};

Block.prototype.drawSquare= function(color){
    //prototype is like inheritance, as prototype is an object and Block will inherit prototypes methods such as drawSquare
    var x= this.col *blockSize;//multiply it by 10 as the parameter intially accepts 1 px 
    var y= this.row *blockSize;
    ctx.fillStyle= color;
    ctx.fillRect(x, y, blockSize, blockSize );
};

Block.prototype.drawCircle= function(color){
    var centerX= this.col* blockSize + blockSize/2;//must have blockSize/2 to get center of a 10x10 square
    var centerY= this.row* blockSize + blockSize/2;
    ctx.fillStyle= color;
    circle(centerX, centerY, blockSize/2, true);
};

Block.prototype.equal= function (otherBlock){//compares 2 Block objects' properties col and row
    return this.col === otherBlock.col && this.row === otherBlock.row;
    //this is a boolean statement and will return true or false based on if the conditions are met
};


//CREATING THE APPLE OBJECT//
    
    
    var Apple = function() {
        this.position = new Block(10, 10);
    };
    
    Apple.prototype.draw = function() {
        this.position.drawCircle("LimeGreen");
    };
    
    Apple.prototype.move = function() {
        var randomCol = Math.floor(Math.random() *(widthInBlocks-2)) +1;
        var randomRow = Math.floor(Math.random() * (heightInBlocks-2)) +1;
        this.position= new Block (randomCol, randomRow);
    };
    
    
//CREATING THE SNAKE USING BLOCK OBJECTS//


var Snake= function(){
    
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];//creating an array that has unnamed Block objects with  col and row properties
    
    this.direction= "right";//when the program runs, the direction of the snake will be to the right
    this.nextDirection= "right";//for user input's numbered input i.e 39=right
    //these properties are for the strings that represent the numbered input
}

Snake.prototype.drawSnake= function (){
    
    for (let i=0; i< this.segments.length; i++ ){
        this.segments[i].drawSquare("Blue");
        //the array has Block constructors which in essence does this, unnamed.drawSquare(blue) 
    }
}

Snake.prototype.move= function(){
    var head= this.segments[0];
    var newHead;
    
    this.direction= this.nextDirection;//user input taken for nextDirection
    
    if (this.direction === "right") {
        newHead= new Block (head.col + 1, head.row);//creating a another Block object using pre defined Block objects
    }
    else if (this.direction === "left") {
        newHead= new Block (head.col-1, head.row);
    }
    else if (this.direction === "up") {
        newHead= new Block (head.col, head.row-1);
    }
    else if (this.direction === "down") {
        newHead= new Block (head.col, head.row+1);
    }
    
    if (this.checkCollision(newHead)) { 
        gameOver();
        return;
    }
    
    this.segments.unshift(newHead);//unshift() method adds a new array element to the first position and moves everything back
    //adds the newHead element to the first position (0) in the segments array since eating the apple creates a new head
    
    if (newHead.equal(apple.position)) {
        score++;
        apple.move();//move the apple in a different coordinate
    }else{
    //pop() method removes the last element of the array
        this.segments.pop();
    //we need to remove the tail since the move method adds one head, in order to maintain the same snake length until the snake eats an apple
    }
};
    
    Snake.prototype.checkCollision= function(newHead){
        var leftCollision = 0;
        var rightCollision = widthInBlocks-1;//if the x values of newHead is 39
        var topCollision = 0;
        var botCollision= heightInBlocks-1;// if the y values of newHead is 39
        
        var wallCollision= false;
        
        //CONDITION STATEMENT IS FUCCCKED PLS FIX//
        if (newHead.col == rightCollision) {
            wallCollision = true;  
        }
        else if (newHead.col == leftCollision) {
            wallCollision = true;
        }
        
        else if (newHead.row == botCollision ) {
            wallCollision = true;
        }
        
        else if (newHead.row == topCollision) {
            wallCollision = true;
        }
        
        var snakeCollision= false;
        
        for (i=0; i<this.segments.length; i++){
            if (newHead.equal(this.segments[i])) {
                snakeCollision= true;
                
            }
        }
    return wallCollision || snakeCollision;
    };
    
    Snake.prototype.setDirection = function(newDirection){
        //the reason why we cannot just assign user input direction[event.keyCode] directly to nextDirection is because we need to filter out illegal user input moves
        //thus when all illegal moves are checked we can finally assign the valid move to nextDirection
        if (this.direction === "up" && newDirection === "down") {
            return;
        }
        else if (this.direction === "left" && newDirection === "right"){
            return;
        }
        else if (this.direction === "right" && newDirection === "left") {
            return;
        }
        else if (this.direction === "down" && newDirection === "up") {
            return;
        }
    
        this.nextDirection = newDirection;
    
    }
    
    
    
    //CALLING THE FUNCTION//
    var snake= new Snake();
    var apple= new Apple();
    

    
    var intervalId= setInterval(function(){
        ctx.clearRect(0, 0, width, height);
        drawScore();
        snake.move();
        snake.drawSnake();
        apple.draw();
        drawBorder();
        
    }, 100);
    
     var direction = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    
     $("body").keydown(function(event){
        var newDirection = direction[event.keyCode]
        if (newDirection !== undefined) {//undefined means the variable has been declared but with no value assigned, null is an assigned value but a value of nothing
        //if we didn't have this if statement, it would take undefined keys that are not: up down left right
        //this would make our setDirection method complicated since we would need to accomadate undefined keys
        //we do not need an else since there is no other scenario, thus js will do nothing with undefined keys since we didn't bring up such an exception
            snake.setDirection(newDirection);
        }
        });
