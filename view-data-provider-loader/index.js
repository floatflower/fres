const fs = require('fs');
const validation = require('../validation');
const ViewDataProvider = require('../view-data-provider');

class ViewDataProviderLoader {

    constructor() {
        this.providers = new Map();
    }

    init() {
        let viewDataProviderDirectory = `${process.cwd()}/src/view-data-provider`;
        if(fs.existsSync(viewDataProviderDirectory)) {
            let filesList = fs.readdirSync(viewDataProviderDirectory);
            filesList.forEach(file => {
                if (fs.statSync(`${viewDataProviderDirectory}/${file}`).isFile()) {
                    let viewDataProviderConstructor = require(`${viewDataProviderDirectory}/${file}`);
                    if (validation.isConstructor(viewDataProviderConstructor)) {
                        let rootInstance = new viewDataProviderConstructor();
                        if (rootInstance instanceof ViewDataProvider) {
                            this.set(viewDataProviderConstructor);
                        }
                    }
                }
            });
        }
    }

    set(provider) {
        if(validation.isConstructor(provider)) {
            const rootInstance = new provider();
            if(rootInstance instanceof ViewDataProvider) {
                this.providers.set(rootInstance.name, provider);
            }
        }

        return this;
    }

    getViewData(providers = []) {
        return new Promise(async resolve => {
            let viewData = {};

            if(providers.length === 0) {
                for(let [name, providerConstructor] of this.providers) {
                    const providerInstance = new providerConstructor();
                    viewData[name] = await providerInstance.provide();
                }
            } else {
                for(let providerName in providers) {
                    if(this.providers.has(providerName)) {
                        const providerConstructor = this.providers.get(providerName);
                        const providerInstance = new providerConstructor();
                        viewData[name] = await providerInstance.provide();
                    }
                }
            }

            resolve(viewData);
        })
    }
}
const singleton = new ViewDataProviderLoader();
singleton.init();
module.exports = singleton;