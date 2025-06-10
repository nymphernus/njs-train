const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const methodOverride = require('method-override');
const postRoutes = require('./routes/post-routes');
const postApiRoutes = require('./routes/api-post-routes');
const contactRoutes = require('./routes/contact-routes');
const createPath = require('./helpers/create-path');

const app = express();

app.set('view engine', 'ejs');

// Подключение к БД
mongoose
    .connect(process.env.MONGO_URL)
    .then((res) => console.log('>>> Подключение к MongoDB'))
    .catch((error) => console.log(error));


// Запуск сервера
app.listen(process.env.PORT, (error) => {
    error ? console.log(error) : console.log(`http://localhost:3000/ \n>>> Прослушивание порта: ${process.env.PORT}`);
});

// Миделвары
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false }));

app.use (express.static('styles'));

app.use (express.static('assets'));

app.use(methodOverride('_method'));


//Роуты
app.get('/', (req, res) => {
    const title = 'Главная';
    res.render(createPath('index'), { title });
});

app.use(postRoutes);
app.use(contactRoutes);
app.use(postApiRoutes);

// Находится после всех роутов
app.use((req, res) => {
    const title = 'Error 404';
    res
    .status(404)
    .render(createPath('error'), { title });
});