/*jshint esversion: 6 */

transpose = a => a[0].map((x, i) => a.map(y => y[i]));
mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));
dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);

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
  tube_points = [];
}

function settingsInit() {
  settings = QuickSettings.create(0, 0, " ");
  settings.setKey("h");
  settings.addHTML(
    "SCREAM 2 Visualization",
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
  settings.addButton("Toggle STL", () => location.replace("./index.HTML"));
  settings.addButton("Change End Effector", () => console.log(gui.getValue("Date")));

}

document.addEventListener("keypress", tubeControl);
function tubeControl(e) {
  switch (e.key) {
    case "`":
      outerMotion.advancement = outerMotion.advancement + 0.1;
      break;
    case "~":
      outerMotion.advancement = outerMotion.advancement - 0.1;
      break;
    case "!":
      outerMotion.rotation = outerMotion.rotation + 10;
      break;
    case "@":
      outerMotion.rotation = outerMotion.rotation - 10;
      break;
    case "#":
      if (outerMotion.displacement > 0) {
        outerMotion.displacement = outerMotion.displacement - 0.01;
      }
      break;
    case "$":
      outerMotion.displacement = outerMotion.displacement + 0.01;
      break;
    case "%":
      innerMotion.advancement = innerMotion.advancement + 0.1;
      break;
    case "^":
      innerMotion.advancement = innerMotion.advancement - 0.1;
      break;
    case "&":
      innerMotion.rotation = innerMotion.rotation + 10;
      break;
    case "*":
      innerMotion.rotation = innerMotion.rotation - 10;
      break;
    case "{":
      if (innerMotion.displacement > 0) {
        innerMotion.displacement = innerMotion.displacement - 0.01;
      }
      break;
    case "}":
      innerMotion.displacement = innerMotion.displacement + 0.01;
      break;
  }
}





function checkForCollision(points){
  for(let i = 0; i < points.length; i++){
    for(let j = 0; j < task_space_v.length; j++){
      if ( dist(points[i][0], points[i][1], points[i][2], task_space_v[j][0],task_space_v[j][1],task_space_v[j][2]) < 90 ){
        print("COLLISION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        return [task_space_v[j][0],task_space_v[j][1],task_space_v[j][2]]
      }
      else{
        //print("OK")
      }
    }
  }
}

function draw() {
  background("white");
  orbitControl();
  let cursor = [0,0,0];
  
  //strokeWeight(3);
  //stroke("#447825");
  //DEBUG POINT TRANSFORMATION FUNCTIONS
  /*
  beginShape(POINTS);
  for(let i = 0; i < task_space_v.length; i = i + 5){
    //vertex(task_space_v[i][0],task_space_v[i][1],task_space_v[i][2])
  }
  endShape();
  stroke("#000000");
  beginShape(POINTS);
  for(let i = 0; i < task_space.vertices.length; i = i + 5){
    //vertex(task_space.vertices[i].x,task_space.vertices[i].y,task_space.vertices[i].z)
  }
  endShape();
  */
  

  translate(0, (windowHeight / 2) * 0.95);
  let scaleFactor = windowHeight / 120;
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
    fill(255,255,255,255);
    // p5.js uses the center of the object as its origin, therefore
    // we translate half the length before and after
    translate(0, -distance(start, end) / 2);
    
    if (i > 2) {
      // it is a notch
      model(notch);
      // ADD CYLINDER HITBOX HERE
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
      print(tf.x)
      if (i > 2) {
        // it is a notch
        model(notch);
        // ADD CYLINDER HITBOX HERE

      } else {
        // it is the base length or advancement
        cylinder(OD / 2, distance(start, end), 24, 16, false, false);
      }
      translate(0, -distance(start, end) / 2);
    }
  }
  let vc = checkForCollision(points);
  if(vc){
    print(vc)
      strokeWeight(100);
      stroke("#ff69b4");
      beginShape(POINTS);
      vertex(vc[0],vc[1],vc[2]);
      endShape();
  }
 
  //DEBUG TUBE POINT TRANSFORMATION
  beginShape(POINTS);
  stroke("#ff69b4");
  strokeWeight(10);

  for(let i = 0; i < points.length; i++){
   // vertex(points[i][0],points[i][1],points[i][2])
  }
  endShape();
    
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ortho();
}

