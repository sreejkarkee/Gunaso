import { Router } from "express";
import { deleteUser, listUsers, register, login, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import { restrictTo } from "../middleware/role.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.get("/", protect, restrictTo("admin"), listUsers);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

export default router;