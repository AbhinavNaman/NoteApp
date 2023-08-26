//server>routes>notes.js
import express from 'express';

import { fetchNotes, createNote, deletePost, updateNote, updatePin} from '../controller/notes.js';

const router = express.Router();

router.get('/', fetchNotes);
router.post('/', createNote);
router.patch('/:id', updateNote);
router.patch('/updatepin/:id', updatePin);
router.delete('/:id', deletePost);

export default router;