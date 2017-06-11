// codepen al-ro 
// experiment with perlin first 
//
// based on the following 
// al-ro 
// http://w2.mat.ucsb.edu/200C/spring_2013/
// tutorial: http://petewerner.blogspot.co.uk/2015/02/intro-to-curl-noise.html
// colours / fading using rgba
// //https://krazydad.com/tutorials/makecolors.php
//
//
// create class of particles, x,y position, 
// compute curl
// periodic boundary conditions or if reach end set to random point?
//

noise.seed(Math.random());

function RGB2Color(r,g,b)
{
  return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
}

var frequency = .3;
var amplitude = 127;
var center = 128;

var colours = [];
var colourNum = 32;

function createColours()
{
  for (var i = 0; i < colourNum; ++i)
  {
    var v = Math.sin(frequency*i) * amplitude + center;
    colours.push(RGB2Color(v,v,v));
  }
}

createColours();

var pad = 0;
var PARTICLES = 2000;
var particles = [];
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

for(i=0;i<PARTICLES;i++){
  var particle = {
    x: getRand(pad,canvas.width-pad),
    y: getRand(pad,canvas.height-pad),
    u: 0,
    w: 0,
    radius: 1.3,
    colour: colours[Math.floor(Math.random() * colourNum)]
  };
  particles.push(particle);
}

function getRand(min, max) {
      return Math.random() * (max - min) + min;
}

function ComputeCurl3(x, y, z)  
{ 
  var eps = 0.001;  
  var n1, n2, a, b;  

  n1  = noise.simplex3(x, y + eps, z); 
  n2  = noise.simplex3(x, y - eps, z); 
  a = (n1 - n2)/(2 * eps); 
  
  n1  = noise.simplex3(x + eps, y, z); 
  n2  = noise.simplex3(x - eps, y, z); 
  b = (n1 - n2)/(2 * eps); 

  return [a,-b];
}


function ComputeCurl(x, y)  
{ 
  var eps = 0.001;  
  var n1, n2, a, b;  

  n1  = noise.simplex2(x, y + eps); 
  n2  = noise.simplex2(x, y - eps); 
  a = (n1 - n2)/(2 * eps); 
  
  n1  = noise.simplex2(x + eps, y); 
  n2  = noise.simplex2(x - eps, y); 
  b = (n1 - n2)/(2 * eps); 

  return [a,-b];
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function particleBoundaries()
{
  for(i=0; i < particles.length; i++)
  {
    if(particles[i].x > canvas.width){
      particles[i].x = getRand(pad,canvas.width-pad);
      particles[i].x_vel = -particles[i].x_vel;
    }
    else if(particles[i].x < 0) { 
      particles[i].x = getRand(pad,canvas.width-pad);
      particles[i].x_vel = -particles[i].x_vel;
    }
    else if(particles[i].y > canvas.height){
      particles[i].y = getRand(pad,canvas.height-pad);
      particles[i].y_vel = -particles[i].y_vel;
    }
    else if(particles[i].y < 0) { 
      particles[i].y = getRand(pad,canvas.height-pad);
      particles[i].y_vel = -particles[i].y_vel;
    }
    particles[i].x += particles[i].x_vel;
    particles[i].y += particles[i].y_vel;
  }
}

var val = 0;
function draw() {

  val = 0;
  var speed = 0.2; 
  var r_a = 0.9;
  var step = 100; // smaller more fine
  var fade = 0.01;

  // canvas.save()
  // Draw over the whole canvas to create the trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, '+ fade + ')';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //
  for(i=0; i < particles.length; i++)
  {
    var curl = ComputeCurl3(particles[i].x/step, particles[i].y/step, val);
    particles[i].x_vel = speed*curl[0];// /Math.sqrt(Math.pow(curl[0]) + Math.pow(curl[1]));
    particles[i].y_vel = speed*curl[1];///Math.sqrt(Math.pow(curl[0]) + Math.pow(curl[1]));
    ctx.beginPath();
    // ctx.fillStyle = "#00008B";
    ctx.fillStyle = "#dccab1";
    ctx.moveTo(particles[i].x, particles[i].y);
    ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  particleBoundaries();
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
