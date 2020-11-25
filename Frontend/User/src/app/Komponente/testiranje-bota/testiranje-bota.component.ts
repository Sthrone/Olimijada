/// <reference path="../../../../node_modules/phaser-ce/typescript/phaser.d.ts" />

import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

import { MecKorisnik } from '../../Klase/mecKorisnik';
import { Par } from '../../Klase/par';

import { MecInfoService } from '../../Servisi/mec-info.service';

import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

import { Player } from './player';

@Component({
  selector: 'app-testiranje-bota',
  templateUrl: './testiranje-bota.component.html',
  styleUrls: ['./testiranje-bota.component.css']
})
export class TestiranjeBotaComponent 
{
  // ----- Phaser -----

  game: Phaser.Game;
  gameLoop: Phaser.Timer;
  countdown: Phaser.Signal;
  startGame: Phaser.Signal;
  play: Phaser.Sprite;
  pause: Phaser.Sprite;
  forward: Phaser.Sprite;
  backward: Phaser.Sprite;
  num1: Phaser.Text;
  num2: Phaser.Text;
  num3: Phaser.Text;
  result1: Phaser.Text;
  result2: Phaser.Text;
  enter: any;
  menuScene: boolean = true;
  countdownScene: boolean = false;
  gameScene: boolean = false;
  goForward: boolean = false;
  goBackward: boolean = false;


  // ----- Logic -----

  server: string;
  slikaPozadine: string;
  blueUser: MecKorisnik = new MecKorisnik();
  redUser: MecKorisnik = new MecKorisnik();
  kretanje: Par[][] = [];
  rezultatiPlavog: number[] = [];
  rezultatiCrvenog: number[] = [];
  igraci: Player[] = [];
  index: number;
  r1: number;
  r2: number;

  plavi: string[] = [];
  crveni: string[] = [];

  constructor
  (
    private mecInfo: MecInfoService,
    private route : ActivatedRoute
  ) 
  {

    // ------------------ PRIKUPLJANJE PODATAKA ------------------ 
    
    this.server = environment.apiUrl;
/*
    let id = +this.route.snapshot.paramMap.get('id');
    this.mecInfo.VratiPozadinuIgre(id).subscribe((resp: any) =>
    {
*/   

    let ime = this.route.snapshot.paramMap.get('bot');
    this.slikaPozadine = this.server + "/images/slike_pozadine_igara/default.jpg";
    
    // Nazivi igraca:
    let bot = ime;
    let pos = bot.lastIndexOf('.');
    let naziv = bot.substring(0, pos);
    naziv = (naziv.length > 8) ? naziv.substr(0, 7) + '..' : naziv;
    naziv = naziv.charAt(0).toUpperCase() + naziv.slice(1);

    this.plavi.push(naziv + ".1");
    this.crveni.push(naziv + ".2");

    // Popuniti podatke o ucesnicima.
    let user = JSON.parse(localStorage.getItem('user'));
    this.blueUser.korisnicko_ime = user.korisnicko_ime;
    this.blueUser.avatar = this.server + "/images/avatar/" +user.avatar;
    
    this.redUser.korisnicko_ime = user.korisnicko_ime;
    this.redUser.avatar = this.server + "/images/avatar/" + user.avatar;


    // Sada treba napraviti slucajan izbor izmedju tri moguca meca.
    let min = 1;
    let max = 3;
    let rand = Math.floor(Math.random() * (max - min + 1) + min);

    if (rand == 1)
      this.PrviSlucaj();
    else if (rand == 2)
      this.DrugiSlucaj();
    else
      this.TreciSlucaj();

    // ------------------ PRAVLJENJE IGRE ------------------ 
    this.game = new Phaser.Game
    (800, 740, Phaser.CANVAS, 'game', 
    { 
      preload: this.preload, 
      create: this.create, 
      update: this.update, 
      render: this.render, 
      RefreshGame: this.RefreshGame,
      VersusScreen: this.VersusScreen,
      SetCountdownNumbers: this.SetCountdownNumbers,
      DoCountdown: this.DoCountdown,
      StartGame: this.StartGame,
      Pauziraj: this.Pauziraj,
      Pokreni: this.Pokreni,
      UbrzajDown: this.UbrzajDown,
      UbrzajUp: this.UbrzajUp,
      VratiDown: this.VratiDown,
      VratiUp: this.VratiUp,
      PrepareStart: this.PrepareStart,
      SetMenu: this.SetMenu,
      AlphaInPlay: this.AlphaInPlay,
      AlphaOutPlay: this.AlphaOutPlay,
      AlphaInPause: this.AlphaInPause,
      AlphaOutPause: this.AlphaOutPause,
      AlphaInForward: this.AlphaInForward,
      AlphaOutForward: this.AlphaOutForward,
      AlphaInBackward: this.AlphaInBackward,
      AlphaOutBackward: this.AlphaOutBackward,
      SetScoreboard: this.SetScoreboard,
      RefreshScoreboard: this.RefreshScoreboard,
      GameoverScreen: this.GameoverScreen,
      blueUser: this.blueUser,
      redUser: this.redUser,
      igraci: this.igraci,
      kretanje: this.kretanje,
      rezultatiPlavog: this.rezultatiPlavog,
      rezultatiCrvenog: this.rezultatiCrvenog,
      plavi: this.plavi,
      crveni: this.crveni,
      index: this.index,
      slikaPozadine: this.slikaPozadine
    });

  }

  preload() 
  {
    this.game.load.image('versus', 'assets/images/versus.png');
    this.game.load.image('menu_background', 'assets/images/menu_background.jpg');
    this.game.load.image('scoreboard', 'assets/images/scoreboard.png');
    this.game.load.image('tamna_pozadina', 'assets/images/tamna_pozadina_04.png');
    this.game.load.image('teamBlue', 'assets/images/blue.png');
    this.game.load.image('teamRed', 'assets/images/red.png');
    this.game.load.image('play', 'assets/images/play.png');
    this.game.load.image('pause', 'assets/images/pause.png');
    this.game.load.image('crna_pozadina', 'assets/images/crna_pozadina.png');
    this.game.load.image('forward', 'assets/images/forward.png');
    this.game.load.image('backward', 'assets/images/backward.png');
    
    this.game.load.image('pozadina', this.slikaPozadine);
    this.game.load.image('blueUser', this.blueUser.avatar);
    this.game.load.image('redUser', this.redUser.avatar);
  }

  create() 
  {
    // Kreirati sve igrace...
    let k = 0;
    for ( ; k < this.plavi.length ; k++)
      this.igraci[k] = new Player(this.game, this.kretanje[k][0].x, this.kretanje[k][0].y, this.plavi[k], 'teamBlue');

    for ( ; k < this.plavi.length + this.crveni.length ; k++)
      this.igraci[k] = new Player(this.game, this.kretanje[k][0].x, this.kretanje[k][0].y, this.crveni[k-this.plavi.length], 'teamRed');

    this.game.stage.disableVisibilityChange = true;

    this.VersusScreen();
    this.SetMenu();
    this.SetCountdownNumbers();

    this.gameLoop = this.game.time.create(false);
    this.gameLoop.loop(Phaser.Timer.SECOND, this.RefreshGame, this);

    this.menuScene = true;
    this.countdownScene = false;
    this.gameScene = false;

    this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    this.countdown = new Phaser.Signal();
    this.countdown.add(this.DoCountdown, this);

    this.startGame = new Phaser.Signal();
    this.startGame.add(this.StartGame, this);

    this.r1 = 0;
    this.r2 = 0;
  }

  update()
  {
    if (this.enter.isDown && this.menuScene == true)
    {
      this.PrepareStart();
    }

    if (this.goForward)
    {
      if (this.index < (this.rezultatiPlavog.length - 1))
        this.index += 0.1;
    }

    if (this.goBackward)
    {
      if (this.index > 1)
        this.index -= 0.1;
    }

  }

  render()
  {


  }

  //------------------------------ FUNKCIJE ZA CRTANJE -------------------------------------

  private PrepareStart()
  {
    this.gameScene = false;
    this.menuScene = false;
    this.countdownScene = true;
    
    this.game.add.tileSprite(0, 0, 800, 70, 'scoreboard');
    this.game.add.tileSprite(0, 70, 800, 670, 'tamna_pozadina');
    this.SetMenu();
    this.SetCountdownNumbers();
    
    this.index = 0;

    this.countdown.dispatch();
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private RefreshGame(): void
  {
    if (this.index == this.kretanje[0].length)
    {
      this.gameLoop.remove();
      this.GameoverScreen();
      return;
    }

    this.r1 = this.rezultatiPlavog[this.index];
    this.r2 = this.rezultatiCrvenog[this.index];
    this.RefreshScoreboard();

    for (let i=0 ; i < this.igraci.length ; i++)
      this.igraci[i].move(this.kretanje[i][this.index].x, this.kretanje[i][this.index].y);

    this.index++;
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private VersusScreen(): void
  {
    this.game.add.tileSprite(0, 70, 800, 670, 'versus');

    var blueUserPicture = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY-100, 'blueUser');
    blueUserPicture.anchor.setTo(0.5, 0.5);
    blueUserPicture.width = 250;
    blueUserPicture.height = 250;

    var redUserPicture = this.game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY+100, 'redUser');
    redUserPicture.anchor.setTo(0.5, 0.5);
    redUserPicture.width = 250;
    redUserPicture.height = 250;
    
    var style = { font: "36px Arial", fill: "white", wordWrap: true, wordWrapWidth: "250px", align: "center", "fontWeight": "bold" };

    var blueUserText = this.game.add.text(this.game.world.centerX - 200, this.game.world.centerY + 80, this.blueUser.korisnicko_ime, style);
    blueUserText.anchor.set(0.5, 0.5);

    var redUserText = this.game.add.text(this.game.world.centerX + 200, this.game.world.centerY - 80, this.redUser.korisnicko_ime, style);
    redUserText.anchor.set(0.5, 0.5);
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private SetMenu(): void
  {
    this.game.add.tileSprite(0, 670, 800, 740, 'menu_background');

    this.play = this.game.add.sprite(340, 705, 'play');
    this.play.inputEnabled = true;
    this.play.anchor.setTo(0.5, 0.5);
    this.play.width = 50;
    this.play.height = 50;
    this.play.events.onInputOver.add(this.AlphaInPlay, this);
    this.play.events.onInputOut.add(this.AlphaOutPlay, this);
    this.play.events.onInputDown.add(this.Pokreni, this);

    this.pause = this.game.add.sprite(420, 705, 'pause');
    this.pause.inputEnabled = true;
    this.pause.anchor.setTo(0.5, 0.5);
    this.pause.width = 50;
    this.pause.height = 50;
    this.pause.events.onInputOver.add(this.AlphaInPause, this);
    this.pause.events.onInputOut.add(this.AlphaOutPause, this);
    this.pause.events.onInputDown.add(this.Pauziraj, this);

    this.forward = this.game.add.sprite(500, 705, 'forward');
    this.forward.inputEnabled = true;
    this.forward.anchor.setTo(0.5, 0.5);
    this.forward.width = 40;
    this.forward.height = 40;
    this.forward.events.onInputOver.add(this.AlphaInForward, this);
    this.forward.events.onInputOut.add(this.AlphaOutForward, this);
    this.forward.events.onInputDown.add(this.UbrzajDown, this);
    this.forward.events.onInputUp.add(this.UbrzajUp, this);
    

    this.backward = this.game.add.sprite(260, 705, 'backward');
    this.backward.inputEnabled = true;
    this.backward.anchor.setTo(0.5, 0.5);
    this.backward.width = 40;
    this.backward.height = 40;
    this.backward.events.onInputOver.add(this.AlphaInBackward, this);
    this.backward.events.onInputOut.add(this.AlphaOutBackward, this);
    this.backward.events.onInputDown.add(this.VratiDown, this);
    this.backward.events.onInputUp.add(this.VratiUp, this);

  }

  private AlphaInPlay()
  {
    this.play.alpha = 0.5;
  }

  private AlphaOutPlay()
  {
    this.play.alpha = 1.0;
  }

  private AlphaInPause()
  {
    this.pause.alpha = 0.5;
  }

  private AlphaOutPause()
  {
    this.pause.alpha = 1.0;
  }

  private AlphaInForward()
  {
    this.forward.alpha = 0.5;
  }

  private AlphaOutForward()
  {
    this.forward.alpha = 1.0;
  }

  private AlphaInBackward()
  {
    this.backward.alpha = 0.5;
  }

  private AlphaOutBackward()
  {
    this.backward.alpha = 1.0;
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private SetCountdownNumbers(): void
  {
    let style = { font: "260px Cambria", fill: "white", wordWrap: true, wordWrapWidth: "250px", align: "center", "fontWeight": "bold" };
    
    this.num3 = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY, "3");
    this.num3.setStyle(style);
    this.num3.anchor.set(0.5, 0.5);
    this.num3.alpha = 1;

    this.num2 = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY, "2");
    this.num2.setStyle(style);
    this.num2.anchor.set(0.5, 0.5);
    this.num2.alpha = 1;

    this.num1 = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY, "1");
    this.num1.setStyle(style);
    this.num1.anchor.set(0.5, 0.5);
    this.num1.alpha = 1;
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private DoCountdown(count: number = 3)
  { 
    switch(count) 
    { 
      case 3: 
      { 
        this.game.add.existing(this.num3);
        this.game.time.events.add(Phaser.Timer.SECOND, this.DoCountdown, this, 2);
        
        break; 
      } 
      case 2: 
      { 
        this.num3.visible = false;
        this.game.add.existing(this.num2);
        this.game.time.events.add(Phaser.Timer.SECOND, this.DoCountdown, this, 1);
        
        break; 
      } 
      case 1: 
      {
        this.num2.visible = false;
        this.game.add.existing(this.num1);
        this.game.time.events.add(Phaser.Timer.SECOND, this.DoCountdown, this, 0);

        break;    
      } 
      case 0: 
      { 
        this.num1.visible = false;
        this.startGame.dispatch();
        break; 
      }  
      default: 
      { 
        console.log("SWITCH ERROR!");
        break;              
      } 
    }
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private SetScoreboard(): void
  {
    // Postavljanje rezultata.
    let style = { font: "50px Cambria", fill: "white", wordWrap: true, wordWrapWidth: "30px", align: "center", "fontWeight": "bold" };
    
    this.result1 = new Phaser.Text(this.game, 350, 40, this.r1);
    this.result1.setStyle(style);
    this.result1.anchor.set(0.5, 0.5);
    this.game.add.existing(this.result1);

    this.result2 = new Phaser.Text(this.game, 450, 40, this.r1);
    this.result2.setStyle(style);
    this.result2.anchor.set(0.5, 0.5);
    this.game.add.existing(this.result2);

    let dots = new Phaser.Text(this.game, 400, 40, ":");
    dots.setStyle(style);
    dots.anchor.set(0.5, 0.5);
    this.game.add.existing(dots);

    // Postavljanje obelezja.
    let blueUserPicture = this.game.add.image(50, 35, 'blueUser');
    blueUserPicture.anchor.setTo(0.5, 0.5);
    blueUserPicture.width = 50;
    blueUserPicture.height = 50;

    let style_blue = { font: "30px Cambria", fill: "#1691da", wordWrap: true, wordWrapWidth: "30px", align: "center", "fontWeight": "bold" };
    let tekst01 = new Phaser.Text(this.game, 100, 40, this.blueUser.korisnicko_ime);
    tekst01.setStyle(style_blue);
    tekst01.anchor.set(0, 0.5);
    this.game.add.existing(tekst01);

    let redUserPicture = this.game.add.image(750, 35, 'redUser');
    redUserPicture.anchor.setTo(0.5, 0.5);
    redUserPicture.width = 50;
    redUserPicture.height = 50;

    let style_red = { font: "30px Cambria", fill: "red", wordWrap: true, wordWrapWidth: "30px", align: "center", "fontWeight": "bold" };
    let tekst02 = new Phaser.Text(this.game, 700, 40, this.redUser.korisnicko_ime);
    tekst02.setStyle(style_red);
    tekst02.anchor.set(1, 0.5);
    this.game.add.existing(tekst02);
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private RefreshScoreboard(): void
  {
    this.result1.text = this.r1;
    this.result2.text = this.r2;
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private StartGame(): void
  {
    this.countdownScene = false;
    this.gameScene = true;

    this.game.add.tileSprite(0, 0, 800, 70, 'scoreboard');
    this.game.add.tileSprite(0, 70, 800, 670, 'pozadina');
    
    this.SetMenu();
    
    this.index = 0;
    this.r1 = 0;
    this.r2 = 0;

    let k = 0;
    for ( ; k < this.plavi.length ; k++)
      this.igraci[k] = new Player(this.game, this.kretanje[k][0].x, this.kretanje[k][0].y, this.plavi[k], 'teamBlue');

    for ( ; k < this.plavi.length + this.crveni.length ; k++)
      this.igraci[k] = new Player(this.game, this.kretanje[k][0].x, this.kretanje[k][0].y, this.crveni[k-this.plavi.length], 'teamRed');
    
    this.SetScoreboard();
    this.RefreshScoreboard();
    
    for (let i=0 ; i < this.igraci.length ; i++)
      this.igraci[i].ShowUp();
    
    this.gameLoop.start();
  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private GameoverScreen(): void
  {
    this.gameScene = false;
    this.countdownScene = false;
    this.menuScene = true;

    this.game.add.tileSprite(0, 0, 800, 70, 'crna_pozadina');
    this.game.add.tileSprite(0, 70, 800, 670, 'versus');

    var blueUserPicture = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY-100, 'blueUser');
    blueUserPicture.anchor.setTo(0.5, 0.5);
    blueUserPicture.width = 250;
    blueUserPicture.height = 250;

    var redUserPicture = this.game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY+100, 'redUser');
    redUserPicture.anchor.setTo(0.5, 0.5);
    redUserPicture.width = 250;
    redUserPicture.height = 250;
    
    var style = { font: "36px Arial", fill: "white", wordWrap: true, wordWrapWidth: "250px", align: "center", "fontWeight": "bold" };

    var blueUserText = this.game.add.text(this.game.world.centerX - 200, this.game.world.centerY + 80, this.blueUser.korisnicko_ime, style);
    blueUserText.anchor.set(0.5, 0.5);

    var redUserText = this.game.add.text(this.game.world.centerX + 200, this.game.world.centerY - 80, this.redUser.korisnicko_ime, style);
    redUserText.anchor.set(0.5, 0.5);

    var winnerStyle = { font: "70px Arial", fill: "gold", wordWrap: true, wordWrapWidth: "250px", align: "center", "fontWeight": "bold" };
    var loserStyle = { font: "70px Arial", fill: "gray", wordWrap: true, wordWrapWidth: "250px", align: "center", "fontWeight": "bold" };

    if (this.blueUser.pobedio == 1 && this.redUser.pobedio == 0)
    {
      var blueUserScore = this.game.add.text(this.game.world.centerX - 250, this.game.world.centerY + 120, this.blueUser.ucinak, winnerStyle);
      blueUserText.anchor.set(0.5, 0.5);

      var redUserScore = this.game.add.text(this.game.world.centerX + 160, this.game.world.centerY - 205, this.redUser.ucinak, loserStyle);
      redUserText.anchor.set(0.5, 0.5);
    }
    else if (this.blueUser.pobedio == 0 && this.redUser.pobedio == 1)
    {
      var blueUserScore = this.game.add.text(this.game.world.centerX - 250, this.game.world.centerY + 120, this.blueUser.ucinak, loserStyle);
      blueUserText.anchor.set(0.5, 0.5);

      var redUserScore = this.game.add.text(this.game.world.centerX + 160, this.game.world.centerY - 205, this.redUser.ucinak, winnerStyle);
      redUserText.anchor.set(0.5, 0.5);
    }
    else
    {
      var blueUserScore = this.game.add.text(this.game.world.centerX - 250, this.game.world.centerY + 120, this.blueUser.ucinak, winnerStyle);
      blueUserText.anchor.set(0.5, 0.5);

      var redUserScore = this.game.add.text(this.game.world.centerX + 160, this.game.world.centerY - 205, this.redUser.ucinak, winnerStyle);
      redUserText.anchor.set(0.5, 0.5);
    }

    this.SetMenu();
  }


/* ********************************** FUNKCIJE ZA KONTROLU ******************************************** */

  private Pauziraj()
  {
    this.game.paused = true;
  }

  private Pokreni()
  {
    this.game.paused = false;

    if (this.menuScene)
    {      
      this.PrepareStart();
    }
  }

  private UbrzajDown()
  {
    if (this.gameScene)
    {
      this.gameLoop.pause();
      this.goForward = true;
    }
  }

  private UbrzajUp()
  {
    if (this.gameScene)
    {
      this.goForward = false;
      this.index = Math.round(this.index);

      this.r1 = this.rezultatiPlavog[this.index];
      this.r2 = this.rezultatiCrvenog[this.index];
      this.RefreshScoreboard();

      for (let i=0 ; i < this.igraci.length ; i++)
        this.igraci[i].SetCoordinates(this.kretanje[i][this.index].x, this.kretanje[i][this.index].y);

      this.index++;

      this.gameLoop.resume();
    }
  }

  private VratiDown()
  {
    if (this.gameScene)
    {
      this.gameLoop.pause();
      this.goBackward = true;
    }
  }

  private VratiUp()
  {
    if (this.gameScene)
    {
      this.goBackward = false;
      this.index = Math.round(this.index);

      this.r1 = this.rezultatiPlavog[this.index];
      this.r2 = this.rezultatiCrvenog[this.index];
      this.RefreshScoreboard();

      for (let i=0 ; i < this.igraci.length ; i++)
        this.igraci[i].SetCoordinates(this.kretanje[i][this.index].x, this.kretanje[i][this.index].y);

      this.index++;

      this.gameLoop.resume();
    }
  }

/* ********************************** FUNKCIJE ZA POPULACIJU ******************************************** */

  private PrviSlucaj()
  {
    let blueNiz = 
    [
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 250},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 250},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 250},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 250},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 250},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 250}
    ];

    let redNiz =
    [
      {x: 600,y: 150},{x: 500,y: 150},{x: 600,y: 400},{x: 400,y: 500},{x: 600,y: 250},
      {x: 600,y: 150},{x: 500,y: 150},{x: 600,y: 400},{x: 400,y: 500},{x: 600,y: 250},
      {x: 600,y: 150},{x: 500,y: 150},{x: 600,y: 400},{x: 400,y: 500},{x: 600,y: 250},
      {x: 600,y: 150},{x: 500,y: 150},{x: 600,y: 400},{x: 400,y: 500},{x: 600,y: 250},
      {x: 600,y: 150},{x: 500,y: 150},{x: 600,y: 400},{x: 400,y: 500},{x: 600,y: 250},
      {x: 600,y: 150},{x: 500,y: 150},{x: 600,y: 400},{x: 400,y: 500},{x: 600,y: 250}
    ];

    this.rezultatiPlavog =
    [
      0, 10, 10, 20, 50,
      60, 70, 80, 50, 50,
      60, 70, 80, 50, 50,
      60, 70, 80, 50, 50,
      50, 50, 50, 50, 50,
      50, 50, 70, 80, 90
    ];

    this.rezultatiCrvenog = 
    [
      0, 0, 10, 30, 30,
      40, 30, 10, 20, 40,
      40, 30, 10, 20, 40,
      40, 30, 10, 20, 40,
      40, 40, 40, 50, 50,
      50, 50, 50, 60, 60
    ];

    this.blueUser.ucinak = 90;
    this.redUser.ucinak = 60;
    this.blueUser.pobedio = 1;
    this.redUser.pobedio = 0;

    this.kretanje[0] = [];
    for (let j=0 ; j < blueNiz.length ; j++)
    {
      this.kretanje[0][j] = new Par(blueNiz[j].x, blueNiz[j].y);
    }

    this.kretanje[1] = [];
    for (let j=0 ; j < redNiz.length ; j++)
    {
      this.kretanje[1][j] = new Par(redNiz[j].x, redNiz[j].y);
    }

  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private DrugiSlucaj()
  {
    let blueNiz = 
    [
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 300},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 300},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 300},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 300},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 300},
      {x: 200,y: 150},{x: 400,y: 300},{x: 400,y: 400},{x: 200,y: 400},{x: 200,y: 300}
    ];

    let redNiz =
    [
      {x: 600,y: 150},{x: 300,y: 500},{x: 300,y: 500},{x: 600,y: 500},{x: 600,y: 500},
      {x: 600,y: 150},{x: 300,y: 500},{x: 300,y: 500},{x: 600,y: 500},{x: 600,y: 500},
      {x: 600,y: 150},{x: 300,y: 500},{x: 300,y: 500},{x: 600,y: 500},{x: 600,y: 500},
      {x: 600,y: 150},{x: 300,y: 500},{x: 300,y: 500},{x: 600,y: 500},{x: 600,y: 500},
      {x: 600,y: 150},{x: 300,y: 500},{x: 300,y: 500},{x: 600,y: 500},{x: 600,y: 500},
      {x: 600,y: 150},{x: 300,y: 500},{x: 300,y: 500},{x: 600,y: 500},{x: 600,y: 500}
    ];

    this.rezultatiPlavog =
    [
      0, 0, 0, 10, 0,
      10, 10, 10, 20, 30,
      40, 40, 40, 40, 30,
      40, 40, 40, 40, 30,
      40, 50, 50, 30, 20,
      20, 30, 20, 20, 20
    ];

    this.rezultatiCrvenog = 
    [
      0, 0, 10, 30, 30,
      40, 30, 40, 40, 50,
      40, 30, 40, 40, 50,
      40, 30, 40, 40, 50,
      50, 40, 50, 50, 50,
      60, 70, 80, 90, 100
    ];

    this.blueUser.ucinak = 20;
    this.redUser.ucinak = 100;
    this.blueUser.pobedio = 0;
    this.redUser.pobedio = 1;

    this.kretanje[0] = [];
    for (let j=0 ; j < blueNiz.length ; j++)
    {
      this.kretanje[0][j] = new Par(blueNiz[j].x, blueNiz[j].y);
    }

    this.kretanje[1] = [];
    for (let j=0 ; j < redNiz.length ; j++)
    {
      this.kretanje[1][j] = new Par(redNiz[j].x, redNiz[j].y);
    }

  }

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  private TreciSlucaj()
  {
    let blueNiz = 
    [
      {x: 200,y: 250},{x: 400,y: 250},{x: 300,y: 400},{x: 200,y: 400},{x: 250,y: 250},
      {x: 200,y: 250},{x: 400,y: 250},{x: 300,y: 400},{x: 200,y: 400},{x: 250,y: 250},
      {x: 200,y: 250},{x: 400,y: 250},{x: 300,y: 400},{x: 200,y: 400},{x: 250,y: 250},
      {x: 200,y: 250},{x: 400,y: 250},{x: 300,y: 400},{x: 200,y: 400},{x: 250,y: 250},
      {x: 200,y: 250},{x: 400,y: 250},{x: 300,y: 400},{x: 200,y: 400},{x: 250,y: 250},
      {x: 200,y: 250},{x: 400,y: 250},{x: 300,y: 400},{x: 200,y: 400},{x: 250,y: 250}
    ];

    let redNiz =
    [
      {x: 600,y: 250},{x: 500,y: 250},{x: 400,y: 400},{x: 600,y: 400},{x: 550,y: 250},
      {x: 600,y: 250},{x: 500,y: 250},{x: 400,y: 400},{x: 600,y: 400},{x: 550,y: 250},
      {x: 600,y: 250},{x: 500,y: 250},{x: 400,y: 400},{x: 600,y: 400},{x: 550,y: 250},
      {x: 600,y: 250},{x: 500,y: 250},{x: 400,y: 400},{x: 600,y: 400},{x: 550,y: 250},
      {x: 600,y: 250},{x: 500,y: 250},{x: 400,y: 400},{x: 600,y: 400},{x: 550,y: 250},
      {x: 600,y: 250},{x: 500,y: 250},{x: 400,y: 400},{x: 600,y: 400},{x: 550,y: 250}
    ];

    this.rezultatiPlavog =
    [
      0, 10, 10, 20, 20,
      20, 30, 30, 30, 40,
      40, 30, 30, 30, 40,
      40, 30, 30, 30, 40,
      50, 50, 50, 40, 40,
      40, 50, 50, 50, 50
    ];

    this.rezultatiCrvenog = 
    [
      0, 0, 10, 20, 30,
      30, 30, 20, 30, 40,
      30, 30, 20, 30, 40,
      30, 30, 20, 30, 40,
      50, 50, 40, 40, 50,
      50, 50, 60, 50, 50
    ];

    this.blueUser.ucinak = 50;
    this.redUser.ucinak = 50;
    this.blueUser.pobedio = 1;
    this.redUser.pobedio = 1;

    this.kretanje[0] = [];
    for (let j=0 ; j < blueNiz.length ; j++)
    {
      this.kretanje[0][j] = new Par(blueNiz[j].x, blueNiz[j].y);
    }

    this.kretanje[1] = [];
    for (let j=0 ; j < redNiz.length ; j++)
    {
      this.kretanje[1][j] = new Par(redNiz[j].x, redNiz[j].y);
    }

  }
  
}
