var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} // I didn't come up with these names, I took them from some website with color palettes :D
var brightAndTropical = [
'#F52549',
'#FA6775',
'#FFD64D',
'#9BC01C'];

var coolBlues = [
'#003B46',
'#07575B',
'#66A5AD',
'#C4DFE6'];

var lemonadeStand = [
'#F70025',
'#F25C00',
'#F9A603',
'#F29F00'];

var nightLife = [
'#00CFFA',
'#FF0038',
'#FFCE38',
'#FFFFFF'];

var brightAndPainterly = [
'#061283',
'#FD3C3C',
'#FFB74C',
'#138D90'];


var COLOR_SETS = {
  'Bright and tropical': brightAndTropical,
  'Cool blues': coolBlues,
  'Lemonade stand': lemonadeStand,
  'Night life': nightLife,
  'Bright and painterly': brightAndPainterly };


var parameters = {
  autoCreation: 'true',
  autoCreationDelay: 150,
  particlesCount: 25,
  colors: 'Night life',
  particleRadius: 7,
  speed: 6,
  deceleration: 0.017,
  maxLife: 1400,
  creationOnMousedownDelay: 25 };


var gui = new dat.GUI();
var initGui = function initGui() {
  gui.width = 300;
  gui.closed = true;
  gui.add(parameters, 'colors', ['Night life', 'Cool blues', 'Lemonade stand', 'Bright and tropical', 'Bright and painterly']);
  gui.add(parameters, 'particlesCount').min(1).max(100).step(1);
  gui.add(parameters, 'particleRadius').min(1).max(30).step(1);
  gui.add(parameters, 'speed').min(1).max(50).step(1);
  gui.add(parameters, 'deceleration').min(0).max(0.04).step(0.001);
  gui.add(parameters, 'maxLife').min(400).max(5000).step(1);
  gui.add(parameters, 'autoCreation', ['true', 'false']).onChange(
  function (newValue) {
    if (newValue === 'true') {
      addParticles();
    }
  });

  gui.add(parameters, 'autoCreationDelay').min(10).max(5000).step(5);
  gui.add(parameters, 'creationOnMousedownDelay').min(5).max(100).step(1);
};
initGui();

var canvas = document.querySelector('canvas');
var canvasCtx = canvas.getContext('2d');
var particles = [];

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);var

Particle = function () {
  function Particle(x, y) {_classCallCheck(this, Particle);var
    maxLife = parameters.maxLife,radius = parameters.radius,speed = parameters.speed,colors = parameters.colors,deceleration = parameters.deceleration;
    var colorsArray = COLOR_SETS[colors];
    this.framesCount = Math.ceil(maxLife / (1000 / 60));
    this.framesRendered = 0;
    this.opacity = 1;
    this.opacitySpeed = 1 / this.framesCount;
    this.x = x;
    this.y = y;
    this.deceleration = deceleration; //percentage of speed lost each frame
    this.color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
    this.speedX = random(-speed, speed);
    this.speedY = random(-speed, speed);
    this.radius = parameters.particleRadius;
    this.radiusSpeed = this.radius / this.framesCount;
  }_createClass(Particle, [{ key: 'frame', value: function frame(

    canvasCtx) {
      canvasCtx.fillStyle = this.color;
      canvasCtx.globalAlpha = this.opacity;
      canvasCtx.beginPath();
      canvasCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      canvasCtx.fill();
      this.opacity -= this.opacitySpeed;
      if (this.opacity < 0) {
        this.opacity = 0;
      }
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedX *= 1 - this.deceleration;
      this.speedY *= 1 - this.deceleration;
      this.radius = this.radius - this.radiusSpeed;
      if (this.radius < 0) {
        this.radius = 0;
      }
      this.framesRendered++;
      return this.framesCount >= this.framesRendered;
    } }]);return Particle;}();


function particlesFrame() {
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(function (p) {return p.frame(canvasCtx);});
  window.requestAnimationFrame(particlesFrame);
}

function addParticlesAtRandomPoint() {
  var x = canvas.width * Math.random();
  var y = canvas.height * Math.random();

  if (!document.hidden) {var _particles;
    var newParticles = new Array(parameters.particlesCount).fill(0).map(function () {return new Particle(x, y);});
    (_particles = particles).push.apply(_particles, _toConsumableArray(newParticles));
  }
  if (parameters.autoCreation === 'true') {
    setTimeout(addParticlesAtRandomPoint, parameters.autoCreationDelay);
  }
}

addParticlesAtRandomPoint();
particlesFrame();

function random(min, max) {
  return min + Math.random() * (max - min);
}

function addParticlesAtPoint(x, y) {var _particles2;
  var newParticles = new Array(parameters.particlesCount).fill(0).map(function () {return new Particle(x, y);});
  (_particles2 = particles).push.apply(_particles2, _toConsumableArray(newParticles));
}

var mouseX = 0;
var mouseY = 0;
var shouldAdd = false;

function addParticlesAtMousePosition() {
  if (shouldAdd) {
    addParticlesAtPoint(mouseX, mouseY);
  }
  setTimeout(addParticlesAtMousePosition, parameters.creationOnMousedownDelay);
}

function startAdding() {
  shouldAdd = true;
}

canvas.addEventListener('mousedown', startAdding);
canvas.addEventListener('touchstart', function (e) {var _e$touches = _slicedToArray(
  e.touches, 1),_e$touches$ = _e$touches[0],clientX = _e$touches$.clientX,clientY = _e$touches$.clientY;
  updatePositions(clientX, clientY);
  startAdding();
});

function updatePositions(x, y) {
  mouseX = x;
  mouseY = y;
}

canvas.addEventListener('mousemove', function (e) {
  updatePositions(e.clientX, e.clientY);
});
canvas.addEventListener('touchmove', function (e) {var _e$touches2 = _slicedToArray(
  e.touches, 1),_e$touches2$ = _e$touches2[0],clientX = _e$touches2$.clientX,clientY = _e$touches2$.clientY;
  updatePositions(clientX, clientY);
});

function stopAdding() {
  shouldAdd = false;
}

document.addEventListener('mouseup', stopAdding);
canvas.addEventListener('touchend', stopAdding);

addParticlesAtMousePosition();