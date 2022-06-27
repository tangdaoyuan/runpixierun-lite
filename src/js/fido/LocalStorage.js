
const LocalStorage = function(bundleId) {
    this.id = bundleId;
}
LocalStorage.prototype.store = function(key, value) {
    localStorage.setItem(this.id + '.' + key, value);
}
LocalStorage.prototype.get = function(key) {
    return localStorage.getItem(this.id + '.' + key) || 0;
}
LocalStorage.prototype.remove = function(key) {
    localStorage.removeItem(this.id + '.' + key);
}
LocalStorage.prototype.reset = function() {
    for (let i in localStorage) {
        if (i.indexOf(this.id + '.') !== -1) localStorage.removeItem(i);
    }
}

export default LocalStorage;
