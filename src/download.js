'use strict';

const fs = require('fs');
const pathApi = require('path');
const md5 = require('md5');
const { zip } = require('zip-a-folder');

module.exports.Download = class Download {

    constructor(res) {
        this.res = res;
    }

    async download(path) {
        if (await this._isFile(path)) {
            this.res.download(path);
        } else {
            await this._downloadDirectory(path);
        }
    }

    async _downloadDirectory(path) {
        const temporaryDirectoryPath = await this._createTemporaryDirectory();
        const zipFilePath = this._generateZipFilePath(path, temporaryDirectoryPath);
        await zip(path, zipFilePath);
        this.res.download(zipFilePath, `${this._getFileName(path)}.zip`, async () => await this._removeFile(zipFilePath));
    }

    _removeFile(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    _getFileName(path) {
        const parts = path.split('/');
        return parts[parts.length - 1];
    }

    _generateZipFilePath(path, temporaryDirectoryPath) {
        const codeName = `${md5(path)}-${Math.floor(Math.random() * 100000)}`;
        return pathApi.resolve(temporaryDirectoryPath, codeName);
    }

    async _createTemporaryDirectory() {
        const temporaryDirectoryPath = pathApi.resolve(__dirname, '..', 'temporary');
        const elementExist = await this._elementExist(temporaryDirectoryPath);
        if (!elementExist) {
            await this._createDirectory(temporaryDirectoryPath);
        }

        return temporaryDirectoryPath;
    }

    _isFile(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stats.isFile());
                }
            });
        });
    }

    _elementExist(path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, err => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        resolve(false);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(true);
                }
            });
        })
    }

    _createDirectory(path) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }
}