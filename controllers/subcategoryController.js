// ----------- IMPORTING SUBCATEGORIES AND CATEGORIES MODEL --------------
const subcategories = require("../models/subcategories");
const categories = require("../models/categories");
const path = require('path');

// --------------------------------------- CONTROLLERS ---------------------------------------------

// ------------ CREATE SUBCATEGORY ---------------------
const createSubcategoryController = async(req,res) => {
    try{
        let {
            name,
            description,
            tax_applicability,
            tax,
            category_name
        } = req.body;
        
        if(!name || !category_name){
            return res.status(500).send({
                success:false,
                message: 'Please provide both: name of subcategory and name of category',
                error
            })
        }

        const categoryByName = await categories.find({name: category_name});
        
        
        
        if(categoryByName.length===0){
            
            
            return res.status(404).send({
                success:false,
                message: `No category with this name found.`,
                
            });
        }
        
        
        // setting up url for image
        let imageUrl;
        if(req.file){
            imageUrl= path.join(__dirname, '..', req.file.path);
            imageUrl = imageUrl.replace(/\\/g, '/');
        }
        
        
        const parentCategory = categoryByName[0];

        if(!tax_applicability){
            tax_applicability = parentCategory.tax_applicability;
        }
        if(!tax){
            tax = parentCategory.tax;
        }

        const category_id = parentCategory._id;

        const newSubcategory = new subcategories({
            name, 
            image: imageUrl, 
            description, 
            tax_applicability, 
            tax, 
            category: category_id
        })

        const latest_subcategory = await newSubcategory.save();

        parentCategory.subcategories.push(latest_subcategory._id);
        await parentCategory.save();
       
        
        
        return res.status(201).send({
            success:true,
            message: 'new subcategory created',
            data: newSubcategory
        })
        
        

        
        


    } catch(error){
        console.log('Error creating category');
        res.status(500).send({
            success: false,
            message: 'Error in creating subcategory',
            error: error.message
        })
        
    }
}

// ------------ GET ALL  SUBCATEGORIES ---------------------
const getAllSubcategoryController = async(req,res) => {
    try{
        const allSubcategories = await subcategories.find();

        res.status(200).send({
            success: true,
            totalCount: allSubcategories.length,
            data: allSubcategories
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Couldn't get subcategories",
            error: error.message
        })
        
    }
};

// ------------ GET SUBCATEGORY BY ID ---------------------
const getSubcategoryById= async(req,res) => {
    try{
        const subcategoryId = req.params.id;
        if(!subcategoryId){
            res.status(400).send({
                success: false,
                message: "Please provide subcategory id"
            })
        }

        // category
        const subcategoryById = await subcategories.findById(subcategoryId);
        
        if(!subcategoryById){
            res.status(400).send({
                success: false,
                message: "No subcategory found by this id"
            })
        }

        res.status(201).send({
            success: true,
            message: "Subcategory found by id",
            data: subcategoryById
        })


    } catch(error){
        console.log('Error in getting subcategory by id');
        res.status(500).send({
            success: false,
            message: 'Error in getting subcategory by id',
            error: error.message
        })
        
    }
};

// ------------ DELETE SUBCATEGORY BY ID ---------------------
const deleteSubcategoryById = async(req,res) => {
    try{
        const subcategoryId = req.params.id;
        if(!subcategoryId){
            return res.status(400).send({
                success: false,
                message: "Please provide category id"
            })

        }

        await subcategories.findByIdAndDelete(subcategoryId);
        res.status(201).send({
                success: true,
                message: "Subcategory deleted successfully"
            })


    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting subcategory by id',
            error: error.message
        })
        
    }
};

// ------------ EDIT SUBCATEGORY BY ID---------------------
const editSubcategoryById = async(req,res) => {
    try{
        const subcategoryId = req.params.id;
        const updates = req.body;
        let imageUrl;
        if(req.file){
            imageUrl= path.join(__dirname, '..', req.file.path);
            imageUrl = imageUrl.replace(/\\/g, '/');
            updates.image = imageUrl;
        }

        const subcat = await subcategories.findByIdAndUpdate(subcategoryId, updates, { new: true });

        if (!subcat) {
            return res.status(404).send({
                success: false,
                message: "Subcategory not found"
            });
        }

            return res.status(200).send({
            success: true,
            message: "Subcategory updated successfully",
            data: subcat
            })


    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating subcategory by id',
            error: error.message
        })

    }
};


// ---------------------------------------------------------------------------------------------------------

module.exports = {createSubcategoryController, getAllSubcategoryController, getSubcategoryById, deleteSubcategoryById, editSubcategoryById};