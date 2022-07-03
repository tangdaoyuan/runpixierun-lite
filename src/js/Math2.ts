export class Math2 {
    static random(from: number, to: number) {
        return Math.random() * (to - from) + from;
    }
    static map(val: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number) {
        return ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin;
    }
    static randomPlusMinus(chance: boolean) {
        const _chance = chance ? chance : 0.5;
        return (Math.random() > _chance) ? -1 : 1;
    }
    static randomInt(from: number, to: number) {
        to += 1;
        return Math.floor(Math.random() * (to - from) + from);
    }
    static randomBool(chance: boolean) {
        const _chance = chance ? chance : 0.5;
        return (Math.random() < _chance) ? true : false;
    }
}
