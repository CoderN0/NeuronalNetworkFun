function mutate(x) {
	if (random(1) < 0.1) {
		let offset = randomGaussian() * 0.5;
		let newx = x + offset;
		return newx;
	} else {
		return x;
	}
}

class Ball {
	constructor(c, brain, m = 'yes') {
		this.r = 20;
		this.x = width / 2;
		this.y = height - this.r;
		this.c = c;

		this.velocity = 0;
		this.velocity_lr = 0;
		this.speed = -8;
		this.speed_lr = 8;
		this.gravity = 0.5;

		this.score = 0;
		if (brain instanceof NeuralNetwork) {
			this.brain = brain.copy();
			if (m == 'yes') {
				this.brain.mutate(mutate);
			}
		} else {
			this.brain = new NeuralNetwork(10, 32, 3);
		}
	}

	draw() {
		noStroke();
		fill(this.c);
		circle(this.x, this.y, this.r * 2);
	}

	update() {
		if (this.y + this.r > height) {
			this.velocity = 0;
			this.gravity = 0;
			this.y = height - this.r;
		} else {
			this.gravity = 0.8;
		}
		this.velocity += this.gravity;
		this.y += this.velocity;
		this.x += this.velocity_lr;
	}

	jump() {
		this.velocity = this.speed;
	}

	left() {
		this.velocity_lr = -this.speed_lr;
	}

	right() {
		this.velocity_lr = this.speed_lr;
	}
	think(inp) {
		return this.brain.predict(inp);
	}
}
