//we're gonna redo all this shit
//ngl, this is probably my least favourite game I've ever made since the very first project of mine in processing
//it's totally creatively bankrupt, and was kind of thrown together with these assets last minute after I realized the game jam is almost done and my actual plan for my game didn't work out
//that being said, I'm gonna submit something. Just because a finished game no matter how lazy is better than no game at all
//Arya, if you're reading the code to judge this, please don't think this is the best I can do. Check this shit out. I'm actually proud of it. https://editor.p5js.org/millad456/sketches/OzNgHjARd

//made by Millad Bahrami, but not his proudest work

//the important variables
let tick = 0;
let timer = 30;
let gameState = 0;
let totalGrain = 0;
let totalRabbits = 0;
let totalWolves = 0;
let totalHumans = 0;
let health = 5;
let score = 0;
let sFrame = 0;
let basketPos;

//the variables to tweak the game
let rabbitHunger = 5; //needs 10 grain
let wolfHunger = 4; //needs 3 rabbits
let humanHungerV = 10; //needs 20 grain
let humanHungerM = 3; //and 5 rabbits
let easing = 0.2;
let dropSpeed = 3; 
let shakeMag = 4; //the shake magnitude

//arraylists for falling things
let fallen = [];
let particles = [];

//the images 
let caveWall;
let person;
let grain;
let rabbit;
let basket;
let heart;
let wolf;
//more images
function preload() {
  caveWall = loadImage("cave_wall_plain.jpg");
  person = loadImage("stickPerson.png");
  grain = loadImage("grain_grown.png");
  rabbit = loadImage("rabbit.png");
  basket = loadImage("basket.png");
  heart = loadImage("heart.png");
  wolf = loadImage("wolf.png");
}



function setup() {
  createCanvas(600, 800);
  reset();
  gameState = -1;
}

function reset(){
  gameState = 0;
  totalGrain = 0;
  totalRabbits = 0;
  totalWolves = 0;
  totalHumans = 0;
  health = 5;
  score = 0;
  
  tick = 0;
  timer = 30;
  basketPos = createVector(width/2,650);
}

function draw() {
  imageMode(CORNER);
  background(caveWall);
  if (sFrame >= 0) shake();
  
  //titlescreen
  if (gameState == 0){
    
    textFont('Papyrus');
    imageMode(CENTER);
    textAlign(CENTER);
    textSize(80);
    strokeWeight(1);
    fill(0);
    text("CAVE", width / 2, 120);
    text("BASKET", width / 2, 200);
    textSize(30);
    textStyle(BOLD);
    text("Don't catch more than you can feed", width / 2, height /2);
    text("Rabbits need " + rabbitHunger + " grain to catch", width / 2, height /2 + 40);
    text("Wolves need " + wolfHunger + " rabbits to catch", width / 2, height /2 + 80);
    text("Humans need " + humanHungerV + " grain " + humanHungerM + " rabbits to catch", width / 2, height /2 + 120);
    
    //button stuff
    noFill();
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    rectMode(CENTER);
    
    textSize(50);
    if (mouseOverC(width/2, 640, 200, 80)) {
      strokeWeight(6);
      if (mouseIsPressed) {
        gameState = 1;
      }
    }
    rect(width/2, 640, 200, 80);
    text("PLAY", width/2, 660, 200, 80);
    
  }
  //actual gamePlay
  else if(gameState == 1){
    play();
    drawHUD();
    if(health == 0)gameState = -1;
  }
  
  //game over screen
  else if(gameState == -1){
    textFont('Papyrus');
    imageMode(CENTER);
    textAlign(CENTER);
    textSize(80);
    strokeWeight(1);
    fill(0);
    text("GAME", width / 2, 120);
    text("OVER", width / 2, 200);
    
    textSize(30);
    textStyle(BOLD);
    text("Score: " + score , width / 2, height /2);
    
    //button stuff
    noFill();
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    rectMode(CENTER);
    
    textSize(50);
    if (mouseOverC(width/2, 540, 200, 80)) {
      strokeWeight(6);
      if (mouseIsPressed) {
        
        reset();
      }
    }
    rect(width/2, 540, 200, 80);
    text("MENU", width/2, 560, 200, 80);
  }
}

//game main method
function play(){
  //print(timer);
  //draw and move the basket using the easing equation
  imageMode(CENTER);
  let targetX = mouseX;
  let dx = targetX - basketPos.x;
  basketPos.x += dx * easing;
  image(basket, basketPos.x, basketPos.y, 200,100);
  
  //drop a random object every few frames
  if (timer == 0){
    let dice = int(random(1,11));
    if (dice == 1 || dice == 2 || dice == 3 || dice == 4 || dice == 5)fallen.push(new Unit(int(random(20, width-20)), 'grain'));
    if (dice == 6 || dice == 7 )fallen.push(new Unit(int(random(20, width-20)), 'rabbit'));
    if (dice == 8)fallen.push(new Unit(int(random(20, width-20)), 'wolf'));
    if (dice == 9)fallen.push(new Unit(int(random(20, width-20)), 'human'));
    print(dice);
    
    timer = int(random(5,90)); 
    
    if(dice == 10) timer += 45;
  }
  
  //drop all things
  for(let i = 0; i < fallen.length; i++){
    fallen[i].display();
    fallen[i].update();
    
    //the actual fucking catching mechanic
    if(abs(basketPos.y - fallen[i].pos.y) < 30 && fallen[i].pos.x > basketPos.x - 100 && fallen[i].pos.x < basketPos.x + 100){
      //catch grain
      if(fallen[i].type == 'grain'){
        totalGrain++;
        score += 1;
      }
      //catch a rabit. If you cant feed it, you lose health. else you gain a rabbit and lose grain
      else if(fallen[i].type == 'rabbit'){
        if(totalGrain < rabbitHunger ){
          health--;
          shakeSetup();
        }else if (totalGrain > rabbitHunger){
          totalGrain -= rabbitHunger;
          totalRabbits++;
          score += 5;
        }
      }
      //same but with wolf
      else if(fallen[i].type == 'wolf'){
        if(totalRabbits < wolfHunger ){
          health--;
          shakeSetup();
        }else if (totalRabbits > wolfHunger){
          totalRabbits -= wolfHunger;
          totalWolves++;
          score += 100;
        }
      }
      //and lastly with humans
      else if(fallen[i].type == 'human'){
        if (totalRabbits > humanHungerM && totalGrain > humanHungerV){
          totalRabbits -= humanHungerM;
          totalGrain -= humanHungerV;
          totalHumans ++;
          score *= 1.25;
        } else {
          health--;
          shakeSetup();
        }
      }
      
      
      fallen.splice(i,1);
    } 
  }
  
  //remove those at the bottom
  for(let i = 0; i < fallen.length; i++){
    if(fallen[i].pos.y > height) fallen.splice(i,1);
  }
  
  
  timer--;
}


//draw's heads up display separate from game render
function drawHUD(){
    //draw heads up display
  
  push();
  imageMode(CENTER);
  textAlign(CENTER);
  translate(30,480);
  stroke(0,0,0);
  strokeWeight(3);
  //num grain
  rect(0,0,40,40,2);
  image(grain, 0, 0, 20, 40);
  //num people
  rect(0,45,40,40,2);
  image(person, 0, 45, 20, 40);
  //num rabbits
  rect(0,90,40,40,2);
  image(rabbit, 0, 90, 40, 40);
  //num wolves
  rect(0,135,40,40,2);
  image(wolf, 0, 135, 40, 20);
  
  textSize(36);
  strokeWeight(1);
  
  text(totalGrain,40,12);
  text(totalHumans,40,57);
  text(totalRabbits,40,102);
  text(totalWolves,40,147);
  
  pop();
  
  //heart stuff
  imageMode(CENTER);
  for(let i = 0; i < health; i++){
    image(heart, (width/6) * (i + 1), 750, 60, 60);
  }
  
}


//helper methods

//this just simplifies mouse collisions
function mouseOver(x, y, w, h) {
  if (mouseX >= x && mouseY >= y && mouseX <= x + w && mouseY <= y + h) {
    return true;
  }
  return false;
}
//same function but for rectangles based on the centre
function mouseOverC(x, y, w, h) {
  if (mouseX >= x - w/2 && mouseY >= y - h/2 && mouseX <= x + w/2 && mouseY <= y + h/2) {
    return true;
  }
  return false;
}



//handles screen shake
function shake() {
  if (sFrame == 8) translate(dx, 0);
  else if (sFrame == 7) translate(dx, dy);
  else if (sFrame == 6) translate(0, dy);
  else if (sFrame == 5) translate(0, 0);
  else if (sFrame == 4) translate(0, -dy);
  else if (sFrame == 3) translate(-dx, -dy);
  else if (sFrame == 2) translate(-dx, 0);
  else if (sFrame == 1) translate(0, 0);
  if (sFrame != 0) sFrame--;
}


function shakeSetup() {
  //dy and dx are the direction of shake determined by the magnitude
  dx = shakeMag * random([-1, 1]);
  dy = shakeMag * random([-1, 1]);
  sFrame = 4;
}