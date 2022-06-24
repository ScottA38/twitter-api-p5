import express from 'express';
import apiConnect from './api-connect.js';
import geoloc from './geoloc.js'
import path from 'path';
const __dirname = path.resolve(path.dirname(''));
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/tweets', async (req, res) => {
    return res.json(await apiConnect(req.query.keywords));
});

app.get('/geoloc', async (req, res) => {
    return res.json(await geoloc(req.query.place));
})

app.listen(port);