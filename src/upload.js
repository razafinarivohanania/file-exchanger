'use strict';

const path = require('path');

module.exports.Upload = class Upload {

    constructor(req) {
        this.req = req;
    }

    async saveFiles() {
        const fileKeys = Object.keys(this.req.files);
        for (const fileKey of fileKeys) {
            await this._saveFile(fileKey)
        }
    }

    _saveFile(fileKey) {
        return new Promise((resolve, reject) => {
            const file = this.req.files[fileKey];
            const uploadFilePath = this._buildUploadFilePath(file);
            file.mv(uploadFilePath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    _buildUploadFilePath(file) {
        return path.resolve(this.req.query.path, file.name);
    }
}