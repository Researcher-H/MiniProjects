// default canvas parameters
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); // get a context of canvas
// start ball point
var x = canvas.width/2;
var y = canvas.height-30;
// a change per frame
var dx = 3;
var dy = -3;
// size of ball
var ballRadius = 10;
// paddle start point
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
// user responses
var rightPressed = false;
var leftPressed = false;    
// bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
// create brick variable
var bricks = [];
// create a MxN matrix with value of {x:0,y:0}
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
      if (c==1 && r==1){
        bricks[c][r] = { x: 0, y: 0, status: 1, rare: 1};
      } else {
          bricks[c][r] = { x: 0, y: 0, status: 1, rare: 0};
      }
    }
}
// create score variable
var score = 0;
// player's life
var lives = 3;
// setting a start time
var time_start = new Date();
var time_now = [];
var time = 0;

// 

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
              var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
              var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;
              if (bricks[c][r].rare == 1) {
                  ctx.beginPath();
                  ctx.rect(brickX, brickY, brickWidth, brickHeight);
                  ctx.fillStyle = "#ff00ff";
                  ctx.fill();
                  ctx.closePath();
                  if (time > 5 ){
                      ctx.beginPath();
                      ctx.rect(brickX, brickY, brickWidth, brickHeight);
                      ctx.fillStyle = "#0095DD";
                      ctx.fill();
                      ctx.closePath();
                  }
              } else {
                  ctx.beginPath();
                  ctx.rect(brickX, brickY, brickWidth, brickHeight);
                  ctx.fillStyle = "#0095DD";
                  ctx.fill();
                  ctx.closePath();
              }
              }
        }
    }
}

function drawBall(color="#0095DD") {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBricks();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    drawTime();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height-ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        } else {
            lives--;
            if(!lives) {
              alert("GAME OVER");
              document.location.reload();
            }
            else {
              x = canvas.width/2;
              y = canvas.height-30;
              dx = 3;
              dy = -3;
              paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    // if(rightPressed && paddleX < canvas.width-paddleWidth) {
    //     paddleX += 7;
    // }
    // else if(leftPressed && paddleX > 0) {
    //     paddleX -= 7;
    // }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    if (b.rare == 1 && time < 5){
                        score += 10;
                        b.rare = 0;
                    } else {
                        score++;
                    }
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    } else if (score == brickRowCount*brickColumnCount+9) {
                        alert("You did legendary WIN!, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// detect button press
// function keyDownHandler(e) {
//     if(e.key == "Right" || e.key == "ArrowRight") {
//         rightPressed = true;
//     }
//     else if(e.key == "Left" || e.key == "ArrowLeft") {
//         leftPressed = true;
//     }
// }

// function keyUpHandler(e) {
//     if(e.key == "Right" || e.key == "ArrowRight") {
//         rightPressed = false;
//     }
//     else if(e.key == "Left" || e.key == "ArrowLeft") {
//         leftPressed = false;
//     }
// }

// function mouseMoveHandler(e) {
//     var relativeX = e.clientX - canvas.offsetLeft;
//     if(relativeX > 0 && relativeX < canvas.width) {
//         paddleX = relativeX - paddleWidth/2;
//     }
// }


// TOUCH
function touchHandler(e) {
    if(e.touches) {
        var relativeX = e.touches[0].pageX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth/2;
        }
        output.innerHTML = "Touch:  <br />"+ " x: " + relativeX;
        e.preventDefault();
    }
}

// function pressMoveHandler(e) {
//     var relativeX = e.clientX - canvas.offsetLeft;
//     if(relativeX > 0 && relativeX < canvas.width) {
//         paddleX = relativeX - paddleWidth/2;
//     }
// }

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function drawTime() {
    time_now = new Date();
    time = Math.round((time_now - time_start)/1000);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Time: "+time, 85, 20);
}

// eventHandler for detect button press
// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);
// document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touhstart", touchHandler, false);
document.addEventListener("touchmove", touchHandler, false);

draw();
// setInterval(draw, 10);