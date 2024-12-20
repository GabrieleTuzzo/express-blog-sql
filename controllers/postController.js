const connection = require('../data/db.js');
const utilityFunctions = require('../utilities/functions.js');

function index(req, res) {
    // let tag = req.query.tag;
    // let responseObj = postsArray;
    // if (tag) {
    //     let tagFormatted = utilityFunctions.capitalizeString(tag);
    //     // console.log(tagFormatted);
    //     responseObj = postsArray.filter((post) =>
    //         post.tags.includes(tagFormatted)
    //     );
    // }

    // res.json(responseObj);

    const sql = 'SELECT * FROM posts';

    connection.query(sql, (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
}

function show(req, res) {
    // let responseObj = res.responseObj.element;

    // console.log(responseObj);
    // res.json(responseObj);

    const id = req.params.id;
    console.log(id);
    const sql = 'SELECT * FROM posts WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0)
            return res.status(404).json({ error: 'Post not found' });
        res.json(results[0]);
    });
}

function store(req, res) {
    let receivedObj = req.body;
    let isDataValid = true;

    for (const key in receivedObj) {
        if (!receivedObj[key]) {
            res.status(422);
            receivedObj = {
                error: 'Bad data received',
                message: 'Bad data received',
            };
            isDataValid = false;
        }
        break;
    }

    if (isDataValid) {
        const newSlug = utilityFunctions.getSlug(receivedObj.title);
        receivedObj.slug = newSlug;

        postsArray.push(receivedObj);

        console.log('Nuovo post creato');
        res.status(201);
    }

    res.json(receivedObj);
}

function update(req, res) {
    let newDataObj = req.body;
    let responseObj = res.responseObj.element;
    const newSlug = utilityFunctions.getSlug(newDataObj.title);

    newDataObj.slug = newSlug;

    for (const key in newDataObj) {
        if (!newDataObj[key]) {
            return res.status(422).json({
                error: 'Bad data received',
                message: 'Bad data received',
            });
        }
    }

    newDataObj.id = responseObj.id;

    for (const key in responseObj) {
        responseObj[key] = newDataObj[key];
    }

    console.log('Post aggiornato');
    res.json(responseObj);
}

function modify(req, res) {
    let newDataObj = req.body;
    let responseObj = res.responseObj.element;

    if (req.body && typeof req.body === 'object') {
        for (const key in responseObj) {
            if (newDataObj[key]) {
                responseObj[key] = newDataObj[key];
            }
        }

        responseObj.slug = utilityFunctions.getSlug(responseObj.title);

        console.log('Post modificato');
    }
    res.json(responseObj);
}

function destroy(req, res) {
    // let postIndex = res.responseObj.index;
    // postsArray.splice(postIndex, 1);
    // console.log(postsArray);
    // res.sendStatus(204);

    const id = req.params.id;
    const sql = 'DELETE FROM posts WHERE id = ?';
    connection.query(sql, [id], (err) => {
        if (err)
            return res.status(500).json({ error: 'Failed to delete Post' });
        res.sendStatus(204);
    });
}

module.exports = { index, show, store, update, modify, destroy };
