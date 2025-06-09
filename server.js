const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Post = require('./models/post');
const Contact = require('./models/contact');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');

const PORT = 3000;

const db = 'mongodb://admin:1234@localhost:27017/njs_train?authSource=admin';

mongoose
    .connect(db)
    .then((res) => console.log('>>> Подключение к MongoDB'))
    .catch((error) => console.log(error));

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`http://localhost:3000/ \n>>> Прослушивание порта: ${PORT}`)
});

// Миделвары

// app.use ((req, res, next) => {
//     console.log(`path: ${req.path}`);
//     console.log(`method: ${req.method}`);
//     next();
// });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false }));

app.use (express.static('styles'));

app.use(methodOverride('_method'));
// --------

app.get('/', (req, res) => {
    const title = 'Главная';
    res.render(createPath('index'), { title });
});

app.get('/contacts', (req, res) => {
    const title = 'Контакты';
    Contact
     .find()
     .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
     .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error 404' });
     });
});

app.get('/posts/:id', (req, res) => {
    const title = 'Публикация';
    Post
     .findById(req.params.id)
     .then((post) => res.render(createPath('post'), { post, title }))
     .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error 404' });
     });
});

app.delete('/posts/:id', (req, res) => {
    const title = 'Публикация';
    Post
     .findByIdAndDelete(req.params.id)
     .then(result => {
        res.sendStatus(200);
     })
     .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error 404' });
     });
});

app.get('/edit/:id', (req, res) => {
    const title = 'Редактирование публикации';
    Post
     .findById(req.params.id)
     .then((post) => res.render(createPath('edit-post'), { post, title }))
     .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error 404' });
     });
});

app.put('/edit/:id', (req, res) => {
    const { title, author, text} = req.body;
    const { id } = req.params;
    Post
     .findByIdAndUpdate(id, { title, author, text })
     .then(result => res.redirect(`/posts/${id}`))
     .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error 404' });
     });
});

app.get('/posts', (req, res) => {
    const title = 'Публикации';
    Post
     .find()
     .sort({ createdAt: -1 })
     .then((posts) => res.render(createPath('posts'), { posts, title }))
     .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error 404' });
     });
});

app.post('/add-post', (req, res) => {
    const { title, author, text } = req.body;
    const post = new Post({ title, author, text });
    post
     .save()
     .then((result) => res.redirect('posts'))
     .catch((error) => {
        console.log(error);
        res.render(createPath('error'), { title: 'Error 404'})
     });
});

app.get('/add-post', (req, res) => {
    const title = 'Новая публикация';
    res.render(createPath('add-post'), { title });
});

app.get('/about-us', (req, res) => {
    res.redirect('/contacts');
});


// Находится после всех роутов
app.use((req, res) => {
    const title = 'Error 404';
    res
    .status(404)
    .render(createPath('error'), { title });
});