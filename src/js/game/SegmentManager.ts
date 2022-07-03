import { data } from '../SegmentData'
import GAME from './Game'
import type { RprEngine } from './RprEngine';

class SegmentManager {
    engine: RprEngine;
    sections: {
start: any; length: number; floor: number[]; blocks: number[]; coins: number[]; 
}[];
    count: number;
    currentSegment: {
start: number; length: number; floor: number[]; blocks: number[]; coins: number[]; 
};
    startSegment: {
start: any; length: number; floor: number[]; blocks: never[]; coins: never[]; 
};
    chillMode: boolean;
    last: number;
    position: number;

    constructor(engine: RprEngine) {
        this.engine = engine;

        this.sections = data //[section1, section2];
        this.count = 0;
        this.currentSegment = data[0]
        //this.currentSegment.start = -10000
        this.startSegment = {
            start: -200,
            length: 1135 * 2,
            floor: [0, 1135],
            blocks: [],
            coins: []
        }
        this.chillMode = true;
        this.last = 0;
        this.position = 0;
    }
    reset(dontReset?: boolean) {
        //	this.currentSegment.start;// = GAME.camera.x;
        if (dontReset) this.count = 0;
        this.currentSegment = this.startSegment;
        this.currentSegment.start = -200;

        for (let i = 0; i < this.currentSegment.floor.length; i++) {
            this.engine.floorManager.addFloor(this.currentSegment.start + this.currentSegment.floor[i]);
        }
    }

    update() {
        this.position = GAME.camera.x + GAME.width * 2;
        // look at where we are..
        const relativePosition = this.position - this.currentSegment.start;

        //	console.log(Math.round(relativePosition) + " " +this.currentSegment.length);
        if (relativePosition > this.currentSegment.length) {

            if (this.engine.joyrideMode) {
                let nextSegment = this.startSegment
                nextSegment.start = this.currentSegment.start + this.currentSegment.length;
                this.currentSegment = nextSegment;

                for (let i = 0; i < this.currentSegment.floor.length; i++) {
                    this.engine.floorManager.addFloor(this.currentSegment.start + this.currentSegment.floor[i]);
                }

                return;
            }


            let nextSegment = this.sections[this.count % this.sections.length];
            //		if(this.chillMode)nextSegment =  this.sections[0];
            //	console.log( this.sections.length)
            // section finished!
            nextSegment.start = this.currentSegment.start + this.currentSegment.length;

            this.currentSegment = nextSegment;

            // add the elements!
            for (let i = 0; i < this.currentSegment.floor.length; i++) {
                this.engine.floorManager.addFloor(this.currentSegment.start + this.currentSegment.floor[i]);
            }

            let blocks = this.currentSegment.blocks;
            let length = blocks.length / 2;

            for (let i = 0; i < length; i++) {
                this.engine.enemyManager.addEnemy(this.currentSegment.start + blocks[i * 2], blocks[(i * 2) + 1]);
            }

            let pickups = this.currentSegment.coins;
            length = pickups.length / 2;

            for (let i = 0; i < length; i++) {
                this.engine.pickupManager.addPickup(this.currentSegment.start + pickups[i * 2], pickups[(i * 2) + 1]);
            }

            this.count++;

        }

    }
}



export {
    SegmentManager
}
