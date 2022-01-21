var moon_X = 120;
var moon_Y = 100;
var moon;
var moon_diameter = 60;
var normal_moon_ctrl = true;
// 煙火控制器
var fireworks = []; // 放煙火粒子的地方，可以支援多個煙火
var firework_control = true;

var gravity; // 煙火掉下來需要重力的加持
var blur_ctrl = 0;
var blur_ctrl_flag = false; // false 代表"從 0 往上數, true 代表從最高往下數"的判斷標籤
var stars = [];
var star_num = 150;
var clouds = [];
var cloud_object;
var cloud_init_y = 0;
var canvasSize;
var shooting_stars = [];
// 燈籠
var lanterns = [];
var sai_lantern;
var normal_sai_lantern_ctrl = true;
// 攤販
var vendors = [];
// 放音樂
var musicFiles = [];
var audioCtx;
var audio;
var audioSrc;
var analyser;
var bufferLength;
var dataArray;
var background_music;
var initial_volume = 0.25;
// 山
var cFurther, cCloser;
var a, b, c, d, e;

function preload() {
    windowWidth = windowHeight;
    moon = new Moon(moon_X, moon_Y);
  
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
    var offset = 0.012;
    lanterns.push(new Lantern('blue-1.png', int(windowWidth*(0.125 * 0 + offset)), int(windowHeight*0.428)));
    lanterns.push(new Lantern('blue-2.png', int(windowWidth*(0.125 * 0 + offset)), int(windowHeight*0.428)));
  
    lanterns.push(new Lantern('green-1.png', int(windowWidth*(0.125 * 1 + offset)), int(windowHeight*0.463)));
    lanterns.push(new Lantern('green-2.png', int(windowWidth*(0.125 * 1 + offset)), int(windowHeight*0.463)));
  
    lanterns.push(new Lantern('orange-1.png', int(windowWidth*(0.125 * 2 + offset)), int(windowHeight*0.488)));
    lanterns.push(new Lantern('orange-2.png', int(windowWidth*(0.125 * 2 + offset)), int(windowHeight*0.488)));
  
    lanterns.push(new Lantern('purple-1.png', int(windowWidth*(0.125 * 3 + offset)), int(windowHeight*0.509)));
    lanterns.push(new Lantern('purple-2.png', int(windowWidth*(0.125 * 3 + offset)), int(windowHeight*0.509)));
  
    lanterns.push(new Lantern('red-1.png', int(windowWidth*(0.125 * 4 + offset)), int(windowHeight*0.526)));
    lanterns.push(new Lantern('red-2.png', int(windowWidth*(0.125 * 4 + offset)), int(windowHeight*0.526)));
  
    lanterns.push(new Lantern('yellow-1.png', int(windowWidth*(0.125 * 5 + offset)), int(windowHeight*0.540)));
    lanterns.push(new Lantern('yellow-2.png', int(windowWidth*(0.125 * 5 + offset)), int(windowHeight*0.540)));
  
    lanterns.push(new Lantern('white-1.png', int(windowWidth*(0.125 * 6 + offset)), int(windowHeight*0.552)));
    lanterns.push(new Lantern('white-2.png', int(windowWidth*(0.125 * 6 + offset)), int(windowHeight*0.552)));
  
    // lanterns.push(new Lantern('sai-1.png', int(windowWidth*(0.125 * 7 + offset)), int(windowHeight*0.554)));
    // lanterns.push(new Lantern('sai-2.png', int(windowWidth*(0.125 * 7 + offset)), int(windowHeight*0.554)));
    sai_lantern_1 = new Lantern('sai-1.png', int(windowWidth*(0.125 * 7 + offset)), int(windowHeight*0.554));
    sai_lantern_2 = new Lantern('sai-2.png', int(windowWidth*(0.125 * 7 + offset)), int(windowHeight*0.554));
  
  
    // 攤商
    vendors.push(new Vendor('vendor-1.png', 0, windowHeight - int(windowHeight / 3)));
    vendors.push(new Vendor('vendor-2.png', int(windowWidth * (1/3) + 1), windowHeight - int(windowHeight / 3)));
    vendors.push(new Vendor('vendor-3.png', int(windowWidth * (2/3) + 1), windowHeight - int(windowHeight / 3)));
  
    // 先把音樂灌好
    background_music = loadSound("firework_festival.mp3");
    background_music.setVolume(initial_volume);
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
	frameRate(60);
    createStars();
    noStroke();
  
    cFurther = color(255, 255, 255);
    cCloser = color(0, 0, 0);
  
    a = random(-width/2, width/2);  //random discrepancy between the sin waves
    b = random(-width/2, width/2);  //random discrepancy between the sin waves 
    c = random(2, 4);  //random amplitude for the second sin wave
    d = random(40, 50);  //noise function amplitude
    e = random(-width/2, width/2);
  
    background_music.loop();
  
    analyzer = new p5.Amplitude();
    analyzer.setInput(background_music);
}

function draw(){
	noStroke();
    colorMode(RGB);
    if(normal_moon_ctrl == true){
      eveningBackground();
    }else{
      nightBackground();
    }
    drawStars();
    moon.draw();
    if(firework_control == true){
      if (random(1) < 0.03 && fireworks.length < 3) {
          fireworks.push(new Firework());
      }
      for (var i = fireworks.length-1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].show();
        if (fireworks[i].done())
          fireworks.splice(i, 1);
      }
    }
  
    // make a shooting star  
    // if(shooting_stars.length == 0){
    //     shooting_stars.push(new ShootingStar());
    //     if(shooting_stars.length > 0){
    //       starFly(0);
    //     }
    // }
  
    mountains(cCloser, cFurther);

    for (var i = clouds.length-1; i >= 0; i--) {
        clouds[i].draw();
    }
  
    var rms = analyzer.getLevel();
  
    // 聲音震幅
    _range = 1 * initial_volume;
    _range *= 0.2948;
    _range /= 8;
    
    // 燈籠
    // 奇數都是暗的
    if(rms <= _range){
      lanterns[1].draw(); // 完全不亮
      lanterns[3].draw();
      lanterns[5].draw();
      lanterns[7].draw();
      lanterns[9].draw();
      lanterns[11].draw();
      lanterns[13].draw();
    }else if(rms >= _range && rms < _range * 2){
      lanterns[0].draw(); // 亮第一顆
      lanterns[3].draw();
      lanterns[5].draw();
      lanterns[7].draw();
      lanterns[9].draw();
      lanterns[11].draw();
      lanterns[13].draw();
    }else if(rms >= _range * 2 && rms < _range * 3){
      lanterns[0].draw(); // 亮第一顆
      lanterns[2].draw(); // 亮第二顆
      lanterns[5].draw();
      lanterns[7].draw();
      lanterns[9].draw();
      lanterns[11].draw();
      lanterns[13].draw();
    }else if(rms >= _range * 3 && rms < _range * 4){
      lanterns[0].draw(); // 亮第一顆
      lanterns[2].draw(); // 亮第二顆
      lanterns[4].draw(); // 亮第三顆
      lanterns[7].draw();
      lanterns[9].draw();
      lanterns[11].draw();
      lanterns[13].draw();
    }else if(rms >= _range * 4 && rms < _range * 5){
      lanterns[0].draw(); // 亮第一顆
      lanterns[2].draw(); // 亮第二顆
      lanterns[4].draw(); // 亮第三顆
      lanterns[6].draw(); // 亮第四顆
      lanterns[9].draw();
      lanterns[11].draw();
      lanterns[13].draw();
    }else if(rms >= _range * 5 && rms < _range * 6){
      lanterns[0].draw(); // 亮第一顆
      lanterns[2].draw(); // 亮第二顆
      lanterns[4].draw(); // 亮第三顆
      lanterns[6].draw(); // 亮第四顆
      lanterns[8].draw(); // 亮第五顆
      lanterns[11].draw();
      lanterns[13].draw();
    }else if(rms >= _range * 6 && rms < _range * 7){
      lanterns[0].draw(); // 亮第一顆
      lanterns[2].draw(); // 亮第二顆
      lanterns[4].draw(); // 亮第三顆
      lanterns[6].draw(); // 亮第四顆
      lanterns[8].draw(); // 亮第五顆
      lanterns[10].draw(); // 亮第六顆
      lanterns[13].draw();
    }else{
      lanterns[0].draw(); // 亮第一顆
      lanterns[2].draw(); // 亮第二顆
      lanterns[4].draw(); // 亮第三顆
      lanterns[6].draw(); // 亮第四顆
      lanterns[8].draw(); // 亮第五顆
      lanterns[10].draw(); // 亮第六顆
      lanterns[12].draw(); // 亮第七顆
    }
  
    // 祭典燈籠，以下這個順序不可變動!(因為第一次就要讓他是亮的)
    sai_lantern_2.draw();
    if(normal_sai_lantern_ctrl == true){
      sai_lantern_1.draw();
    }
  
    // 掛燈籠的繩子
    drawThread();

    // 攤商
    for (var i = vendors.length-1; i >= 0; i--) {
        vendors[i].draw();
    }
  
}

function drawThread(){
    // 繩子
    var p1 = { x: 0, y: 0 };
    var p2 = { x: 0, y: windowHeight * 0.4 }; // 起始
    var p3 = { x: windowWidth, y: windowHeight * 0.55 }; // 終點
    var p4 = { x: windowWidth, y: windowHeight * 0.3};
    noFill();
    strokeWeight(3);
    stroke(255, 102, 0);
    curve(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
}

function Vendor(img_path, x, y){
    this.image = loadImage(img_path);
    this.width = int(windowHeight / 3);
    this.height = int(windowHeight / 3);
    this.x = x;
    this.y = y;
}

Vendor.prototype.draw = function() {
    image(this.image, this.x, this.y, this.width, this.height);
}
  
function Lantern(img_path, x, y){
    this.image = loadImage(img_path);
    this.width = int(windowHeight / 10);
    this.height = int(windowHeight / 10);
    this.x = x;
    this.y = y;
    this.timecount = random(1, 7);
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

function createStars(){
  for (var i = 0; i < star_num; i++) {
      stars.push(new star());
}
}

function star() {
   this.x = random(windowWidth);
   this.y = random(windowHeight * 0.6);
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
  this.step = 0.01;
  this.exponent = 10;
  this.timecount = 0;
}

ShootingStar.prototype.draw = function() {
  noStroke();
  fill(this.color);
  ellipse(this.x, this.y, this.w, this.h);
  this.pct += this.step;
  if (this.pct < 1.0 || this.x < windowWidth) {
    this.x = this.x + this.pct * windowWidth;
    this.y = this.y + pow(this.pct, this.exponent) * windowHeight;
  }else{
    shooting_stars.splice(0, 1); // 刪掉流星
  }
}

function starFly(i){
    shooting_stars[i].draw();  
}


function Moon(x, y){
    this.x = x;
    this.y = y;
}

function keyPressed() {
  // console.log(initial_volume);
  if (keyCode === UP_ARROW) { 
    if(initial_volume <= 1){
      initial_volume += 0.05;
      if(initial_volume > 1){
        initial_volume = 1;
      }
    }
  } else if (keyCode === DOWN_ARROW) {
    if(initial_volume >= 0){
      initial_volume -= 0.05;
      if(initial_volume < 0){
        initial_volume = 0;
      }
    }    
  }
  background_music.setVolume(initial_volume);
}

function mousePressed() {
    // 控制月亮
    // console.log(moon.x, mouseX, moon.y, mouseY);
    if (mouseX > (moon.x - moon_diameter / 2) & mouseX < (moon.x + moon_diameter / 2) & mouseY > (moon.y - moon_diameter / 2) & mouseY < (moon.y + moon_diameter / 2) & mouseIsPressed ) {
      if(normal_moon_ctrl == true){
        normal_moon_ctrl = false;
      }else{
        normal_moon_ctrl = true;
      }
    }
  
    // 控制祭典燈籠
      if(normal_sai_lantern_ctrl == true){
        if (mouseX > (sai_lantern_1.x) & mouseX < (sai_lantern_1.x + sai_lantern_1.width ) & mouseY > (sai_lantern_1.y) & mouseY < (sai_lantern_1.y + sai_lantern_1.height) & mouseIsPressed ) {
            normal_sai_lantern_ctrl = false;
            firework_control = false;
            Pd.send('firework_stop', ['bang']); // 關掉煙火聲音
          }
      }else{
        if (mouseX > (sai_lantern_2.x) & mouseX < (sai_lantern_2.x + sai_lantern_2.width ) & mouseY > (sai_lantern_2.y) & mouseY < (sai_lantern_2.y + sai_lantern_2.height) & mouseIsPressed ) {
            normal_sai_lantern_ctrl = true;
            firework_control = true;
            fireworks = []; // 清空煙火
          }
      }
}

Moon.prototype.draw = function() {
    if(normal_moon_ctrl == true){
      push();
      noStroke();
      fill("#f7f25f"); // 黃色
      // 繪製陰影
      drawingContext.shadowColor = color("#f7f25f");
      drawingContext.shadowBlur = blur_ctrl;
      circle(this.x, this.y, moon_diameter);
      pop();
    }else{
      push();
      noStroke();
      fill("black");
      drawingContext.shadowColor = color("white");
      drawingContext.shadowBlur = blur_ctrl;
      circle(this.x, this.y, moon_diameter);
      pop();
    }
  
    // 月亮呼吸燈
    if(blur_ctrl_flag == false){ 
        blur_ctrl = blur_ctrl + 1;
        if(blur_ctrl == 70){
            blur_ctrl_flag = true;
        }
    }else{
        blur_ctrl = blur_ctrl - 1
        if(blur_ctrl == 0){
            blur_ctrl_flag = false;
        }
    }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y+h; i++) {
    var inter = map(i, y, y+h, 0, 0.85);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x+w, i);
  }
}

// 傍晚
function eveningBackground(){ 
    var color1 = color(0, 50, 138);
    var color2 = color(255, 131, 10);
    setGradient(0, 0, windowWidth, windowHeight, color1, color2);
}

// 黑夜
function nightBackground(){
    var color1 = color(0, 50, 138);
    var color2 = color(0, 0, 0);
    setGradient(0, 0, windowWidth, windowHeight, color1, color2);
}

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
        Pd.send('firework_start', ['bang']); // 爆掉的時候才要發出聲音
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
      this.lifespan -= 3;
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
   colorMode(RGB);
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

function mountains(closerColor, furtherColor){
  var y0 = width - width * 0.5; // 調整山的高度
  var i0 = 30; 
  var dx = 0;  
  var cy = [3];
  
  for (var j = 0; j < 3; j++){
      cy[2-j] = y0;
      y0 -= i0 / pow(1.2, j);
  }
  
  for (var j = 0; j <  4; j++){                  
    for (var x = 0; x < width; x ++){          
      var y = cy[j]; //y = reference y
      y += d * (j+6) * noise(1.2*dx/(j+6)+e);
      y += 1.7 * (j+6) * noise(10*dx);
      
      strokeWeight(2); 
      stroke(lerpColor(furtherColor, closerColor, (j+6)/10));
      line(x, y, x, windowHeight); 
      
      dx += 0.02;
    }    
  }
}