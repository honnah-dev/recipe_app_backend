import express from 'express';
const router = express.Router();

import { createBoard, getAllUserBoards, getBoardById, updateBoard, deleteBoard } from '#db/queries/boards';
import requireUser from '#middleware/requireUser';
import { getRecipesByBoard, removeRecipeFromBoard } from '#db/queries/recipes';

router.use(requireUser);

router.post("/", async (req, res) => {
  const { name } = req.body;
  const board = await createBoard(req.user.id, name);
  res.status(201).json(board);
});

router.get("/", async (req, res) => {
  const boards = await getAllUserBoards(req.user.id);
  res.json(boards);
});

router.param("id", async (req, res, next, id) => {
  const board = await getBoardById(id, req.user.id);
  if (!board) return res.status(404).send("Board not found");
  req.board = board;
  next();
});

router.get("/:id", async (req, res) => {
  res.json(req.board);
});

router.put("/:id", async (req, res) => {  
  const { name } = req.body;
  const updatedBoard = await updateBoard(req.board.id, req.user.id, name);
  res.json(updatedBoard);
});   

router.delete("/:id", async (req, res) => {
  await deleteBoard(req.board.id, req.user.id);
  res.status(204).send();
}); 

router.get("/:id/recipes", async (req, res) => {
  const recipes = await getRecipesByBoard(req.board.id, req.user.id);
  res.json(recipes);
});

router.delete("/:id/recipes/:recipeId", async (req, res) => {
  await removeRecipeFromBoard(req.params.recipeId, req.board.id);
  res.status(204).send();
});

export default router;
