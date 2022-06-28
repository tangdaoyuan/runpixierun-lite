class LocalStorage {
    constructor(bundleId) {
        this.id = bundleId
    }
    store(key, value) {
        localStorage.setItem(this.id + '.' + key, value);
    }
    get(key) {
        return localStorage.getItem(this.id + '.' + key) || 0;
    }
    remove(key) {
        localStorage.removeItem(this.id + '.' + key);
    }
    reset() {
        for (let i in localStorage) {
            if (i.indexOf(this.id + '.') !== -1) localStorage.removeItem(i);
        }
    }
}

export default LocalStorage;
