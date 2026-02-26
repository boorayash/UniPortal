const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/departmentController');
const { verifyAdmin } = require('../middleware/authMiddleware');

/* ---------------- GET ALL DEPARTMENTS ---------------- */
router.get('/departments', departmentController.getAllDepartments);

/* ---------------- CREATE DEPARTMENT ---------------- */
router.post('/departments', verifyAdmin, departmentController.createDepartment);

/* ---------------- UPDATE DEPARTMENT ---------------- */
router.put('/departments/:id', verifyAdmin, departmentController.updateDepartment);

/* ---------------- DELETE DEPARTMENT ---------------- */
router.delete('/departments/:id', verifyAdmin, departmentController.deleteDepartment);


module.exports = router;