"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
import { DragControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/DragControls.js";

const del_btn = document.getElementById("delete-shape-btn");
const size = 50;
const PI = 3.141592653589793;
const divisions = 25;
const addShapeButton = document.getElementById("add-shape-btn");
const moveButton = document.getElementById("move-button");
const lockVertices = document.getElementById("lock-vertices-cb");
const modalAdd = document.getElementById("add-modal");
const container = document.getElementById("canvas-main");
const spanAddModal = document.getElementsByClassName("close")[0];
const xyGrid = document.getElementById("xy-grid-cb");
const yzGrid = document.getElementById("yz-grid-cb");
const xzGrid = document.getElementById("xz-grid-cb");
const hx = document.getElementById("h-x"),
  hy = document.getElementById("h-y"),
  hz = document.getElementById("h-z");
let currentObject = null;

del_btn.onclick = function () {
  if (currentObject) {
    currentObject.userData.controls.dispose();

    scene.remove(currentObject);

    currentObject = null;
  }
};
function createShape(shape, position = null) {
  switch (shape) {
    case "Cube":
      if (currentObject) {
        scene.remove(currentObject);
        currentObject = null;
      }
      const geometry = new THREE.BoxBufferGeometry();
      const material = new THREE.MeshNormalMaterial();
      const cube = new THREE.Mesh(geometry, material);
      if (position) {
        cube.position.set(position.x, position.y, position.z);
      } else {
        cube.position.set(0, 0, 0);
      }
      cube.userData.draggable = true;
      cube.userData.id = "cube";
      scene.add(cube);
      currentObject = cube;
      return cube;
      break;
    case "Tetrahedron":
      if (currentObject) {
        scene.remove(currentObject);
        currentObject = null;
      }
      const tetrahedronGeometry = new THREE.TetrahedronGeometry();
      const tetrahedronMaterial = new THREE.MeshNormalMaterial({});
      const tetrahedron = new THREE.Mesh(
        tetrahedronGeometry,
        tetrahedronMaterial
      );
      if (position) {
        tetrahedron.position.set(position.x, position.y, position.z);
      } else {
        tetrahedron.position.set(0, 0, 0);
      }
      tetrahedron.userData.draggable = true;
      tetrahedron.userData.id = "tetrahedron";
      currentObject = tetrahedron;
      scene.add(tetrahedron);
      return tetrahedron;
      break;
    case "Octahedron":
      if (currentObject) {
        scene.remove(currentObject);
        currentObject = null;
      }
      const octahedronGeometry = new THREE.OctahedronGeometry();
      const octahedronMaterial = new THREE.MeshNormalMaterial({});
      const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
      if (position) {
        octahedron.position.set(position.x, position.y, position.z);
      } else {
        octahedron.position.set(0, 0, 0);
      }
      octahedron.userData.draggable = true;
      octahedron.userData.id = "octahedron";
      currentObject = octahedron;
      scene.add(octahedron);
      return octahedron;
      break;
    case "Dodecahedron":
      if (currentObject) {
        scene.remove(currentObject);
        currentObject = null;
      }
      const dodecahedronGeometry = new THREE.DodecahedronGeometry();
      const dodecahedronMaterial = new THREE.MeshNormalMaterial({
        color: 0x00ff00,
      });
      const dodecahedron = new THREE.Mesh(
        dodecahedronGeometry,
        dodecahedronMaterial
      );
      if (position) {
        dodecahedron.position.set(position.x, position.y, position.z);
      } else {
        dodecahedron.position.set(0, 0, 0);
      }
      dodecahedron.userData.draggable = true;
      dodecahedron.userData.id = "dodecahedron";
      currentObject = dodecahedron;
      scene.add(dodecahedron);
      return dodecahedron;
      break;

    case "point":
      break;
    default:
      break;
  }
}

addShapeButton.onclick = function () {
  modalAdd.style.display = "block";
  const button = document.querySelector(".add-button");
  button.onclick = function () {
    const xcoord = document.getElementById("x1").value;
    const ycoord = document.getElementById("y1").value;
    const zcoord = document.getElementById("z1").value;
    const shape = document.getElementById("shape-add-dropdown").value;
    const position = new THREE.Vector3(xcoord, ycoord, zcoord);
    const obj = createShape(shape, position);
    const controls = new DragControls([obj], camera, renderer.domElement);
    obj.userData.controls = controls;

    if (!currentObject.userData.draggable) {
      controls.enabled = false;
    }
    modalAdd.style.display = "none";
  };
};
spanAddModal.onclick = function () {
  modalAdd.style.display = "none";
};
lockVertices.addEventListener("click", () => {
  if (lockVertices.checked) {
    //  disable the drag controls
    if (currentObject !== null) {
      currentObject.userData.controls.enabled = false;
    }
    orbit.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
  } else {
    //  enable the frag controls

    if (currentObject !== null) {
      currentObject.userData.controls.enabled = true;
    }
    orbit.mouseButtons = {
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
  }
});
xyGrid.addEventListener("click", () => {
  if (xyGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 0, 1);
    grid.lookAt(vector3);
    xygrid.push(grid);
    scene.add(xygrid[0]);
    console.log(scene.children);
  } else {
    scene.remove(xygrid[0]);
    xygrid.pop();
  }
});
xzGrid.addEventListener("click", () => {
  if (xzGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    grid.geometry.rotateZ(PI / 2);
    xzgrid.push(grid);
    scene.add(xzgrid[0]);
  } else {
    scene.remove(xzgrid[0]);
    xzgrid.pop();
  }
});
yzGrid.addEventListener("click", () => {
  if (yzGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 1, 0);
    grid.lookAt(vector3);
    yzgrid.push(grid);
    scene.add(yzgrid[0]);
  } else {
    scene.remove(yzgrid[0]);
    yzgrid.pop();
  }
});
document.getElementById("h-s").onchange = function () {
  scale = document.getElementById("h-s").value;
  document.getElementById("h-x").value =
    document.getElementById("x-value").value * scale;
  document.getElementById("h-y").value =
    document.getElementById("y-value").value * scale;
  document.getElementById("h-z").value =
    document.getElementById("z-value").value * scale;
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
moveButton.onclick = function () {
  const x = document.getElementById("x-value").value;
  const y = document.getElementById("y-value").value;
  const z = document.getElementById("z-value").value;

  if (currentObject) {
    currentObject.position.set(x, y, z);

    const scale = document.getElementById("h-s").value;

    hx.value = x * scale;
    hy.value = y * scale;
    hz.value = z * scale;
  }
};
const renderer = new THREE.WebGLRenderer();
const orbit = new OrbitControls(camera, renderer.domElement);
let xygrid = [];
let xzgrid = [];
let yzgrid = [];
let scale = 1;
let arrowHelper = [];

camera.position.z = -5;
camera.position.x = 2;
camera.position.y = 2;
scene.background = new THREE.Color(0x121212);
const w = container.offsetWidth;
const h = container.offsetHeight;
renderer.setSize(w, h);
container.appendChild(renderer.domElement);
function init() {
  const dir_x = new THREE.Vector3(1, 0, 0);
  const dir_y = new THREE.Vector3(0, 1, 0);
  const dir_z = new THREE.Vector3(0, 0, 1);
  const negdir_x = new THREE.Vector3(-1, 0, 0);
  const negdir_y = new THREE.Vector3(0, -1, 0);
  const negdir_z = new THREE.Vector3(0, 0, -1);
  const origin = new THREE.Vector3(0, 0, 0);
  const length = 10;
  arrowHelper[0] = new THREE.ArrowHelper(dir_x, origin, length, "red");
  arrowHelper[1] = new THREE.ArrowHelper(dir_y, origin, length, "yellow");
  arrowHelper[2] = new THREE.ArrowHelper(dir_z, origin, length, "blue");
  arrowHelper[3] = new THREE.ArrowHelper(negdir_x, origin, length, "red");
  arrowHelper[4] = new THREE.ArrowHelper(negdir_y, origin, length, "yellow");
  arrowHelper[5] = new THREE.ArrowHelper(negdir_z, origin, length, "blue");
  arrowHelper.forEach((axis) => scene.add(axis));

  orbit.mouseButtons = {
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.ROTATE,
  };
  orbit.target.set(0, 0, 0);
  orbit.enableDamping = true;
}
let mainLoop = function () {
  requestAnimationFrame(mainLoop);
  renderer.render(scene, camera);
  if (currentObject != null) {
    hx.value = (currentObject.position.x * scale).toFixed(2);
    hy.value = (currentObject.position.y * scale).toFixed(2);
    hz.value = (currentObject.position.z * scale).toFixed(2);
  }
};
init();
mainLoop();
