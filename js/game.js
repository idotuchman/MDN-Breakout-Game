var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var score = 0;
var lives = 3;

// ball
var dx = 2;
var dy = -2;
var ballRadius = 10;

// paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// keyboard
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
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
    var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
    bricks[c][r] = {x: brickX, y: brickY, visible: true};
  }
}

function init() {
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if(e.keyCode == 39) {
      rightPressed = true;
  } else if(e.keyCode == 37) {
      leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 39) {
      rightPressed = false;
  } else if(e.keyCode == 37) {
      leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
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

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        if(bricks[c][r].visible){
            ctx.beginPath();
            ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
      }
  }
}

function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var brick = bricks[c][r];
      if (brick.visible) {
        if(x > brick.x && x < brick.x+brickWidth && y > brick.y && y < brick.y+brickHeight) {
          dy = -dy;
          brick.visible = false;
          score++;
          if(score == brickRowCount * brickColumnCount) {
            alert("YOU WIN!");
            document.location.reload();
          }
        }
      }
    }
  }
}

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  drawScore();
  drawLives();

  if(rightPressed) {
      paddleX += 7;
  } 
  if(leftPressed) {
      paddleX -= 7;
  }
  if(paddleX < 0) {
    paddleX = 0;
  }
  if(paddleX > canvas.width-paddleWidth) {
    paddleX = canvas.width-paddleWidth;
  }

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
  }
  if(y + dy < ballRadius) {
      dy = -dy;
  } else if(y > canvas.height-ballRadius-paddleHeight) {
    if (x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius) {
      y = canvas.height-paddleHeight-paddleHeight;  //bring ball up to paddle height
      dy = -dy;
    }
  } 
  
  if (y > canvas.height) {
    lives--;
    if (!lives) {
      alert("GAME OVER");
      document.location.reload();
      y = canvas.height-30;
    } else {
      x = canvas.width/2;
      y = canvas.height-30;
      dx = 2;
      dy = -2;
      paddleX = (canvas.width-paddleWidth)/2;
    }
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();