const express = require('express');
const postController = require('../controllers/postController');
const checkSlug = require('../middlewares/checkSlug');
const router = express.Router();

// Middlewares
// router.param('slug', checkSlug);

// CRUD requests
router.get('/', postController.index);

router.get('/:id', postController.show);

router.post('/', postController.store);

router.put('/:id', postController.update);

router.patch('/:id', postController.modify);

router.delete('/:id', postController.destroy);

module.exports = router;
