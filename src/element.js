'use strict';

module.exports.Element = class Element {

    constructor(isFile = false, path = '') {
        this.isFile = isFile;
        this.path = path;
    }

    isFile() {
        return this.isFile;
    }

    isDirectory() {
        return !this.isFile();
    }

    getPath() {
        return this.path;
    }
}