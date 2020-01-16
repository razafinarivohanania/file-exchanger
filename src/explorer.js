'use strict';

const fs = require('fs');
const path = require('path');

const kiloOctet = 1024;
const megaOctet = Math.pow(1024, 2);
const gigaOctet = Math.pow(1024, 3);
const teraOctet = Math.pow(1024, 4);

module.exports.Explorer = class Explorer {

    constructor(directoryPath) {
        this.directoryPath = directoryPath ? directoryPath : '/';
    }

    explore() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.directoryPath, async (err, names) => {
                if (err) {
                    reject(err);
                    return;
                }

                const elements = [];
                for (const name of names) {
                    const fullPath = this._buildFullPath(name);
                    elements.push(await this._getProperties(name, fullPath));
                }

                this._sortElements(elements);
                const parentElement = this._getParentElement();
                elements.forEach(element => element.size = this._formatSize(element.size));

                if (parentElement) {
                    resolve([parentElement, ...elements]);
                } else {
                    resolve(elements);
                }
            })
        });
    }

    _getParentElement() {
        const parts = this.directoryPath.split('/').filter(part => part);
        if (!parts || !parts.length) {
            return;
        }

        return {
            name: '..',
            isFile: false,
            path: this._getParentPath(parts),
            size: undefined,
        }
    }

    _getParentPath(parts){
        const parentPath = parts.slice(0, parts.length - 1);
        return parentPath.length ? `/${parentPath.join('/')}` : '/';
    }

    _getProperties(name, fullPath) {
        return new Promise((resolve, reject) => {
            fs.stat(fullPath, (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }

                const isFile = stats.isFile();
                const size = isFile ? stats.size : undefined;

                resolve({ name, isFile, path: fullPath, size });
            });
        })
    }

    _buildFullPath(relativePath) {
        return path.resolve(this.directoryPath, relativePath);
    }

    _sortElements(elements) {
        elements.sort((element1, element2) => {
            if (!element1.isFile) {
                return -1;
            }

            if (!element2.isFile) {
                return 1;
            }

            return element1.name.localeCompare(element2.name);
        });
    }

    _formatSize(size) {
        if (size !== 0 && !size) {
            return;
        }

        if (size > teraOctet) {
            return `${Math.floor(size / teraOctet)} To`;
        }

        if (size > gigaOctet) {
            return `${Math.floor(size / gigaOctet)} Go`;
        }

        if (size > megaOctet) {
            return `${Math.floor(size / megaOctet)} Mo`;
        }

        if (size > kiloOctet) {
            return `${Math.floor(size / kiloOctet)} Ko`;
        }

        return `${size} o`;
    }
}