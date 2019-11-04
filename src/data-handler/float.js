module.exports = (data, defaultValue = 0.0) => {
    if(typeof data === "undefined") {
        return defaultValue;
    }
    let parsed = parseFloat(data);
    if(isNaN(parsed)) {
        return defaultValue;
    } else {
        return parsed;
    }
};