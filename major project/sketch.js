let margin = 2;
let N = 36;
let u, v;
let backCol = "#fffcf2";
let palette = ["#050505", "#2b67af", "#ef562f", "#f2eac1"], mainCol = "#f9d531";
let allColors = [...palette.slice(1), mainCol];let rectangles = [];

let randInt = (a, b) => (Math.floor(Math.random() * (b - a) + a));

let xoff = 0;
let yoff = 1000;

// Set the canvas size
function setup() {
  createCanvas(500, 500);
 
  // Calculate the width of each cube
  u = width / N;
  // Calculate the boundaries of each cube
  v = u / 4;
 
  createComposition();
  
}

// Drawing Functions
function draw() {
  // Draw the background color
  background(backCol);
  
  translate(width/2,height/2)
	for(var i=0;i<400;i++){
		let ang = i/10 + frameCount/50;
		let r = i + noise(i/10)*map(mouseX,0,width,0,100)
		fill(0,0,255,random(255));
		textSize(17);
		text(['HELLO'[i%5]],cos(ang)*r,sin(ang)*r);
	}
  translate(-width/2,-height/2)
  
  // No Stroke
  noStroke()
  randomSeed(2)
  
  // Iterate over all the cubes
  for (let recta of rectangles) {
    // Drawing small squares
    drawRectangle(recta.i * u, recta.j * u, 15, 15, recta.insideCol);
  }
}


function  mouseClicked(){
       palette = []
    createComposition();

      for (let i = 0; i < 12; i++) {
        // Generate random hexadecimal colors
        let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        // Add the generated color to the array
        palette.push(randomColor); 
  }
  mainCol = '#' + Math.floor(Math.random()*16777215).toString(16)
    allColors = [...palette.slice(1), mainCol]
  
}

// Creating Combined Pattern Functions
function createComposition() {
  // Generate random cubes and add them to the array until you reach a certain number.
  for (let i = 0; i < 2000; i++) {
    let newRecta = generateRectangle();
    let canAdd = true;
    // Check if the newly generated cube intersects an existing cube in the array.
    for (let recta of rectangles) {
      if (rectanglesIntersect(newRecta, recta)) {
        canAdd = false;
        break;
      }
    }

    // Add to array if disjoint
    if (canAdd) {
      rectangles.push(newRecta);
    }
  }

  // Generate a circle of small squares around the edge
  for (let i = margin; i < N - margin; i++) {
    for (let j = margin; j < N - margin; j++) {
      let newRecta = {
        i: i,
        j: j,
        si: 1,
        sj: 1
      }
      let canAdd = true;

      // Check if the newly generated cube intersects an existing cube in the array.
      for (let recta of rectangles) {
        if (rectanglesIntersect(newRecta, recta)) {
          canAdd = false;
          break;
        }
      }

      // Add to array if disjoint
      if (canAdd) {
        rectangles.push(newRecta);
      }
    }
  }

  // Assign internal colors to some of the smaller squares
  let colors = [...allColors, ...allColors];
  let i = 0;
  while (colors.length > 0) {
    if (rectangles[i].si > 1 && rectangles[i].sj > 1 && (rectangles[i].si + rectangles[i].sj) < 7) rectangles[i].insideCol = colors.pop();
    i++;
    if (i >= rectangles.length) break;
  }
}

// Determine if two cubes intersect
function rectanglesIntersect(recta1, recta2) {
  return ((recta1.i <= recta2.i && recta1.i + recta1.si > recta2.i) || (recta2.i <= recta1.i && recta2.i + recta2.si > recta1.i)) && ((recta1.j <= recta2.j && recta1.j + recta1.sj > recta2.j) || (recta2.j <= recta1.j && recta2.j + recta2.sj > recta1.j));
}

// Generate random cubes
function generateRectangle() {
  let si, sj;
  do {
    // Randomly generate si and sj
    si = Math.floor(randInt(3, 10) / 2);
    sj = Math.floor(randInt(3, 10) / 2);
  } while ((si == 1 && sj == 1) || (si >= 4 && sj >= 4))
  // Randomly generate i and j
  let i = randInt(margin, N - margin - si + 1);
  let j = randInt(margin, N - margin - sj + 1);
  let recta = {
    i: i,
    j: j,
    si: si,
    sj: sj
  };
  return recta;
}

// Define a function that draws a rectangle with an inner color
function drawRectangle(x0, y0, si, sj, insideCol) {
  // If there is an internal color parameter
  if (insideCol) {
    // Fill internal colors
    fill(insideCol);
    // Draw the inner rectangle
    rect(x0 + 2 * v, y0 + 2 * v, si - 3 * v, sj - 3 * v);
    // If the difference between the length and width of the rectangle is less than 2 * u
    if (Math.abs(si - sj) < 2 * u) {
      // Choose a color at random
      fill(random(allColors));
      // Draw internal rectangles with different aspect sizes
      if (si < sj) {
        rect(x0 + 3 * v, y0 + (sj - (si - 6 * v)) / 2, si - 5 * v, si - 5 * v);
      } else if (sj < si) {
        rect(x0 + (si - (sj - 6 * v)) / 2, y0 + 3 * v, sj - 5 * v, sj - 5 * v);
      }
    }
  }

  // Initialize variables for storing colors
  let prevCol1, prevCol2, newCol;
  let w = map(noise(xoff), 0, 1, -20, 40);
  let h = map(noise(yoff), 0, 1, -20, 40);

  xoff += 0.01;
  yoff += 0.01;

  // Cycle through the rectangles horizontally
  for (let x = x0; x < x0 + si + v / 2; x += v) {
    // select a new color that is different from the previous one
    do {
      newCol = random(palette);
    } while (newCol == prevCol1)
    // Use the primary color with a 2/3 probability
    if (random(1) < 2 / 3) newCol = mainCol;
    // Fill colors and draw rectangles
    fill(newCol);
    prevCol1 = newCol;
    rect(x+w, y0+h, v, v);

    // select a new color that is different from the previous one
    do {
      newCol = random(palette);
    } while (newCol == prevCol2)
    // Use the primary color with a 2/3 probability
    // if (Math.random() < 2 / 3) newCol = mainCol;
    // Fill colors and draw rectangles
    fill(newCol);
    prevCol2 = newCol;
    rect(x+w, y0 + sj+h, v, v);
  }

 
}
