var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + '/public'));
// получение списка данных
app.get('/api/list', function (req, res) {
    var content = fs.readFileSync('list.json', 'utf8');
    var list = JSON.parse(content);
    res.send(list);
});
// получение одного пользователя по id
app.get('/api/list/:id', function (req, res) {
    var id = req.params.id; // получаем id
    var content = fs.readFileSync('list.json', 'utf8');
    var list = JSON.parse(content);
    var user = null;
    // находим в массиве пользователя по id
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            user = list[i];
            break;
        }
    }
    // отправляем пользователя
    if (user) {
        res.send(user);
    } else {
        res.status(404).send();
    }
});
// получение отправленных данных
app.post('/api/list', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    var userName = req.body.name;
    var userAge = req.body.age;
    var user = { name: userName, age: userAge };

    var data = fs.readFileSync('list.json', 'utf8');
    var list = JSON.parse(data);

    // находим максимальный id
    var id = Math.max.apply(
        Math,
        list.map(function (o) {
            return o.id;
        })
    );
    // увеличиваем его на единицу
    user.id = id + 1;
    // добавляем пользователя в массив
    list.push(user);
    var data = JSON.stringify(list);
    // перезаписываем файл с новыми данными
    fs.writeFileSync('list.json', data);
    res.send(user);
});
// удаление пользователя по id
app.delete('/api/list/:id', function (req, res) {
    var id = req.params.id;
    var data = fs.readFileSync('list.json', 'utf8');
    var list = JSON.parse(data);
    var index = -1;
    // находим индекс пользователя в массиве
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        // удаляем пользователя из массива по индексу
        var user = list.splice(index, 1)[0];
        var data = JSON.stringify(list);
        fs.writeFileSync('list.json', data);
        // отправляем удаленного пользователя
        res.send(user);
    } else {
        res.status(404).send();
    }
});
// изменение пользователя
app.put('/api/list/:id', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    var userId = req.body.id;
    var userName = req.body.name;
    var userAge = req.body.age;

    var data = fs.readFileSync('list.json', 'utf8');
    var list = JSON.parse(data);
    var user;
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == userId) {
            user = list[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if (user) {
        user.age = userAge;
        user.name = userName;
        var data = JSON.stringify(list);
        fs.writeFileSync('list.json', data);
        res.send(user);
    } else {
        res.status(404).send(user);
    }
});

app.listen(3000, function () {
    console.log('Сервер ожидает подключения...');
});
