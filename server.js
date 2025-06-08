const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

app.set('view engine', 'ejs');

const PORT = 3000;

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`http://localhost:3000/ \nlistening port ${PORT}`);
});


// Миделвары
app.use ((req, res, next) => {
    console.log(`path: ${req.path}`);
    console.log(`method: ${req.method}`);
    next();
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false }));

app.use (express.static('styles'));
// --------

app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), { title });
});

app.get('/contacts', (req, res) => {
    const title = 'Contacts';
    const contacts = [
        { name: 'TG', link: 'https://web.telegram.org' },
        { name: 'VK', link: 'https://vk.com'}
    ];
    res.render(createPath('contacts'), { contacts, title});
});

app.get('/posts/:id', (req, res) => {
    const title = 'Post';
    const post = {
        id: '1',
        text: 'Это полный текст поста',
        title: 'Название поста',
        date: '06.06.2025',
        author: 'Alex',
    };
    res.render(createPath('post'), { title, post });
});

app.get('/posts', (req, res) => {
    const title = 'Post';
    const posts = [
        {
        id: '1',
        text: 'Это полный текст поста',
        title: 'Название поста',
        date: '06.06.2025',
        author: 'Alex',
        }
    ];
    res.render(createPath('posts'), { title, posts });
});

app.post('/add-post', (req, res) => {
    const { title, author, text } = req.body;
    const post = {
        id: new Date(),
        date: (new Date()).toLocaleDateString(),
        title,
        author,
        text,
    };
    res.render(createPath('post'), { title, post});
});

app.get('/add-post', (req, res) => {
    const title = 'Add post';
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