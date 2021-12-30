const router = require('express').Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/authenticate');

//Error control
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});
//Add Note
router.post('/notes/new-note', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Please, insert title' });
    }
    if (!description) {
        errors.push({ text: 'Please, insert description' });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });

    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('succes_msg', 'Note Added Successfuly');
        res.redirect('/notes');
    }
});
//All Notes
router.get('/notes', isAuthenticated, async(req, res) => {
    const notes = await Note.find({}).sort({ date: 'desc' }).lean();
    res.render('notes/all-notes', { notes });
});
//CRUD Edit
router.get('/notes/edit-note/:id', isAuthenticated, async(req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', { note });
});
//CRUD Update
router.put('/notes/edit-note/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('succes_msg', 'Noted Added Successfuly');
    res.redirect('/notes');
});
//CRUD Delete
router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('succes_msg', 'Noted Delete Successfuly');
    res.redirect('/notes');
});

module.exports = router;
