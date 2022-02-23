import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
// var container = document.getElementById( 'hello' );
// document.body.appendChild( container );

let scene, camera, renderer;
let cube = [];
var tmp;
let vector = [];
let rot = 0.01;
let variable = 0;
let fac = 0;
let con = 0;

// xcor, ycor and zcor are the coordinates of the point to be added (given as input by the user) in expt1.
var xcor = 3;
var ycor = 3;
var zcor = 3;

// const shMaterial = new THREE.ShaderMaterial({

// 	uniforms: {
// 		time: { value: 1.0 },
// 		resolution: { value: new THREE.Vector2() }
// 	},

// 	// vertexShader: document.getElementById('vertexShader').textContent,
// 	// if( vertexShader )
// 	// {
// 	// 	vertexShader = vertexShader.textContent;
// 	// }
// 	// fragmentShader: document.getElementById('fragmentShader').textContent

// });

function vertexShader() {
  return `varying vec3 vUv; 
  
              void main() {
                vUv = position; 
  
                vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewPosition; 
              }`;
}
function fragmentShader() {
  return `uniform vec3 colorA; 
                uniform vec3 colorB; 
                varying vec3 vUv;
  
                void main() {
              gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
                }`;
}

var buttons = document.getElementsByTagName("button");
buttons[0].addEventListener("click", XY, false);
buttons[1].addEventListener("click", XZ, false); //
buttons[2].addEventListener("click", YZ, false);
buttons[3].addEventListener("click", Change, false);
buttons[4].addEventListener("click", Rotate, false);
buttons[5].addEventListener("click", Delete, false);
buttons[6].addEventListener("click", Add, false);
buttons[7].addEventListener("click", ADD, false);
const size = 50;
const divisions = 25;
function XY(event) {
  var grid3 = new THREE.GridHelper(size, divisions);
  var vector3 = new THREE.Vector3(0, 0, 1);
  grid3.lookAt(vector3);
  scene.add(grid3);
}

function XZ(event) {
  var grid1 = new THREE.GridHelper(size, divisions);
  var vector1 = new THREE.Vector3(0, 1, 0);
  grid1.lookAt(vector1);
  scene.add(grid1);
}
function YZ(event) {
  var grid2 = new THREE.GridHelper(size, divisions);
  grid2.geometry.rotateZ(Math.PI / 2);
  scene.add(grid2);
}
function Change(event) {
  scene.remove(arrowHelper2);
  scene.remove(arrowHelper5);
  camera.position.y = 3;
  camera.position.x = 0;
  camera.position.z = 0;
  orbit.minPolarAngle = 0;
  orbit.maxPolarAngle = 0;
}
function Delete(event) {
  scene.remove(cube[cube.length - 1]);
  cube.pop();
  // var dotGeometry = new THREE.Geometry();
  // dotGeometry.vertices.push(new THREE.Vector3(xcor, ycor, 0));
  var PointGeometry = Dot();
  con = 0;
}

function ADD(event) {
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(new THREE.Vector3(xcor, ycor, zcor));
  var dotMaterial = new THREE.PointsMaterial({
    size: 4,
    sizeAttenuation: false,
  });
  var dot = new THREE.Points(dotGeometry, dotMaterial);
  scene.add(dot);
}

function Add(event) {
  createCube();
  scene.remove(dott[0]);
  con = 1;
}

function Rotate(event) {
  if (variable == 0) {
    variable = 1;
  } else {
    variable = 0;
  }
  console.log(variable);
}

/////////// for shadows
function createLights() {
  // Create a directional light
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 9);
  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  scene.add(ambientLight);

  // move the light back and up a bit
  mainLight.position.set(10, 10, 10);

  // remember to add the light to the scene
  scene.add(ambientLight, mainLight);
}

scene = new THREE.Scene();
scene.background = new THREE.Color("black");
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

function createMaterials() {
  const cubeShader = new THREE.ShaderMaterial({
    uniforms: {
      colorA: { type: "vec3", value: new THREE.Color(0xff0000) },
      colorB: { type: "vec3", value: new THREE.Color(0x0000ff) },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  });

  return {
    cubeShader,
  };
}

function createGeometries() {
  const cube = new THREE.BoxGeometry(1, 1, 1);
  return {
    cube,
  };
}
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;
var point = [];
var dott = [];

document.addEventListener("pointermove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  if (isDragging && con == 1) {
    raycaster.ray.intersectPlane(plane, planeIntersect);
    cube[cube.length - 1].geometry.vertices[0].set(
      planeIntersect.x + shift.x,
      planeIntersect.y + shift.y,
      planeIntersect.z + shift.z
    );
    cube[cube.length - 1].geometry.verticesNeedUpdate = true;
    point[0].position.set(
      planeIntersect.x + shift.x - 0.5,
      planeIntersect.y + shift.y - 0.5,
      planeIntersect.z + shift.z - 0.5
    );
  } else if (isDragging && con == 0) {
    raycaster.ray.intersectPlane(plane, planeIntersect);
    //  dot.geometry.verticesNeedUpdate = true;
    dott[0].position.set(
      planeIntersect.x + shift.x,
      planeIntersect.y + shift.y,
      planeIntersect.z + shift.z
    );
    // console.log(dott[0].position);
  }
});
document.addEventListener("pointerdown", () => {
  switch (event.which) {
    case 1:
      //     alert('Left Mouse button pressed.');
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      pNormal.copy(camera.position).normalize();
      plane.setFromNormalAndCoplanarPoint(pNormal, scene.position);
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, planeIntersect);
      if (con == 1) {
        shift.subVectors(point[0].position, planeIntersect);
        //console.log(point[0].position);
      } else {
        shift.subVectors(dott[0].position, planeIntersect);
        // console.log(planeIntersect);
        //dott[0].translate(1,1,1);
        //console.log(dott[0].position);
      }
      isDragging = true;
      dragObject = cube[cube.length - 1];
      break;
  }
});

document.addEventListener("pointerup", () => {
  isDragging = false;
  dragObject = null;
});

//////////

let init = function () {
  camera.position.z = 5;
  camera.position.x = 2;
  camera.position.y = 2;
  const gridHelper = new THREE.GridHelper(size, divisions);
  const dir1 = new THREE.Vector3(1, 0, 0);
  const dir2 = new THREE.Vector3(0, 1, 0);
  const dir3 = new THREE.Vector3(0, 0, 1);
  const dir4 = new THREE.Vector3(-1, 0, 0);
  const dir5 = new THREE.Vector3(0, -1, 0);
  const dir6 = new THREE.Vector3(0, 0, -1);
  //dir1.normalize();
  const origin = new THREE.Vector3(0, 0, 0);
  const length = 10;
  const arrowHelper1 = new THREE.ArrowHelper(dir1, origin, length, "red");
  const arrowHelper2 = new THREE.ArrowHelper(dir2, origin, length, "yellow");
  const arrowHelper3 = new THREE.ArrowHelper(dir3, origin, length, "blue");
  const arrowHelper4 = new THREE.ArrowHelper(dir4, origin, length, "red");
  const arrowHelper5 = new THREE.ArrowHelper(dir5, origin, length, "yellow");
  const arrowHelper6 = new THREE.ArrowHelper(dir6, origin, length, "blue");

  for (let i = 0; i < 8; i++) {
    const direction = new THREE.Vector3(i + 1, 0, 0);
    const negdirection = new THREE.Vector3(-(i + 1), 0, 0);
    var len = 0.05;
    const negdir = new THREE.Vector3(i + 1, -len, 0);
    const negative_negdir = new THREE.Vector3(-(i + 1), -len, 0);
    const variable = new THREE.ArrowHelper(dir2, direction, len, "yellow");
    const negvariable = new THREE.ArrowHelper(
      dir2,
      negdirection,
      len,
      "yellow"
    );
    const vari = new THREE.ArrowHelper(dir2, negdir, len, "yellow");
    const negvari = new THREE.ArrowHelper(dir2, negative_negdir, len, "yellow");
    scene.add(variable);
    scene.add(vari);
    scene.add(negvariable);
    scene.add(negvari);
  }
  scene.add(arrowHelper1);
  scene.add(arrowHelper2);
  scene.add(arrowHelper3);
  scene.add(arrowHelper4);
  scene.add(arrowHelper5);
  scene.add(arrowHelper6);

  //  createCube();
  var PointGeometry = Dot();
  renderer = new THREE.WebGLRenderer();
  var container = document.getElementById("hello");
  var w = container.offsetWidth;
  var h = container.offsetHeight;
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);
  // renderer.setSize( 1200, 600 );
  // document.body.appendChild(renderer.domElement);

  var orbit = new OrbitControls(camera, renderer.domElement);
  orbit.mouseButtons = {
    //  LEFT: MOUSE.PAN,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.ROTATE,
  };
  orbit.target.set(0, 0, 0);
  orbit.enableDamping = true;
};
let createCube = function () {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  cube.push(cub);
  scene.add(cube[cube.length - 1]);
  let count = 0;
  let count1 = 0.5,
    count2 = 0.5,
    count3 = 0.5;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3(count1, count2, count3));
        var dotMaterial = new THREE.PointsMaterial({
          color: "white",
          size: 6,
          sizeAttenuation: false,
        });
        var dot = new THREE.Points(dotGeometry, dotMaterial);
        point.push(dot);
        cube[cube.length - 1].add(point[point.length - 1]);
        count1 = -count1;
      }
      count2 = -count2;
    }
    count3 = -count3;
  }
  /* var dotGeometry = new THREE.Geometry();
      dotGeometry.vertices.push(new THREE.Vector3(xcor, ycor, zcor));
      var dotMaterial = new THREE.PointsMaterial({
        size: 4,
        sizeAttenuation: false,
      });
      var point = new THREE.Points(dotGeometry, dotMaterial);
      dott.push(point);
      cube[cube.length - 1].add(dott[dott.length - 1]);*/
  //  console.log(point[0].position);
};
let Dot = function () {
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(new THREE.Vector3(xcor, ycor, zcor));
  var dotMaterial = new THREE.PointsMaterial({
    size: 6,
    sizeAttenuation: false,
  });
  var point = new THREE.Points(dotGeometry, dotMaterial);
  dott.push(point);
  scene.add(dott[0]);
  console.log(dotGeometry.vertices[0]);
  return dotGeometry;
};

let mainLoop = function () {
  if (variable == 1) {
    for (let cub of cube) {
      cub.rotation.y += rot;
      if (cub.position.x <= -3 || cub.position.x >= 3) rot *= -1;
    }
  }

  // orbit.update();
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};
init();
mainLoop();

