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

// ------------------------- CONTROLLER FUNCTION FOR SUBCATEGORY -----------------------------------------------
const { createSubcategoryController, getAllSubcategoryController, getSubcategoryById, deleteSubcategoryById, editSubcategoryById } = require("../controllers/subcategoryController");
// -------------------------------------------------------------------------------------------------------------

const router = express.Router();

// -------------------------------------- ROUTES ------------------------------------

// ----------- CREATE SUBCATEGORY || POST -------------
router.post('/create', upload.single('Image'), createSubcategoryController);
// -------------------------------------------------

// ----------- GET ALL SUBCATEGORIES || GET ----------------
router.get('/getAll', getAllSubcategoryController);
// ------------------------------------------------

// --------- GET SUBCATEGORY BY ID || GET -------------
router.get('/getSubcategoryById/:id', getSubcategoryById);
// ----------------------------------------------

// --------- EDIT SUBCATEGORY BY ID || PUT ----------------
router.put('/edit/:id', upload.single('Image'), editSubcategoryById);

// ---------- DELETE SUBCATEGORY BY ID || DELETE ---------
router.delete('/delete/:id', deleteSubcategoryById);

// ------------------------------------------------------------------------------------

module.exports = router;