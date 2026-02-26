const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAdmin, verifyToken } = require('../middleware/authMiddleware');

router.get("/departments-list", userController.getDepartmentsList);

// GET USERS WITH PAGINATION, SEARCH, FILTERS
router.get("/users", verifyAdmin, userController.getUsers);

router.post("/users", verifyAdmin, userController.createUser);

router.get("/users/:id", verifyToken, userController.getUserById);

router.put("/users/:id", verifyAdmin, userController.updateUser);

// DELETE USER
router.delete("/users/:id", verifyAdmin, userController.deleteUser);




module.exports = router;