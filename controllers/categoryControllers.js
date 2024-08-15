const multer = require('multer');
const path = require('path');

// ----------------------------- IMPORTING CATEGORY MODEL -------------------------------------------------
const categories = require("../models/categories");

// ----------------------------- CONTROLLER FUNCTIONS ----------------------------------------------------------

// ----------- CREATE CATEGORY ----------------------


const createCategoryController = async(req,res) => {
    try{
        const {
            name,  
            description, 
            tax_applicability, 
            tax, 
            tax_type
        } = req.body;
        
        
        let imageUrl;
        if(req.file){
            imageUrl= path.join(__dirname, '..', req.file.path);
            imageUrl = imageUrl.replace(/\\/g, '/');
        }

        

        

        
        
        
        
        
        if(!name){
            return res.status(500).send({
                success:false,
                message: 'Please provide category name',
                error
            })
        }
        const ifExists = await categories.find({name: name});
        if(ifExists.length>0){
            return res.status(404).send({
                success: false,
                message: "category with this name already exists"
            })
        }
        const newCategory = new categories({
            name, 
            image: imageUrl, 
            description, 
            tax_applicability, 
            tax, 
            tax_type
        })

        await newCategory.save();

        res.status(201).send({
            success:true,
            message: 'New category created',
            data: newCategory
        })
        


    } catch(error){
        console.log('Error creating category');
        res.status(500).send({
            success: false,
            message: 'Error in creating category',
            error: error.message
        })
        
    }
};
// --------------------------------------------------------

// ---------------- GETTING ALL CATEGORIES ----------------
const getAllCategoryController = async(req,res) => {
    try{
        const allCategories = await categories.find();

        res.status(200).send({
            success: true,
            totalCount: allCategories.length,
            data: allCategories
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Couldn't get categories",
            error: error.message
        })
        
    }
};
// ------------------------------------------------------

// ----------------- GETTING CATEGORY BY ID -------------
const getCategoryById= async(req,res) => {
    try{
        // input categoryId to be searched
        const categoryId = req.params.id;

        // if no categoryId provided
        if(!categoryId){
            res.status(400).send({
                success: false,
                message: "Please provide category id"
            })
        }

        // looking for category with id = categoryId 
        const categoryById = await categories.findById(categoryId);
        
        // if no category found with given categoryId
        if(!categoryById){
            res.status(400).send({
                success: false,
                message: "No category found by this id"
            })
        }

        // return the found category
        res.status(201).send({
            success: true,
            message: "Category found by id",
            data: categoryById
        })


    } catch(error){
        console.log('Error in getting category by id');
        res.status(500).send({
            success: false,
            message: 'Error in getting category by id',
            error: error.message
        })
        
    }
};
// -----------------------------------------------------------------

// ----------  GETTING ALL SUBCATEGORIES OF A CATEGORY -------------
const getAllSubcategoriesOfCategoryById= async(req,res) => {
    try{
        // input category id
        const categoryId = req.params.id;

        // if no input
        if(!categoryId){
            res.status(400).send({
                success: false,
                message: "Please provide category id"
            })
        }

        // looking for category with categoryId, populating the subcategories array
        const subcategoriesOfCategoryById = await categories.findById(categoryId).populate('subcategories');
        
        // if not valid categoryId
        if(!subcategoriesOfCategoryById){
            res.status(400).send({
                success: false,
                message: "No category found by this id"
            })
        }

        // success
        res.status(201).send({
            success: true,
            message: "Subcategories found of category by id",
            data: subcategoriesOfCategoryById.subcategories
        })


    } catch(error){
        console.log('Error in getting subcategories of this id');
        res.status(500).send({
            success: false,
            message: 'Error in getting subcategories of this id',
            error: error.message
        })
        
    }
};
// --------------------------------------------------------------------

// --------------- DELETE CATEGORY BY ID ------------------------------
const deleteCategoryById = async(req,res) => {
    try{
        const categoryId = req.params.id;
        
        // no input provided
        if(!categoryId){
            return res.status(400).send({
                success: false,
                message: "Please provide category id"
            })

        }

        // deleting the category
        await categories.findByIdAndDelete(categoryId);
        res.status(201).send({
                success: true,
                message: "Category deleted successfully"
            })


    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting category by id',
            error: error.message
        })
        
    }
};
// ---------------------------------------------------------------

// ----------------- UPDATING CATEGORY ---------------------------
const editCategoryById = async(req,res) => {
    try{
        const categoryId = req.params.id;
        const updates = req.body;
        let imageUrl;
        if(req.file){
            imageUrl= path.join(__dirname, '..', req.file.path);
            imageUrl = imageUrl.replace(/\\/g, '/');
            updates.image = imageUrl;
        }

        const cat = await categories.findByIdAndUpdate(categoryId, updates, { new: true });

        if (!cat) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).send({
        success: true,
        message: "Category updated successfully",
        data: cat
        })


    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating Category by id',
            error: error.message
        })

    }
};
// -----------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------------------------------


module.exports = {createCategoryController, getAllCategoryController, getCategoryById, deleteCategoryById, getAllSubcategoriesOfCategoryById, editCategoryById};