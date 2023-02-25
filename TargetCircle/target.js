class Target {
	constructor(x, y, d) {
		this.x = x;
		this.y = y;
		this.d = d;
	}

	draw() {
		noFill();
		strokeWeight(5);
		stroke(255, 0, 0);
		circle(this.x, this.y, this.d);
		// stroke();
		// circle(this.x, this.y, this.d - 5);
		// stroke(0);
	}
}
