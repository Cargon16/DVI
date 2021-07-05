"use strict"
var game = function () {
    // Set up an instance of the Quintus engine and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` componet.
    var Q = Quintus({
        audioSupported: ['mp3', 'ogg']
    })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX,Audio")
        // Maximize this game to whatever the size of the browser is
        .setup({
            //maximize: true,
            scaleToFit: true,
            width: 1200,
            height: 612

        })
        // And turn on default input controls and touch input (for UI)
        .controls().touch().enableSound();

    //Q.debug = true;

    Q.load("ranking.png, informe.png, fondoInf.png, HUD.png, buttonInf.png, applause.mp3, applause.ogg, pinchazo.mp3, pinchazo.ogg, doctor.json, virusR.json, covidRojo.png, buttonHard.png, buttonEasy.png, buttonMedio.png, daddy.png, daddy.json,covidAzul.png, covidVerde.png, virusA.json ,virusV.json, jerginga.png, hospital.png, button2.mp3, button2.ogg, main_music1.mp3, main_music1.ogg, hit3.mp3, hit3.ogg, music_level_complete.mp3, music_level_complete.ogg, music_ranking.mp3, music_ranking.ogg, credit_music.mp3, credit_music.ogg ", function () {



        // Or from a .json asset that defines sprite locations
        Q.compileSheets("daddy.png", "daddy.json");
        Q.animations('player_anim', {


            jump_right: {
                frames: [1, 2, 3],
                rate: 1 / 5
            },
            fall_right: {
                frames: [1, 2, 3],
                rate: 1 / 5,
                loop: false
            },
            die: {
                frames: [8],
                rate: 1 / 5
            }
        });


        //Credits
        Q.scene("creditos",function(stage) {
            var container = container = stage.insert(new Q.UI.Container({
                x: Q.width/2, y: 5, fill: "rgba(0,0,0,0.5)"
            })); 
            
            var Autores = container.insert(new Q.UI.Text({
                x: 10,
                y: 230 ,
                size: 20,
                color: "#FFFFFF",
                label: "Realizado por: Carlos González Torres, Jorge Millán García, Sergio Villarroel Fernández"

            }));
            var inspirado = container.insert(new Q.UI.Text({
                x: 10,
                y: 280 ,
                size: 15,
                color: "#FFFFFF",
                label: "Inspirado en el juego flappy birds."

            }));
            var Spritess = container.insert(new Q.UI.Text({
                x: 10,
                y: 300 ,
                size: 15,
                color: "#FFFFFF",
                label: "Sprites extraídos de: https://www.spriters-resource.com/"

            }));
            var button = container.insert(new Q.UI.Button({
                x: 10,
                y: 400,
                fill: "#CCCCCC",
                label: "Menu"
            }));

            button.on("click", function () {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('title-screen', 1);
                Q.state.p.score = 0;
                Q.audio.play('button2.mp3');

            });

            container.fit(20);
            stage.insert(new Q.Sprite({scale:1,x:0,y:0, cy:0}),container);
        });

        Q.Sprite.extend("Player", {

            init: function (p) {
                this._super(p, {
                    sprite: "player_anim",
                    sheet: "daddyR",
                    x: 50,
                    y: 380,
                    gravity: 0,
                    dead: false,
                    win: false
                });
                this.add('2d, platformerControls, animation');
                Q.personaje = this;
            },
            step: function (dt) {
                this.p.points[0] = [-25, -25];
                this.p.points[1] = [-25, 25];
                this.p.points[2] = [15, 25];
                this.p.points[3] = [15, -25];
                if (!this.p.dead) {


                    if (this.p.x != 50 && this.p.y != 380 && this.p.win == false) this.p.gravity = 1;
                    if (this.p.y > 612 || this.p.y < 0) {
                        this.play("die");
                        this.p.dead = true;
                        Q.stageScene("endGame", 1, {
                            label: "se ha contagiado."
                        });
                    }
                    if (this.p.vy < 0) { //jump
                        Q.state.inc("score", 1);
                        this.p.y -= 2;
                        this.p.landed == true;
                        this.play("jump_" + this.p.direction);
                    } else if (this.p.vy > 0) {
                        Q.state.inc("score", 1);
                        this.play("fall_" + this.p.direction);
                    }

                }

                else {
                    this.p.vx = 0;
                    this.play("die");
                    this.p.vy = -500;

                }

            }
        });

        Q.component("defaultEnemy", {
            added: function () {

                this.entity.on("bump.left,bump.right,bump.bottom, bump.top", function (collision) {

                    if (collision.obj.isA("Player") && !collision.obj.p.dead) {
                        collision.obj.play("die");
                        collision.obj.p.dead = true;
                        collision.obj.p.vy = -500;
                        collision.obj.del("platformerControls");
                
                        Q.stageScene("endGame", 1, {
                            label: "se ha contagiado."
                        });

                    }

                });

            }
        });

        Q.compileSheets("covidRojo.png", "virusR.json");
        Q.animations('virus_animR', {
            pulse: {
                frames: [0, 1, 2],
                rate: 1 / 2,
                loop: true
            },

        });
        Q.Sprite.extend("covidRojo", {
            init: function (p) {
                this._super(p, {
                    sprite: "virus_animR",
                    sheet: "virusR",
                    x: p.x,
                    y: p.y,
                    vy: -3,
                    move: 'up',
                    dead: false,
                    range: p.range,
                    gravity: 0,
                    dest: 0
                });
                this.add('2d,defaultEnemy,animation');
            },
            step: function (dt) {
                this.p.points[0] = [-25, -25];
                this.p.points[1] = [-25, 25];
                this.p.points[2] = [25, 25];
                this.p.points[3] = [25, -25];
                this.play("pulse");

                if (this.p.move == 'up') {
                    this.p.y += this.p.vy;
                    this.p.x += this.p.vy;
                }
                if (this.p.move == 'down') {
                    this.p.y -= this.p.vy;
                    this.p.x -= this.p.vy;
                }
                if (this.p.y < 100) {
                    this.p.move = 'down';
                }

                if (this.p.y > 450) {
                    this.p.move = 'up';
                }
            }

        });
        Q.compileSheets("covidVerde.png", "virusV.json");
        Q.animations('virus_animV', {
            pulse: {
                frames: [0, 1, 2],
                rate: 1 / 2,
                loop: true
            },

        });
        Q.Sprite.extend("covidVerde", {
            init: function (p) {
                this._super(p, {
                    sprite: "virus_animV",
                    sheet: "virusV",
                    vy: 0.1,
                    range: 0,
                    gravity: 0,
                    dest: 0
                });
                this.add('2d,defaultEnemy,animation');
            },
            step: function (dt) {
                this.p.points[0] = [-25, -25];
                this.p.points[1] = [-25, 25];
                this.p.points[2] = [25, 25];
                this.p.points[3] = [25, -25];
                this.play("pulse")


            }
        });

        Q.compileSheets("covidAzul.png", "virusA.json");
        Q.animations('virus_animA', {
            pulse: {
                frames: [0, 1, 2],
                rate: 1 / 2,
                loop: true
            },


        });

        Q.Sprite.extend("covidAzul", {
            init: function (p) {
                this._super(p, {
                    sprite: "virus_animA",
                    sheet: "virusA",
                    x: p.x,
                    y: p.y,
                    vy: -6,
                    move: 'up',
                    dead: false,
                    range: p.range,
                    gravity: 0,
                    dest: 0
                });
                this.add('2d,defaultEnemy,animation');
            },
            step: function (dt) {
                this.p.points[0] = [-25, -25];
                this.p.points[1] = [-25, 25];
                this.p.points[2] = [25, 25];
                this.p.points[3] = [25, -25];
                this.play("pulse");

                if (this.p.move == 'up') {
                    this.p.y += this.p.vy;
                }
                if (this.p.move == 'down') {
                    this.p.y -= this.p.vy;
                }
                if (this.p.y < 50) {
                    this.p.move = 'down';
                }

                if (this.p.y > 530) {
                    this.p.move = 'up';
                }
            }
        });



        Q.animations('doctorFin', {
            pulse: {
                frames: [1],
                rate: 1 / 1,
            },


        });
        Q.compileSheets("jerginga.png");
        Q.Sprite.extend("Doctor", {
            init: function (p) {
                this._super(p, {
                    // sprite: "doctorFin",
                    // sheet: "doctor",
                    asset: "jerginga.png",
                    //  x: 3500,
                    //  y: 350,
                    x: p.x,
                    y: p.y,

                    gravity: 0,
                    win: false
                });
                this.add('2d');
                this.on("bump.left,bump.right,bump.bottom,bump.top", function (collision) {
                    if (collision.obj.isA("Player") && !collision.obj.p.dead) {
                        collision.obj.p.win = true;
                        collision.obj.p.vy = 0;
                        collision.obj.p.vx = 0;
                        collision.obj.p.gravity = 0;
                        collision.obj.del("platformerControls");
                        Q.stageScene("winGame", 1, {
                            label: " ha sido usted vacunado."
                        });
                    }
                });
            },
            step: function (dt) { }
        });

        Q.level="";
        Q.record=0;

        Q.scene("endGame", function (stage) {
            Q.audio.stop('main_music1.mp3');
            Q.audio.play('hit3.mp3');

            
            if (Q.level == "Modo facil") {
                if (DATA.easy < parseInt(Q.text.p.label)){
                    DATA.easy = parseInt(Q.text.p.label);
                }
                Q.record=DATA.easy;
            }
            if (Q.level == "Modo normal") {
                if (DATA.normal < parseInt(Q.text.p.label)){
                    DATA.normal = parseInt(Q.text.p.label);
                }
                Q.record=DATA.normal;
            }
            if (Q.level == "Modo dificil") {
                if (DATA.dificult < parseInt(Q.text.p.label)){
                    DATA.dificult = parseInt(Q.text.p.label);
                }   
                Q.record=DATA.dificult;
            }
            if (Q.level == "Modo infinito") {
                if (DATA.infinite < parseInt(Q.text.p.label)){
                    DATA.infinite = parseInt(Q.text.p.label);
                }
                Q.record=DATA.infinite;
            }

            console.log(Q.level + " " + Q.record);
     

          

            stage.insert(new Q.Informe());
            var container = stage.insert(new Q.UI.Container({
                x: 600,
                y: 130,

            }));

            var puntuacion = container.insert(new Q.UI.Text({
                x: 10,
                y: 200 ,
                color: "#000000",
                size: 14,
                label: "Puntuacion actual: " + Q.text.p.label
            }));

            var puntuacionRecord = container.insert(new Q.UI.Text({
                x: 10,
                y: 230 ,
                size: 14,
                color: "#000000",
                label: "Record personal: " + Q.record
            }));

            var label = container.insert(new Q.UI.Text({
                x: 60,
                y: 159 ,
                color: "#d32d41",
                size: 12,
                label: stage.options.label
            }));

            var button = container.insert(new Q.UI.Button({
                x: 10,
                y: 400,
                fill: "#CCCCCC",
                label: "Menu"
            }));

            button.on("click", function () {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('title-screen', 1);
                Q.state.p.score = 0;
                Q.audio.play('button2.mp3');

            });

           
            container.fit(10);
        });

        Q.Sprite.extend("Informe", {
            init: function (p) {
                this._super(p, {
                    asset: "informe.png",
                    x: 620,
                    y: 300
                    
                });
            }
        });

        Q.scene("winGame", function (stage) {

            Q.audio.stop('main_music1.mp3');
            Q.audio.play('pinchazo.mp3');
            Q.audio.play('applause.mp3');

            if (Q.level == "Modo facil") {
                if (DATA.easy < parseInt(Q.text.p.label)){
                    DATA.easy = parseInt(Q.text.p.label);
                }
                Q.record=DATA.easy;
                    
            }
            if (Q.level == "Modo normal") {
                if (DATA.normal < parseInt(Q.text.p.label)){
                    DATA.normal = parseInt(Q.text.p.label);
                }
                Q.record=DATA.normal;
            }
            if (Q.level == "Modo dificil") {
                if (DATA.dificult < parseInt(Q.text.p.label)){
                    DATA.dificult = parseInt(Q.text.p.label);
                }   
                Q.record=DATA.dificult;
            }
            if (Q.level == "Modo infinito") {
                if (DATA.infinite < parseInt(Q.text.p.label)){
                    DATA.infinite = parseInt(Q.text.p.label);
                }
                Q.record=DATA.infinite;
            }

            console.log(Q.level + " " + Q.record);
     

          

            stage.insert(new Q.Informe());
            var container = stage.insert(new Q.UI.Container({
                x: 600,
                y: 130,

            }));

            var puntuacion = container.insert(new Q.UI.Text({
                x: 10,
                y: 200 ,
                color: "#000000",
                size: 14,
                label: "Puntuacion actual: " + Q.text.p.label
            }));

            var puntuacionRecord = container.insert(new Q.UI.Text({
                x: 10,
                y: 230 ,
                size: 14,
                color: "#000000",
                label: "Record personal: " + Q.record
            }));

            var label = container.insert(new Q.UI.Text({
                x: 79,
                y: 159 ,
                color: "#019cdc",
                size: 12,
                label: stage.options.label
            }));

            var button = container.insert(new Q.UI.Button({
                x: 10,
                y: 400,
                fill: "#CCCCCC",
                label: "Menu"
            }));

            button.on("click", function () {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('title-screen', 1);
                Q.state.p.score = 0;
                Q.audio.play('button2.mp3');

            });

           
            container.fit(10);
        });

        /*Modo infinito */

        Q.virus = [];
        Q.pos = 600;
        Q.GameObject.extend('VirusCreator', {
            init: function () {
                this.p = {
                    createVirus: false,
                    levels: [20, 40, 60]
                }

                Q.virusCreator = this;
            },

            update: function (dt) {

                var muerte = Q.personaje.p.dead;
                var aux = Q.random(100);
                //Q.crea +=2;
                if (aux % 75 == 0) this.p.createVirus = true;
                if (this.p.createVirus && !muerte && Q.personaje.p.x > 200) {

                    this.p.createVirus = false;
                    var r = Math.floor(Math.random() * (500 - 70 + 1) + 80);

                    //this.stage.insert(new Q.covidAzul({ x: Q.personaje.p.x + 600, y: r + 20 }));

                    //if(Q.crea % 2 == 0){
                    this.stage.insert(new Q.covidAzul({ x: Q.personaje.p.x + Q.pos, y: r + 20 }));
                    Q.pos += 150;
                    //}


                }
                console.log("La variable vale: " + Q.crea);

            }
        });

        Q.random = function (max) {
            return Math.floor(Math.random() * max);
        }


        Q.scene('levelInfinito', function (stage) {
            Q.pipes = [];
            Q.state.set('score', 0);
            stage.insert(new Q.Repeater({
                asset: 'fondoInf.png'
            }));
            Q.player = stage.insert(new Q.Player());
            Q.player.stage.insert(new Q.VirusCreator());

            stage.add('viewport').follow(Q.player, {
                x: true,
                y: false
            });
            stage.viewport.offsetX = Q.player.p.cx - 2;
        });
        /*Final del código del modo infinito */


        Q.compileSheets("buttonMedio.png", "buttonEasy.png", "buttonHard.png");

        Q.scene("title-screen", function (stage) {
            var container = stage.insert(new Q.UI.Container({
                x: Q.width / 2,
                y: Q.height / 2,
                w: Q.width,
                h: Q.height,
                fill: "rgba(0,0,0,0.5)"
            }));

            var buttonEasy = container.insert(new Q.UI.Button({
                asset: "buttonEasy.png",
                label: "Nivel Fácil",
                y: -100,
                x: 0,
                fill: "#1C00ff00"
            }));
            buttonEasy.on("click", function () {
                Q.level="Modo facil";
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('levelEasy');
                Q.audio.play('button2.mp3');
                Q.audio.play('main_music1.mp3', {
                    loop: true
                });

            });
            var buttonMedio = container.insert(new Q.UI.Button({
                asset: "buttonMedio.png",
                label: "Nivel Normal",
                y: 0,
                x: 0,
                fill: "#1C00ff00"

            }));
            buttonMedio.on("click", function () {
                Q.level="Modo normal";
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('levelNormal');
                Q.audio.play('button2.mp3');
                Q.audio.play('main_music1.mp3', {
                    loop: true
                });

            });

            var buttonDificil = container.insert(new Q.UI.Button({
                asset: "buttonHard.png",
                label: "Nivel Difícil",
                y: 100,
                x: 0,
                fill: "#1C00ff00"

            }));
            buttonDificil.on("click", function () {
                Q.level="Modo dificil";
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('levelHard');
                Q.audio.play('button2.mp3');
                Q.audio.play('main_music1.mp3', {
                    loop: true
                });

            });

            var buttonInf = container.insert(new Q.UI.Button({
                asset: "buttonInf.png",
                label: "Nivel Infinito",
                y: 200,
                x: 0,
                fill: "#1C00ff00"

            }));
            buttonInf.on("click", function () {
                Q.level="Modo infinito";
                Q.pos = 600;
                Q.clearStages();
                Q.stageScene('hud', 1);
                Q.stageScene('levelInfinito');
                Q.audio.play('button2.mp3');
                Q.audio.play('main_music1.mp3', {
                    loop: true
                });

            });

            container.fit(20);

            var container1 = stage.insert(new Q.UI.Container({
                x: 1150,
                y: 50,
                w: 10,
                h: 10,
                fill: "rgba(0,0,0,0.5)"
            }));

            var buttonRank = container1.insert(new Q.UI.Button({
                asset: "ranking.png",
                // label: "Ranking",
                y: 0,
                x: 0,
                fill: "#1C00ff00"
            }));
            buttonRank.on("click", function () {
                Q.clearStages();
                Q.stageScene('rankScene');
                Q.audio.play('button2.mp3');
                Q.audio.play('music_ranking.mp3', {
                    loop: true
                });

            });

            var container2 = stage.insert(new Q.UI.Container({
                x: 50,
                y: 50,
                w: 10,
                h: 10
            }));

            var buttonCredit = container2.insert(new Q.UI.Button({
                label: "Créditos",
                y: 0,
                x: 0,
                fill: "#1C00ff00"
            }));
            buttonCredit.on("click", function () {
                Q.clearStages();
                Q.stageScene('creditos');
                Q.audio.play('button2.mp3');
                Q.audio.play('credit_music.mp3', {
                    loop: true
                });

            });

        });

        Q.scene("rankScene", function (stage) {
            Q.audio.stop('main_music1.mp3');
            //Q.audio.play('music_ranking.mp3');

            var container = stage.insert(new Q.UI.Container({
                x: 600,
                y: 160,
                border: true,
                fill: "rgba(0,0,0,0.5)"
            }));

            var button = container.insert(new Q.UI.Button({
                x: 0,
                y: 360,
                fill: "#CCCCCC",
                label: "Menu"
            }));

            button.on("click", function () {
                Q.audio.stop();
                Q.clearStages();
                Q.stageScene('title-screen', 1);
                Q.state.p.score = 0;
                Q.audio.play('button2.mp3');


            });


            var label = container.insert(new Q.UI.Text({
                x: 0,
                y: 0,
                color: "#FFFFFF",
                label: "Nivel Fácil: " + DATA.easy
            }));
            var label1 = container.insert(new Q.UI.Text({
                x: 0,
                y: 100,
                color: "#FFFFFF",
                label: "Nivel Normal: " + DATA.normal
            }));
            var label2 = container.insert(new Q.UI.Text({
                x: 0,
                y: 200,
                color: "#FFFFFF",
                label: "Nivel Difícil: " + DATA.dificult
            }));
            var label3 = container.insert(new Q.UI.Text({
                x: 0,
                y: 300,
                color: "#FFFFFF",
                label: "Nivel Infinito: " + DATA.infinite
            }));

            container.fit(20);
        });

        Q.scene("hud", function (stage) {
            Q.UI.Text.extend("Score", {
                init: function (p) {
                    this._super({
                        label: "0",
                        x: 75,
                        y: 103,
                        color: "#00b050"
                    });
                    Q.state.on("change.score", this, "score");
                    Q.text = this
                },
                score: function (score) {
                    this.p.label = "" + score;
                },
            });

            stage.insert(new Q.ScoreE());
            stage.insert(new Q.Score());

        })

        Q.Sprite.extend("ScoreE", {
            init: function (p) {
                this._super(p, {
                    asset: "HUD.png",
                    x: 120,
                    y: 90,
                });
            }
        });

        Q.scene("levelEasy", function (stage) {

            Q.stageTMX("levelFacil.tmx", stage);

            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player, {
                x: true,
                y: false
            });

        });
        Q.loadTMX("levelFacil.tmx", function () {
            Q.state.reset({
                score: 0
            });
            Q.stageScene("title-screen");
        });


        Q.scene("levelNormal", function (stage) {

            Q.stageTMX("levelNormal.tmx", stage);

            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player, {
                x: true,
                y: false
            });

        });
        Q.loadTMX("levelNormal.tmx", function () {
            Q.state.reset({
                score: 0
            });
            Q.stageScene("title-screen");
        });

        Q.scene("levelHard", function (stage) {

            Q.stageTMX("levelDificil.tmx", stage);
            // Create the player and add them to the stage
            // Create the player and add them to the stage
            var doctor = new Q.Doctor({x: 9502.20, y:494.20});
            stage.insert(doctor);

            var player = stage.insert(new Q.Player());
            stage.add("viewport").follow(player, {
                x: true,
                y: false
            });

        });
        Q.loadTMX("levelDificil.tmx", function () {
            Q.state.reset({
                score: 0
            });
            Q.stageScene("title-screen");
        });

    });

}