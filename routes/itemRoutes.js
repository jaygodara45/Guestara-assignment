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

// --------------------------------------------------- IMPORTING CONTROLLERS -------------------------------------------
const { createItemController, getAllItemController, getItemById, deleteItemById, getAllItemsOfCategoryById, getAllItemsOfSubcategoryById, searchByName, edit } = require("../controllers/itemsController");
// ---------------------------------------------------------------------------------------------------------------------

const router = express.Router();

/// ------------------------------------------ ROUTES -------------------------------------------------------------------------

// -------------------------------------- CREATE ITEM || POST ------------------------------------------------
router.post('/create', upload.single('Image'), createItemController);
// -----------------------------------------------------------------------------------------------------------

// ---------------------------------------GET ALL ITEMS || GET ----------------------------------------------
router.get('/getAll', getAllItemController);
// ----------------------------------------------------------------------------------------------------------

// ------------------------------ GET ITEM BY ID || GET ------------------------------------------------
router.get('/getItemById/:id', getItemById);
// -------------------------------------------------------------------------------------------------------

// ------------------------ GET ITEMS OF CATEGORY BY ID || GET ---------------------------------------------------
router.get('/getAllItemsOfCategoryById/:id', getAllItemsOfCategoryById);
// --------------------------------------------------------------------------------------------------------------

// ------------------------- GET ITEMS OF SUBCATEGORY BY ID || GET -----------------------------------------------
router.get('/getAllItemsOfSubcategoryById/:id', getAllItemsOfSubcategoryById);
// --------------------------------------------------------------------------------------------------------------

// --------------------------- GET ITEMS BY NAME || GET --------------------------------------------------------
router.get('/getItemByName', searchByName);
// ----------------------------------------------------------------------------------------------------

// ---------------------------- UPDATE ITEMS BY ID || PUT -----------------------------------------------------
router.put('/edit/:id',  upload.single('Image') ,edit);
// ------------------------------------------------------------------------------------------------------

// ---------------------------- DELETE ITEM BY ID || DELETE ---------------------------------------------
router.delete('/delete/:id', deleteItemById);
// --------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;