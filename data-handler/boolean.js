module.exports = (data) => {
    if(typeof data === "boolean" ) {
        return data;
    }
    else if(typeof data === 'number') {
        return parseInt(data) !== 0;
    }
    else if(typeof data === "string") {
        return data === "true";
    }
    else {
        return false;
    }
};