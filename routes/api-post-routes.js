const express = require('express');
const router = express.Router();
const { getPost, deletePost, editPost, getPosts, addPost} = require('../controller/api-post-controller');


// Получить все публикации
router.get('/api/posts', getPosts);
// Добавить новую публикацию
router.post('/api/post', addPost);
// Получить публикацию по ID
router.get('/api/post/:id', getPost);
// Удалить публикацию
router.delete('/api/post/:id', deletePost);
// Изменить публикацию
router.put('/api/post/:id', editPost);


module.exports = router;