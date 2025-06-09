const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const postRoutes = require('./routes/post-routes');
const contactRoutes = require('./routes/contact-routes');
const createPath = require('./helpers/create-path');

app.set('view engine', 'ejs');

// Подключение к БД
const db = 'mongodb://admin:1234@localhost:27017/njs_train?authSource=admin';
mongoose
    .connect(db)
    .then((res) => console.log('>>> Подключение к MongoDB'))
    .catch((error) => console.log(error));


// Запуск сервера
const PORT = 3000;

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`http://localhost:3000/ \n>>> Прослушивание порта: ${PORT}`)
});

// Миделвары
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false }));

app.use (express.static('styles'));

app.use(methodOverride('_method'));


//Роуты
app.get('/', (req, res) => {
    const title = 'Главная';
    res.render(createPath('index'), { title });
});

app.use(postRoutes);
app.use(contactRoutes);

// Находится после всех роутов
app.use((req, res) => {
    const title = 'Error 404';
    res
    .status(404)
    .render(createPath('error'), { title });
});