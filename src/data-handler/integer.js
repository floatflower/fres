module.exports = (data, defaultValue = 0, base = 10) => {
    if(typeof data === "undefined") {
        return defaultValue;
    }
    let parsed = parseInt(data, base);
    if(isNaN(parsed)) {
        return defaultValue;
    }
    else {
        return parsed;
    }
};