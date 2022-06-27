// update
export const Math2 = {};

Math2.random = function(from, to) {
    return Math.random() * (to - from) + from;
}

Math2.map = function(val, inputMin, inputMax, outputMin, outputMax) {
    return ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin;
}


Math2.randomPlusMinus = function(chance) {
    chance = chance ? chance : 0.5;
    return (Math.random() > chance) ? -1 : 1;
}

Math2.randomInt = function(from, to) {
    to += 1;
    return Math.floor(Math.random() * (to - from) + from);
}



Math2.randomBool = function(chance) {
    chance = chance ? chance : 0.5;
    return (Math.random() < chance) ? true : false;
}
