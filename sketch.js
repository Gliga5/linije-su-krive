let igrac;
let zivoti;
let score;
let bombe = [];

let nos;
let linija;
let vakcina;
let bg;
let wasted;
let wave;
let audio;
let startIMG;
let font;

let start = false;

function preload() {
	nos     = loadImage('img/nos2.png');
	linija  = loadImage('img/linija.png');
	vakcina = loadImage('img/vakcina.png');
	bg      = loadImage('img/bg.jpg');
	wasted  = loadImage('img/wasted.png')
	startIMG   = loadImage('img/start.jpg')
	font    = loadFont('fonts/game_over.ttf')
}

function setup() { 	
	createCanvas(700,650);

	audio = new Audio('audio/muzika.mp3');
	audio.volume = 0.2;
	audio.loop = true;
}

function draw() {
	if (start) {
		background(bg);

		for (const bomba of bombe) {
			igrac.hitbox(bomba, score);
			bomba.izvan();
		}

		for (const bomba of bombe) {
			bomba.padati();
			bomba.show();
			bomba.dno(zivoti);
		}

		score.waves();

		igrac.show();
		zivoti.show();
		score.show();

		if (zivoti.gameover()) {
			noLoop();
			background(bg);
			image(wasted,0,0);
			audio.pause();

			push();

			textSize(128);
			textStyle(BOLD);
			textFont(font);
			textAlign(CENTER, CENTER);
			fill(0);
			text(score.broj, 700/2, 650/2+120);

			pop();
		}
	}else {
		push();

		background(startIMG);
		textSize(200);
		textFont(font);
		textStyle(BOLD);
		textAlign(CENTER, CENTER);
		fill(0);
		text("START", 700/2, 650/2-10);

		pop();
	}
}

function mousePressed() {
	if (!start) {
		audio.play();

		igrac = new Igrac(nos);
		zivoti = new Zivoti(vakcina);
		score = new Score();

		wave = setInterval(() => {
			if (!document.hidden) {
				bombe.push(new Bombe(
					random(10,690),
					random(-200,-75),
					random(2,3),
					linija
				));
			}
		}, 1000);

		start = true;
	}
}

class Igrac {
	constructor(img) {
		this.x      = 0;
		this.y 	    = 565;
		this.width  = 130;
		this.height = 170;
		this.img    = img;
	}

	hitbox(bomba, score) {
		if (bomba.y+bomba.height/2 > this.y-this.height/2 
		&& bomba.y+bomba.height/2 < this.y-this.height/8
		&& bomba.x > this.x-this.width/2
		&& bomba.x < this.x+this.width/2) {
			bombe.splice(bombe.indexOf(bomba),1);
			score.prev = score.broj;
			score.broj += 100;
		}
	}

	show() {
		this.x = mouseX;
		if (this.x > 700-this.width/2) {
			this.x = 700-this.width/2;
		}else if (this.x < this.width/2) {
			this.x = this.width/2;
		}

		push();

		imageMode(CENTER);
		image(this.img, this.x, this.y, this.width, this.height)

		/*
		stroke(126);
		line(100,this.y-this.height/2,200,this.y-this.height/2);
		line(100,this.y-this.height/5,200,this.y-this.height/5);
		*/

		/*
		noStroke();
		fill(255,255,0);
		rectMode(CENTER);
		rect(this.x, this.y, this.width, this.height);
		
		//stroke(126);
		//line(100,this.y-this.height/6,200,this.y-this.height/6);
		*/
		pop();
	}
}

class Bombe {
	constructor(x, y, speed, img) {
		this.x      = x;
		this.y 	    = y;
		this.speed  = speed;
		this.jedno  = true;
		this.width  = 20;
		this.height = 150;
		this.img    = img;
	}

	padati() {
		this.y += this.speed;
	}

	dno(zivoti) {
		if (this.y > 650-65 && this.jedno) {
			this.jedno = false;
			zivoti.broj--;
		}
	}

	izvan() {
		if (this.y-this.height/2 > 650) {
			bombe.splice(bombe.indexOf(this),1);
		}
	}

	show() {
		push();

		imageMode(CENTER);
		image(this.img, this.x, this.y, this.width, this.height)

		/*
		noStroke();
		fill(210,75,150);
		rectMode(CENTER);
		rect(this.x, this.y, this.width, this.height);
		*/
		pop();
	}
}

class Zivoti {
	constructor(img) {
		this.broj   = 3;
		this.x      = 20;
		this.space  = 40;
		this.y      = 20;
		this.width  = 35;
		this.height = 35;
		this.img    = img;
	}

	gameover() {
		return (this.broj <= 0);
	}

	show() {
		push();

		imageMode(CENTER);
		for (let i = 0; i < this.broj; i++) {
			image(this.img, this.x+i*this.space, this.y, this.width, this.height)
		}

		/*
		noStroke();
		fill(235,0,0);
		ellipseMode(CENTER);
		for (let i = 0; i < this.broj; i++) {
			circle(20+i*40, 580, 25);
		}
		*/
		pop();
	}
}

class Score {
	constructor() {
		this.broj = 0;
		this.prev = 0;
		this.wave = 2000;

		this.interval = 0;
		this.fast     = 0;
	}

	waves() {
		if (this.broj != 0 && this.broj == this.wave) {
			clearInterval(wave);

			this.interval++;
			this.fast++;
			this.wave += 2000;

			if (this.interval > 3.65) {
				this.interval = 3.65;
			}

			setTimeout(() => {
				wave = setInterval(() => {
					if (!document.hidden) {
						bombe.push(new Bombe(
							random(10,690),
							random(-200,-75),
							random(2+this.fast,3+this.fast), // sdadsdsda
							linija
						));
					}
				}, 1000-this.interval*200);
			},5000)	

			console.log(this.interval+ ", "+this.fast+", "+this.wave);
		}
	}

	show() {
		push();
		textSize(80);
		textFont(font);
		textStyle(BOLD);
		textAlign(RIGHT, CENTER);
		fill(255);
		text(this.broj, 700-10, 15);
		pop();
	}
}