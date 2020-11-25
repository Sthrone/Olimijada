import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

export class Player
{
    game: Phaser.Game;
    public sprite: Phaser.Sprite;
    public text: Phaser.Text;

    constructor(game: Phaser.Game, xPos: number, yPos: number, name: string, key: string)
    {
        this.game = game;

        this.sprite = new Phaser.Sprite(game, xPos, yPos, key);
        this.SetPlayerData(name);
    }

    public ShowUp()
    {
        this.game.add.existing(this.sprite);
        this.game.add.existing(this.text);
    }

    public move(_x: number, _y: number)
    {   
        /*
        this.sprite.x = _x;
        this.sprite.y = _y;
        this.text.x = _x;
        this.text.y = _y + 3;
        */

        this.game.add.tween(this.sprite).to( { x: _x, y: _y }, 1000, "Sine.easeInOut", true);
        this.game.add.tween(this.text).to( { x: _x, y: _y + 3 }, 1000, "Sine.easeInOut", true);
    }
    
    private SetPlayerData(name: string)
    {
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.scale.setTo(0.7, 0.7);

        let style = { font: "13px Arial", fill: "white", wordWrap: true, wordWrapWidth: this.sprite.width, align: "center" };
        this.text = new Phaser.Text(this.game, this.sprite.x, this.sprite.y + 3, name);
        this.text.anchor.set(0.5, 0.5);
        this.text.setStyle(style);
    }

    public SetCoordinates(_x: number, _y: number)
    {
        this.sprite.x  = _x;
        this.sprite.y = _y;
        this.text.x = _x;
        this.text.y = _y + 3;
    }
    
}