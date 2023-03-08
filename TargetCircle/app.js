const inputs = [];
let balls = [];
let oldGen = [];
let removed = [];
let thoughts = [];
let resetActive = false;

const ballCount = 50;
const frames = 1000;

function setup() {
	createCanvas(600, 600);
	background(0);
	target = new Target(width / 2, height / 2, 80);
	target.draw();

	for (let i = 0; i < ballCount; i++) {
		let c = color(random(255), random(255), random(255));
		balls.push(new Ball(c));
	}
}

function draw() {
	background(0);

	target.draw();
	// for (let ball in balls) {
	for (let i = 0; i < balls.length; i++) {
		//Inputs NN
		inputs[0] = balls[i].y / height;
		inputs[1] = balls[i].velocity / balls[i].speed;
		inputs[2] = (target.y + target.d) / height;
		inputs[3] = (target.y - target.d) / height;
		inputs[4] = (target.y - balls[i].y) / height;
		inputs[5] = balls[i].x / width;
		inputs[6] = balls[i].velocity_lr / balls[i].speed_lr;

		//NN Prediction
		thoughts = balls[i].think(inputs);
		if (thoughts[0] > 0.5) {
			balls[i].jump();
		}
		if (thoughts[1] > 0.25) {
			balls[i].left();
		}
		if (thoughts[2] > 0.25) {
			balls[i].right();
		}

		//Check if Ball is in Circle
		if (
			balls[i].y - balls[i].r > target.y - target.d &&
			balls[i].y + balls[i].r < target.y + target.d
		) {
			balls[i].score++;
		}

		//Update Balls
		balls[i].update();
		balls[i].draw();

		// //Remove Balls from Gen
		// if (balls[i].y + balls[i].r < 0) {
		// 	let remBall = balls.splice(i, 1);
		// 	removed.push(remBall[0]);
		// }
		if (
			balls[i].y + balls[i].r < 0 ||
			balls[i].x + balls[i].r < 0 ||
			balls[i].x - balls[i].r > width
		) {
			let remBall = balls.splice(i, 1);
			removed.push(remBall[0]);
		}

		//Reset
		if (balls.length == 0 || frameCount > frames) {
			reset();
		}
	}
	textSize(30);
	text(
		`${round(thoughts[0], 3)} - ${round(thoughts[1], 3)} - ${round(
			thoughts[2],
			3
		)} `,
		5,
		35
	);
	text(balls.length, 5, 70);
	text(frameCount, 5, 105);
}

function reset() {
	resetActive = true;
	noLoop();
	oldGen = [];
	oldGen = removed.concat(balls);
	let fitty = fittest(oldGen);
	balls = [];
	removed = [];
	log;
	if (fitty.score > 800) {
		let c = color(random(255), random(255), random(255));
		balls.push(new Ball(fitty.c, fitty.brain, 'no'));
	} else {
		for (let i = 0; i < ballCount; i++) {
			let c = color(random(255), random(255), random(255));
			balls.push(new Ball(c, fitty.brain));
		}
	}
	frameCount = 0;
	loop();
}

function fittest(arr) {
	let highSorce = 0;
	let hsIndex;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].score > highSorce) {
			highSorce = arr[i].score;
			hsIndex = i;
		}
	}
	console.log('Highscore', highSorce);
	return arr[hsIndex];
}
