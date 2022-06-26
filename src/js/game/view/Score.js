import * as PIXI from '../../pixi'

const Score = function() {
    PIXI.Container.call(this);
    this.ratio = 0;

    this.glyphs = {
        0: "number_00.png",
        1: "number_01.png",
        2: "number_02.png",
        3: "number_03.png",
        4: "number_04.png",
        5: "number_05.png",
        6: "number_06.png",
        7: "number_07.png",
        8: "number_08.png",
        9: "number_09.png",
        ",": "number_comma.png"
    }

    for (i in this.glyphs) this.glyphs[i] = PIXI.Texture.from(this.glyphs[i]);

    this.digits = [];

    for (var i = 0; i < 8; i++) {
        this.digits[i] = new PIXI.Sprite(this.glyphs[i]);
        this.addChild(this.digits[i]);
    }

    this.setScore(formatScore(12345))
}


Score.constructor = PIXI.Score;
Score.prototype = Object.create(PIXI.Container.prototype);

Score.prototype.setScore = function(score) {
    const split = formatScore(score).split("");
    let position = 0;
    const gap = -10;
    for (let i = 0; i < split.length; i++) {
        let digit = this.digits[i];
        digit.visible = true;
        digit.texture = (this.glyphs[split[i]]);
        digit.position.x = position;
        position += digit.width + gap;
    }

    for (let i = 0; i < this.digits.length; i++) {
        this.digits[i].position.x -= position;
    }

    for (let i = split.length; i < this.digits.length; i++) {
        this.digits[i].visible = false;
    }
}

Score.prototype.jump = function() {
    this.ratio = 2.2;
}

function formatScore(n) {

    var nArray = n.toString().split("");
    var text = "";
    var total = nArray.length;

    var offset = (total % 3) - 1;
    for (var i = 0; i < total; i++) {
        text += nArray[i];
        if ((i - offset) % 3 == 0 && i != total - 1) text += ",";
    }

    return text;
}

export {
    Score,
    formatScore
}
