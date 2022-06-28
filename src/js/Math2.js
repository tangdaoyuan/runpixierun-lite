export class Math2 {
    static random(from, to) {
        return Math.random() * (to - from) + from;
    }
    static map(val, inputMin, inputMax, outputMin, outputMax) {
        return ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin;
    }
    static randomPlusMinus(chance) {
        chance = chance ? chance : 0.5;
        return (Math.random() > chance) ? -1 : 1;
    }
    static randomInt(from, to) {
        to += 1;
        return Math.floor(Math.random() * (to - from) + from);
    }
    static randomBool(chance) {
        chance = chance ? chance : 0.5;
        return (Math.random() < chance) ? true : false;
    }
}
