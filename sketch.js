//declare variables
var moon_X = 60;
var moon_Y = 50;
var sunset = 0;
var day_or_night = 0; 
var fireworks = []; // 放煙火粒子的地方，可以支援多個煙火
var gravity; // 煙火掉下來需要重力的加持
var colorsBlue = "04080f-507dbc-a1c6ea-bbd1ea-dae3e5".split("-").map(a=>"#"+a) //給定顏色
var blur_ctrl = 0;
var blur_ctrl_flag = false; // false 代表"從 0 往上數, true 代表從最高往下數"的判斷標籤
var stars = [];
var star_num = 30;
var clouds = [];
var cloud_object;
var cloud_init_y = 0;
var canvasSize;
var shooting_stars = [];

var lanterns = []

// 放音樂
var audioCtx = null;
var analysers = [];

// 畫山
var cFurther, cCloser, cMist;
var a, b, c, d, e;

function preload() {
    // preload() runs once
    cloud_object1 = new Cloud('cloud1.png');
    clouds.push(cloud_object1);
    cloud_object2 = new Cloud('cloud2.png');
    clouds.push(cloud_object2);
    cloud_object3 = new Cloud('cloud3.png');
    clouds.push(cloud_object3);
    cloud_object4 = new Cloud('cloud4.png');
    clouds.push(cloud_object4);
    cloud_object5 = new Cloud('cloud3.png');
    clouds.push(cloud_object5);
    cloud_init_y = int(random(0, 100));
  
    // 燈籠 (目前還都是用燈泡測試)
    lantern_object1 = new Lantern('lightbulb.png');
    lanterns.push(lantern_object1);
    lantern_object2 = new Lantern('lightbulb1.png');
    lanterns.push(lantern_object2);
  
    // 先把音樂灌好
    // GetAudio();
}

function setup(){
    if(windowWidth > windowHeight){
      canvasSize = windowHeight;
    }else{
      canvasSize = windowWidth;
    }
    createCanvas(canvasSize, canvasSize);
    gravity = createVector(0, 0.2);
    stroke(255);
    strokeWeight(4);
    background(0);
	frameRate(40);
    // randomSeed(99);
    // console.log(parseInt(random(0, 2)));
    createStars();
    noStroke();
  
    cFurther = color(255, 255, 255);
    cCloser = color(0, 0, 0);
    cMist = color(255,255,255);
  
    a = random(-width/2, width/2);  //random discrepancy between the sin waves
    b = random(-width/2, width/2);  //random discrepancy between the sin waves  
    c = random(2, 4);  //random amplitude for the second sin wave
    d = random(40, 50);  //noise function amplitude
    e = random(-width/2, width/2);
}
function draw(){
	noStroke();
    colorMode(RGB);
    eveningBackground();
    if (random(1) < 0.015 && fireworks.length < 4) {
        fireworks.push(new Firework());
    }
    // fireworks.push(new Firework());
    for (var i = fireworks.length-1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].show();
      if (fireworks[i].done())
        fireworks.splice(i, 1);
    }
      // fireworks[0].update();
      // fireworks[0].show();
      // if (fireworks[0].exploded == true){
      //     Pd.send('hit', ['bang']);
      // }
      // if (fireworks[0].done()){
      //     fireworks.splice(0, 1);
      // }
  
    // make a shooting star  
//     if(shooting_stars.length == 0){
//         shooting_stars.push(new ShootingStar());
//         console.log(shooting_stars.length);        
//     }
  
//     starFly(0);

    // blendMode(SCREEN)
    noStroke();
    drawStars();
    moon(moon_X, moon_Y);
	// mountain();
    // ground();
    // starFly();
    mountains(cCloser, cFurther, cMist);
    // building();
    // drawCloud();
    for (var i = clouds.length-1; i >= 0; i--) {
        clouds[i].draw();
    }
    
    // 燈籠  
    // if(frameCount % 2 == 0){
    //   lanterns[0].draw();
    // }else{
    //   lanterns[1].draw();
    // }
  

}

function mountain(){
    noStroke();
    fill('brown');
	beginShape();
	vertex(400,450);
	vertex(500,350);
	vertex(600,450);
	endShape(CLOSE);
}
  
function Lantern(img_path){
    this.image = loadImage(img_path);
    this.width = 300;
    this.height = 300;
    this.x = 200;
    this.y = 200;
}

Lantern.prototype.draw = function() {
    image(this.image, this.x, this.y, this.width, this.height);
}

function Cloud(img_path){
    this.image = loadImage(img_path);
    this.width = random(50, 600); // 雲初始大小
    this.height = int(this.width / 3); // 雲初始大小
    this.x = random(-450, 450); // 雲初始位置 
    this.y = random(0, 300); // 雲初始位置 
    this.step_size = random(0.5, 3); // 愈小的話雲動得愈快
    this.timecount = 0;
    if (random(1) < 0.5) {
        this.direction = "right";
    }else{
        this.direction = "left";
    }
}

Cloud.prototype.restart = function(){
    this.width = random(50, 600);
    this.height = int(this.width / 3);
    this.x = random(-450, 450);
    this.y = random(0, 300);
    this.step_size = random(0.5, 3);
    if (random(1) < 0.5) {
        this.direction = "right";
    }else{
        this.direction = "left";
    }
    this.timecount = 0;
  
}

Cloud.prototype.draw = function() {
    this.timecount += 1;
    if(this.direction == "right"){ // 往右走
        this.x = this.timecount/this.step_size - this.width;
      
        if(this.x <= windowWidth + this.width + 200){
            image(this.image, this.x, this.y, this.width, this.height);
        }else{
            // 重新設定下次位置
            this.restart();
        }
    }else{ // 往左走
        this.x = canvasSize - (this.timecount/this.step_size);
      
        if(this.x >= -this.width - 200){
            image(this.image, this.x, this.y, this.width, this.height);
        }else{
            // 重新設定下次位置
            this.restart();
        }
    }
}

// 目前先亂做的，之後畫剪影再改這邊
function building(){
    // background(200, 200, 210);
    noStroke();
  
    // 近的房子 (灰色)
    fill(100);
    var x = 0;
    var amplitude = 300;
    var frequency = 0.03;
    var _width = 600
    var _height = 650
    for (x = 0; x < windowWidth; x += 15) {
      let buildingHeight = noise(x * frequency) * amplitude;
      rect(x, windowHeight * 0.98 - buildingHeight, 20, windowHeight);
    }  
  
    // 近的房子 (黑色)
    fill(0);
    var x = 0;
    var amplitude = 160;
    var frequency = 0.02;
    var _width = 600
    var _height = 650
    for (x = 0; x < windowWidth; x += 10) {
      let buildingHeight = noise(x * frequency) * amplitude;
      rect(x, windowHeight * 0.98 - buildingHeight, 20, windowHeight);
    }  

    fill(0);
    rect(0, windowHeight * 0.98, windowWidth, windowHeight);
  
  
}


function ground(){
    noStroke();
	fill('green');
	rect(0,400,600,100);
}

function createStars(){
  for (var i = 0; i < star_num; i++) {
      stars.push(new star());
}
}

function star() {
   this.x = random(windowWidth);
   this.y = random(windowHeight-200);
   this.size_x = int(random(1, 4));
   this.size_y = this.size_x;
   this.timeCount = int(random(0, 12));
   var dice = random(1);
   //  if(dice < 0.2){
   //     this.initila_color = "#FFFFAA" // 黃色
   // }else if(dice >= 0.2 && dice < 0.4){
   //     this.initila_color = "#FF8000" // 橘色   
   // }else if(dice >= 0.4 && dice < 0.6){
   //     this.initila_color = "#93FF93" // 綠色     
   // }else if(dice >= 0.6 && dice < 0.8){
   //     this.initila_color = "#A6FFFF" // 藍色     
   // }else{
   //     this.initila_color = "#B9B9FF" // 淺紫色
   // }
    this.initila_color = "#FFFFFF";
     
}

star.prototype.draw = function() {
    noStroke();
    colorMode(RGB);
    this.timeCount += 1;
    if(this.timeCount % 12 == 0){
      fill(this.initila_color); // 初始顏色
      ellipse(this.x, this.y, this.size_x, this.size_y);
    }else if(this.timeCount % 12 == 6){
      fill(this.initila_color); // 銀色
      ellipse(this.x, this.y, this.size_x, this.size_y);
    } else{
      fill(192,192,192); // 淺銀色
      ellipse(this.x, this.y, this.size_x, this.size_y);
    }
    
}

function drawStars(){
    for (var i = 0; i < star_num; i++) { 
        stars[i].draw();
    }
}

function ShootingStar() {
  this.x = random(windowWidth-200);
  this.y = random(windowHeight-400);
  this.w = 4;
  this.h = 4;
  this.color = "white";
  this.pct = 0.0;
  this.step = 0.1;
  this.exponent = 4;
}

ShootingStar.prototype.draw = function() {
  noStroke();
  fill(this.color);
  ellipse(this.x, this.y, this.w, this.h);
  this.pct += this.step;
  if (this.pct < 1.0 || this.x < windowWidth) {
    this.x = this.x + this.pct * windowWidth;
    this.y = this.y + pow(this.pct, this.exponent) * windowHeight;
    console.log(this.y);    
  }else{
    shooting_stars.splice(0, 1); // 刪掉流星
  }
}

function starFly(i){
    shooting_stars[i].draw();  
}


function moon(x, y){
    push();
    noStroke();
    translate(x, y); // 位置
    fill("#f7f25f"); // 黃色

    // 繪製陰影
    drawingContext.shadowColor = color("#f7f25f");
    drawingContext.shadowBlur = blur_ctrl;
    circle(moon_X, moon_Y, 60);
    // 待畫
    // 月亮斑點 (還沒弄好)
    // noStroke();
    // fill("gray");
    // circle(moon_X + 10, moon_Y + 10, 15); 
    // circle(moon_X - 10, moon_Y - 10, 25);
    
    pop();
    
    // 月亮呼吸燈
    if(blur_ctrl_flag == false){ 
        blur_ctrl = blur_ctrl + 1;
        if(blur_ctrl == 100){
            blur_ctrl_flag = true;
        }
    }else{
        blur_ctrl = blur_ctrl - 1
        if(blur_ctrl == 0){
            blur_ctrl_flag = false;
        }
    }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis == "Y") {  // Top to bottom gradient
    for (let i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 0.85);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == "X") {  // Left to right gradient
    for (let j = x; j <= x+w; j++) {
      var inter2 = map(j, x, x+w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y+h);
    }
  }
}

// 傍晚 (到時候我也會改成有雲的、然後每次開啟雲都會在不同的位置)
function eveningBackground(){ 
    var color1 = color(0, 50, 138);
    var color2 = color(255, 131, 10);
    setGradient(0, 0, windowWidth, windowHeight, color1, color2, "Y");
}

// 黑夜 (到時候我也會改成有雲的、然後每次開啟雲都會在不同的位置)
function nightBackground(){
    background('black');
}


// function GetAudio() {
//    if(Pd.getAudio() == null) {
//     console.log("can not get audio");
//   }
  
//   audioCtx = Pd.getAudio().context;
  
//   for(let i = 0; i < 3; i++){
//      analysers[i] = audioCtx.createAnalyser();
//      patch.o(i).getOutNode().connect(analysers[i]);    
//   }
  
// }


// 煙火
function Firework() {
  this.hu1 = random(60, 255);
  this.hu2 = random(60, 255);
  this.hu3 = random(60, 255);
  this.firework = new Particle(random(width), height * 0.75, this.hu1, this.hu2, this.hu3, true);
  this.exploded = false;
  this.particles = [];
  
  
  this.done = function() {
    if (this.exploded && this.particles.length === 0){
      return true;
  }else {
      return false;
  }
  }
  this.update = function() { //firstUpdate
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
        Pd.send('bgm_start', ['bang']); // 爆掉的時候才要發出聲音
      }
    }
 for (var i = this.particles.length-1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
   if (this.particles[i].done()){
     this.particles.splice(i, 1);
   }
    }
  }
  
  this.explode = function() {
    var firework_num = int(random(200, 600)); // 看一次煙火要製造多少顆粒子
    for (var i = 0; i < firework_num; i++) {
      var p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu1, this.hu2, this.hu3, false);
      this.particles.push(p);
    }     
  }
  this.show = function() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (var i = this.particles.length-1; i >= 0; i--) {
      this.particles[i].show();
    }
  }
}

// 煙火會用到的粒子效果
function Particle(x, y, hu1, hu2, hu3, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.hu1 = hu1;
    this.hu2 = hu2;
    this.hu3 = hu3;

  if (this.firework){
   this.vel = createVector(0, random(-12, -8));
 }else {
   this.vel = p5.Vector.random2D();
   this.vel.mult(random(2, 10));
 }
  
  this.acc = createVector(random(-1, 2), 0);
 
  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.update = function() { //second update
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  this.done = function(){
    if(this.lifespan < 0){
      return true;
    }else {
      return false;
    }
  }
  this.show = function() {
   colorMode(HSB);
    if (!this.firework) {
      strokeWeight(2); // 煙火爆炸的時候的粒子大小
      stroke(hu1, hu2, hu3, this.lifespan);
   }else {
     strokeWeight(4);
     stroke(hu1, hu2, hu3);
   }
    point(this.pos.x, this.pos.y);
   
  }
}

function mountains(closerColor, furtherColor, mistColor){
  var y0 = width - width * 0.5; // 調整山的高度
  var i0 = 30; 
  
  var cy = [3];
  for (var j = 0; j < 3; j++)
  {
    cy[2-j] = y0;
    y0 -= i0 / pow(1.2, j);
  }
  
  
  //DRAW/
  var dx = 0;
  
  for (var j = 0; j <  4; j++)
  {                  
    for (var x = 0; x < width; x ++)
    {          
      var y = cy[j]; //y = reference y
      y += d*(j+6)*noise(1.2*dx/(j+6)+e);  //adds randomness to the mountains
      y += 1.7*(j+6)*noise(10*dx);  //adds trees
      
      strokeWeight(2);  //smoove peaks
      stroke(lerpColor(furtherColor, closerColor, (j+6)/10));
      line(x, y, x, windowHeight); 
      
      dx += 0.02;
    }
    
  }
}