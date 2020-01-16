'use strict';

const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');

const { configuration } = require('./configuration');
const { Explorer } = require('./src/explorer');
const { Download } = require('./src/download');
const { Upload } = require('./src/upload');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'src', 'page'));
app.use(express.static(path.resolve(__dirname, 'src', 'resource')));
app.use(fileUpload());

app.get('/', async (req, res) => {
    try {
        const path = req.query.path;
        const explorer = new Explorer(req.query.path);
        const elements = await explorer.explore();
        res.render('explorer', { currentPath: path, elements });
    } catch (err) {
        res.send(err);
    }
});

app.get('/download', async (req, res) => {
    try {
        const download = new Download(res);
        await download.download(req.query.path);
    } catch (err) {
        res.send({ success: false, err: `${err}` });
    }
});

app.post('/upload', async (req, res) => {
    try {
        const upload = new Upload(req);
        await upload.saveFiles();
        res.send({ success: true });
    } catch (err) {
        res.send({ success: false, err: `${err}` });
    }

});

const host = configuration.server.host;
const port = configuration.server.port;

app.listen(port, host, () => console.log(`Server file exchanger runs on [http://${host}:${port}]`));