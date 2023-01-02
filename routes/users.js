import express from 'express';
import { deleteUser, dislike, follow, getUser, like, unfollow, update } from '../controller/user.js';
import { verifyToken } from '../helpers/verifyToken.js';

const router = express.Router();

router.get("/find/:id", getUser);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, deleteUser);
router.put("/follow/:id", verifyToken, follow);
router.put("/unfollow/:id", verifyToken, unfollow);
router.put("/like/:pinId", verifyToken, like);
router.put("/dislike/:pinId", verifyToken, dislike);


export default router;