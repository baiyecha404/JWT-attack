const express = require('express');
const app = express();
const path = require('path');
const createError = require('http-errors');
const indexRouter = require('./routes/index');

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);

app.use((_req, res, next) => {
    res.status(404);
    res.json(createError(404));
});

app.listen(8000, () => {
    console.log('Listening at port 8000');
});
