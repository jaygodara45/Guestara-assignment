const express = require("express");

// ------------ MULTER SETUP--------------
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        return cb(null, "./uploads");
    },
    filename: function (req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });
// ------------------------------------

// --------------------------------------- CONTROLLER FUNCTIONS ---------------------------------
const { createCategoryController, getAllCategoryController, getCategoryById, deleteCategoryById, getAllSubcategoriesOfCategoryById, editCategoryById } = require("../controllers/categoryControllers");
// ----------------------------------------------------------------------------------------------

const router = express.Router();

// ------------------------------------ ROUTES --------------------------------------------------

// CREATE CATEGORY || POST
router.post('/create', upload.single('Image') ,createCategoryController);

// GET ALL CATEGORIES || GET
router.get('/getAll', getAllCategoryController);

// GET CATEGORY BY ID || GET
router.get('/getCategoryById/:id', getCategoryById);

// GET SUBCATEGORIES UNDER CATEGORY BY CATEGORY ID || GET
router.get('/getAllSubcategoriesOfCategoryById/:id', getAllSubcategoriesOfCategoryById);

// DELETE CATEGORY BY ID || DELETE
router.delete('/delete/:id', deleteCategoryById);

// UPDATE CATEGORY BY ID || PUT
router.put('/edit/:id', upload.single('Image') ,editCategoryById);

// ------------------------------------------------------------------------------------------------

module.exports = router;