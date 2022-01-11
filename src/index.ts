import express from 'express';

let rates = require('./routes/rates');
let whightlist = require('./routes/whightlist');


const app = express();

app.use('/rates', rates);
app.use('/whitelist', whightlist);


const port = 3000;
app.listen(port, () => {
    console.log(`rf-engine start on port ${port}.`);
});



