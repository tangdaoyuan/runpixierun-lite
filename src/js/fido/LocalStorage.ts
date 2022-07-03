class LocalStorage {
    id: string;
    constructor(bundleId: string) {
        this.id = bundleId
    }
    store(key: string, value: string | number | boolean) {
        localStorage.setItem(this.id + '.' + key, `${value}`);
    }
    get(key: string) {
        return localStorage.getItem(this.id + '.' + key) || 0;
    }
    remove(key: string) {
        localStorage.removeItem(this.id + '.' + key);
    }
    reset() {
        for (let i in localStorage) {
            if (i.indexOf(this.id + '.') !== -1) localStorage.removeItem(i);
        }
    }
}

export default LocalStorage;
