var sprites = {
    water: { sx: 0, sy: 0, w: 0, h: 0, frames: 0 },

    coche_azul: { sx: 0, sy: 0, w: 103, h: 48, frames: 1 },
    coche_verde: { sx: 103, sy: 0, w: 104, h: 48, frames: 1 },
    coche_amarillo: { sx: 209, sy: 0, w: 104, h: 48, frames: 1 },
    camion_corto: { sx: 0, sy: 64, w: 139, h: 47, frames: 1 },
    camion_largo: { sx: 150, sy: 64, w: 200, h: 45, frames: 1 },

    short_trunk: { sx: 271, sy: 174, w: 130, h: 37, frames: 1 },
    medium_trunk: { sx: 10, sy: 125, w: 192, h: 37, frames: 1 },
    large_trunk: { sx: 10, sy: 174, w: 248, h: 37, frames: 1 },
   

   

    frog: { sx: 0, sy: 340, w: 40, h: 45, frames: 7 },
    death: { sx: 211, sy: 126, w: 48, h: 36, frames: 4 },

    turtle1: { sx: 283, sy: 344, w: 50, h: 45, frames: 2 },
    turtle2: { sx: 5, sy: 288, w: 50, h: 45, frames: 8 },

    BackGround: { sx: 421, sy: 0, w: 549, h: 625, frames: 1 },
    logo: { sx: 5, sy: 393, w: 265, h: 173, frames: 1 },
    home: { sx: 421, sy: 0, w: 549, h: 49, frames: 1 }
   
    
};

var OBJECT_PLAYER = 1,
    OBJECT_TRUNK = 2,
    OBJECT_CAR = 4,
    OBJECT_WATER = 8,
    OBJECT_WIN = 16;


var Sprite = function () { }

Sprite.prototype.setup = function (sprite, props) {
    this.sprite = sprite;
    this.merge(props);
    this.framse = this.frame || 0;
    this.w = SpriteSheet.map[sprite].w;
    this.h = SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function (props) {
    if (props) {
        for (var p in props) {
            this[p] = props[p];
        }
    }
}

Sprite.prototype.draw = function (ctx) {
    SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
}

Sprite.prototype.hit = function (damage) {
    this.board.remove(this);
}

var BackGround = function () {
    this.w = SpriteSheet.map['BackGround'].w;
    this.h = SpriteSheet.map['BackGround'].h;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - this.h;
    this.step = function (dt) { }
    this.draw = function (ctx) {
        SpriteSheet.draw(ctx, 'BackGround', this.x, this.y, 0);
    }
}
var Frog = function () {

    this.setup('frog', { vx: 0, frame: 0, reloadTime: 0.25, upDown: 48, izqDer: 40 });
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - this.h;
    this.reload = this.reloadTime;
    this.subFrame = 0;
}

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;
Frog.prototype.step = function (dt) {

    this.reload -= dt;
    if (this.reload <= 0) {

        if (Game.keys['left']) { this.x -= this.izqDer; this.reload = this.reloadTime; }
        else if (Game.keys['right']) { this.x += this.izqDer; this.reload = this.reloadTime; }
        else if (Game.keys['up']) { this.y -= this.upDown; this.reload = this.reloadTime; }
        else if (Game.keys['down']) { this.y += this.upDown; this.reload = this.reloadTime; }

        this.x += this.vx * dt;

        if (this.x < 0) { this.x = 0; }
        else if (this.x > Game.width - this.w) {
            this.x = Game.width - this.w
        }

        if (this.y < 0) { this.y = 0; }
        else if (this.y > Game.height - this.h) {
            this.y = Game.height - this.h
        }

        this.frame = Math.floor(this.subFrame++ / 3);
        if (this.subFrame >= 21) {
            this.subFrame = 0;
        };

        var collisionTrunk = this.board.collide(this, OBJECT_TRUNK);
        if (collisionTrunk)
            this.vx = collisionTrunk.vx;
        else
            this.vx = 0;

    }

}
Frog.prototype.isOnTrunk = function () {
    return this.vx != 0 || this.board.collide(this, OBJECT_TRUNK);
}
Frog.prototype.onTrunk = function (vt) {
        this.vx = vt;
}

Frog.prototype.hit = function (damage) {
    this.board.remove(this)
    this.board.add(new Death(this.x + this.w / 2, this.y + this.h / 2));
};

var Logo = function () {
    this.w = SpriteSheet.map['logo'].w;
    this.h = SpriteSheet.map['logo'].h;
    this.x = Game.width / 4;
    this.y = 80;
    this.step = function (dt) { }
    this.draw = function (ctx) {
        SpriteSheet.draw(ctx, 'logo', this.x, this.y, 0);
    }
}


var cars = {
    car_azul: { v: 1, x: -100, y: 530, sprite: 'coche_azul', vel: 200 },
    car_verde: { v: 2, x: -100, y: 338, sprite: 'coche_verde', vel: 300 },
    car_amarillo: { v: 3, x: -100, y: 434, sprite: 'coche_amarillo', vel: 90 },
    truck_corto: { v: 4, x: -100, y: 386, sprite: 'camion_corto', vel: 150 },
    truck_largo: { v: 5, x: 550, y: 482, sprite: 'camion_largo', vel: -100 }
}

var Car = function (blueprint, override) {
    this.setup(blueprint.sprite, blueprint);
    this.merge(override);
}

Car.prototype = new Sprite();
Car.prototype.type = OBJECT_CAR;
Car.prototype.step = function (dt) {
    this.time += dt;
    this.vx = this.vel;
    this.x += this.vx * dt;

    if (this.y > Game.height ||
        this.x < -this.w ||
        this.x > Game.width) {
        this.board.remove(this);
    }
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        collision.hit();
        this.board.remove(this);
    }
}

Car.prototype.hit = function () {
    this.board.remove(this)
    this.board.add(new Death(this.x + this.w / 2,
        this.y + this.h / 2));
}

var trunks = {
    short: { x: -100, y: 49, sprite: 'short_trunk', vel: 180 },
    medium: { x: -100, y: 145, sprite: 'medium_trunk', vel: 100 },
    large: { x: 550, y: 241, sprite: 'large_trunk', vel: -100 }
}

var Trunk = function (blueprint, override) {
    this.setup(blueprint.sprite, blueprint);
    this.merge(override);
}

Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_TRUNK;

Trunk.prototype.step = function (dt) {
    this.vx = this.vel;

    this.x += this.vx * dt;

    if (this.y > Game.height ||
        this.x > Game.width) {
        this.board.remove(this);
    }

    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        collision.onTrunk(this.vx);
    }

}
var turtles = {
    turtle1: { x: -10, y: 96, sprite: 'turtle1', vel: 100 },
    turtle2: { x: -10, y: 192, sprite: 'turtle2', vel: 180 }
}
var turtle = function (blueprint, override) {
    this.setup(blueprint.sprite, blueprint);
    this.merge(override);
    this.subFrame = 0;
}


turtle.prototype = new Sprite();
turtle.prototype.type = OBJECT_TRUNK;

turtle.prototype.step = function (dt) {
    this.vx = this.vel;

    this.x += this.vx * dt;

    if (this.y > Game.height ||
        this.x < -this.w ||
        this.x > Game.width) {
        this.board.remove(this);
    }
    this.frame = Math.floor(this.subFrame++ / 3);
    if(this.sprite=="turtle2"){
        if (this.subFrame >= 24) {
            this.subFrame = 0;
        };
    }else{
        if (this.subFrame >= 6) {
            this.subFrame = 0;
        };
    }


    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        collision.onTrunk(this.vx);
    }

}

var Water = function () {
    this.x = 0;
    this.y = 50;
    this.h = 241;
    this.w = 550;
}

Water.prototype = new Sprite();
Water.prototype.type = OBJECT_WATER;
Water.prototype.draw = function () { }
Water.prototype.step = function () {
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        if (!collision.isOnTrunk()) {
            collision.hit();
            this.board.remove(this);
        }

    }
}
Water.prototype.hit = function () {
    this.board.remove(this)
    this.board.add(new Death(this.x + this.w / 2,
        this.y + this.h / 2));
}
var Home = function () {
    this.x = 0;
    this.y = 0;
    this.setup('home', {});
}

Home.prototype = new Sprite();
Home.prototype.type = OBJECT_WIN;
Home.prototype.draw = function () { }
Home.prototype.step = function () {
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        this.board.remove(Frog);
        seGana();
    }
}

var Death = function (centerX, centerY) {
    this.setup('death', { frame: 0 });
    this.x = centerX - this.w / 2;
    this.y = centerY - this.h / 2;
    this.subFrame = 0;
}

Death.prototype = new Sprite();

Death.prototype.step = function (dt) {
    this.frame = Math.floor(this.subFrame++ / 3);
    if (this.subFrame >= 12) {
        this.board.remove(this);
        sePierde();
    }
};

var Spawner = function () {
    this.troncos = [{ c: trunks.short, f: 2, t: 2 }, { c: trunks.medium, f: 4, t: 4 }, { c: trunks.large, f: 5, t: 5 }];
    this.turtles = [{ c: turtles.turtle1, f: 2, t: 2 }, { c: turtles.turtle2, f: 1, t: 1 }];
    this.coches = [{ c: cars.car_azul, f: 4, time: 4 },
    { c: cars.car_verde, f: 1, time: 3 },
    { c: cars.car_amarillo, f: 4, time: 4 },
    { c: cars.truck_corto, f: 4, time: 4 },
    { c: cars.truck_largo, f: 5, time: 5 }];
}
Spawner.prototype.step = function (dt) {
    for (let i = 0; i < this.coches.length; i++) {
        this.coches[i].time += dt
        if (this.coches[i].time >= this.coches[i].f) {
            this.board.add(new Car(this.coches[i].c));
            this.coches[i].time = 0;
        }
    }

    for (let j = 0; j < this.turtles.length; j++) {
        this.turtles[j].t += dt
        if (this.turtles[j].t >= this.turtles[j].f) {
            this.board.add(new turtle(this.turtles[j].c));
            this.turtles[j].t = 0;
        }
    }

    for (let j = 0; j < this.troncos.length; j++) {
        this.troncos[j].t += dt
        if (this.troncos[j].t >= this.troncos[j].f) {
            this.board.add(new Trunk(this.troncos[j].c));
            this.troncos[j].t = 0;
        }
    }

};
Spawner.prototype.draw = function () { };