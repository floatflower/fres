class ViewDataProvider {
    constructor(name) {
        this.name = name;
    }

    provide() {
        return new Promise(resolve => {resolve()});
    }
}

module.exports = ViewDataProvider;