// codepen al-ro 
// experiment with perlin first 
//
// based on the following 
// al-ro 
// http://w2.mat.ucsb.edu/200C/spring_2013/
// tutorial: http://petewerner.blogspot.co.uk/2015/02/intro-to-curl-noise.html
// colours / fading using rgba
//
//
// create class of particles, x,y position, 
// compute curl
//

noise.seed(Math.random());

function particles(px, py, r){
  var node = {
    x: px,
    y: py,
    oldx: px,
    oldy: py,
    radius: r,
    fixed: false
  };
  particles.push(node);
}

var pad = 75;
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
    radius: 2
  };
  particles.push(particle);
}

function getRand(min, max) {
      return Math.random() * (max - min) + min;
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
function draw() {


  var dt = 1;
  var r_a = 0.4;

  // canvas.save()
  // Draw over the whole canvas to create the trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, .05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //
  for(i=0; i < particles.length; i++)
  {
    var a = noise.simplex2(particles[i].x/canvas.width, particles[i].y/canvas.height);
    var curl = ComputeCurl(particles[i].x/(canvas.width*0.5), particles[i].y/(canvas.height*0.5));

    particles[i].x += dt*curl[0];
    particles[i].y += dt*curl[1];
    ctx.beginPath();
    ctx.fillStyle = '#ff0000';
    ctx.moveTo(particles[i].x, particles[i].y);
    ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
