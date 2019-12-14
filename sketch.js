/*jshint esversion: 6 */

colors = [
  "#8dd3c7",
  "#ffcc00",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9",
  "#bc80bd",
  "#ccebc5",
  "#ffed6f"
];

// Initial values
var outerMotion = {
  displacement: 0.000001,
  advancement: 0,
  rotation: 0
};

var innerMotion = {
  displacement: 0.000001,
  advancement: 0,
  rotation: 0
};

var settings;
let notch;

function preload() {
  notch = loadModel("SingleNotch.obj");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  ortho();
  settingsInit();
  if (location.protocol != "https:") {
    startConnection();
  }
}

function settingsInit() {
  settings = QuickSettings.create(0, 0, " ");
  settings.setKey("h");
  settings.addHTML(
    "SCREAM Visualization",
    `2019-20 <a href="https://wpi.edu">WPI</a> MQP.<br />
		Distances are in millimeters.<br/>Angles are in degrees.`
  );
  settings.addHTML("Sensor Status", "Sensor Not Connected!");
  settings.bindRange("displacement", 0.000001, 1, 0.000001, 0.001, outerMotion);
  settings.bindRange("advancement", 0, 22.5, 0, 0.1, outerMotion);
  settings.bindRange("rotation", 0, 360, 0, 1, outerMotion);
  settings.bindRange("displacement", 0.000001, 1, 0.000001, 0.001, innerMotion);
  settings.bindRange("advancement", 0, 22.5, 0, 0.1, innerMotion);
  settings.bindRange("rotation", 0, 360, 0, 1, innerMotion);
  settings.addButton("", () => console.log(gui.getValue("Date")));
}

document.addEventListener("keypress", tubeControl);
function tubeControl(e) {
  switch (e.key) {
    case "w":
      outerMotion.advancement = outerMotion.advancement + 0.1;
      break;
    case "s":
      outerMotion.advancement = outerMotion.advancement - 0.1;
      break;
    case "a":
      outerMotion.rotation = outerMotion.rotation + 10;
      break;
    case "d":
      outerMotion.rotation = outerMotion.rotation - 10;
      break;
    case "q":
      if (outerMotion.displacement > 0) {
        outerMotion.displacement = outerMotion.displacement - 0.01;
      }
      break;
    case "e":
      outerMotion.displacement = outerMotion.displacement + 0.01;
      break;
    case "i":
      innerMotion.advancement = innerMotion.advancement + 0.1;
      break;
    case "k":
      innerMotion.advancement = innerMotion.advancement - 0.1;
      break;
    case "l":
      innerMotion.rotation = innerMotion.rotation + 10;
      break;
    case "j":
      innerMotion.rotation = innerMotion.rotation - 10;
      break;
    case "u":
      if (innerMotion.displacement > 0) {
        innerMotion.displacement = innerMotion.displacement - 0.01;
      }
      break;
    case "o":
      innerMotion.displacement = innerMotion.displacement + 0.01;
      break;
  }
}

function draw() {
  background("white");
  orbitControl();
  translate(0, (windowHeight / 2) * 0.95);
  let scaleFactor = windowHeight / 60;
  scale(scaleFactor);
  let radians = (outerMotion.rotation * PI) / 180.0;
  let points = kinematicsPoints(
    outerMotion.displacement,
    radians,
    outerMotion.advancement
  );
  let rots = rotations(
    outerMotion.displacement,
    radians,
    outerMotion.advancement
  );
  let innerRadians = (innerMotion.rotation * PI) / 180.0;
  let innerPoints = innerKinematicsPoints(
    innerMotion.displacement,
    innerRadians,
    innerMotion.advancement
  );
  let innerRots = innerRotations(
    innerMotion.displacement,
    innerRadians,
    innerMotion.advancement
  );
  for (let i = 1; i < points.length; i++) {
    let start = points[i - 1];
    let end = points[i];
    let rotation = rots[i - 1];
    rotateX(rotation[0]);
    rotateY(rotation[2]);
    rotateZ(rotation[1]);
    stroke("#8DD3C7");
    // p5.js uses the center of the object as its origin, therefore
    // we translate half the length before and after
    translate(0, -distance(start, end) / 2);
    if (i > 2) {
      // it is a notch
      model(notch);
    } else {
      // it is the base length or advancement
      cylinder(OD / 2, distance(start, end), 24, 16, false, false);
    }
    translate(0, -distance(start, end) / 2);
  }
  let scaleFactorInner = 0.92;
  scale(scaleFactorInner);
  translate(0, 0);
  for (let i = 1; i < innerPoints.length; i++) {
    if (innerMotion.advancement > 0) {
      let start = innerPoints[i - 1];
      let end = innerPoints[i];
      let rotation = innerRots[i - 1];
      rotateX(rotation[0]);
      rotateY(rotation[2]);
      rotateZ(rotation[1]);

      stroke("#FB8072");
      // p5.js uses the center of the object as its origin, therefore
      // we translate half the length before and after
      translate(0, -distance(start, end) / 2);
      if (i > 2) {
        // it is a notch
        model(notch);
      } else {
        // it is the base length or advancement
        cylinder(OD / 2, distance(start, end), 24, 16, false, false);
      }
      translate(0, -distance(start, end) / 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ortho();
}
