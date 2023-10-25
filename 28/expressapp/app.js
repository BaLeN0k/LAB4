const express = require('express');

const app = express();

app.set('view engine', 'hbs');

app.use('/contact', function (request, response) {
    response.render('contact.hbs');
});
app.use('/', function (request, response) {
    response.send('Главная страница');
});
app.listen(3000);
