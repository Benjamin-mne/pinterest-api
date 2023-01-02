import express from 'express';
import { addPin, addView, deletePin, follow, getByTag, getPin, liked, profile, random, search, trend, updatePin } from '../controller/pin.js';
import { verifyToken } from '../helpers/verifyToken.js';

const router = express.Router();

router.get('/find/:id', getPin);
router.get("/tags", getByTag);
router.get('/search', search);
router.get('/random', random);
router.put('/view/:id', addView);
router.get('/trend', trend);
router.get('/profile/:id', profile);

// ===== REQUIRES USER (TODO)
router.post('/', verifyToken, addPin);
router.delete('/delete/:id', verifyToken, deletePin);
router.put('/:id', verifyToken, updatePin);
router.get('/liked/:id', verifyToken, liked);
router.get('/follow', verifyToken, follow);

export default router;


