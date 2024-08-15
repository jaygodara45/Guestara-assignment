// ------------ IMPORTING ALL 3 MODELS ---------------------------------
const categories = require("../models/categories");
const items = require("../models/items");
const subcategories = require("../models/subcategories");
const path = require('path');


// ----------------------------- CONTROLLERS -----------------------------------------------------------------

// ------------- CREATE ITEM -----------------------
const createItemController = async(req,res) => {
    try{
        let {
            name,
            
            description,
            tax_applicability,
            tax,
            baseAmount,
            discount,
            category,
            subcategory
        } = req.body;
        console.log(name);
        console.log(baseAmount);
        
        if(!name || !baseAmount){
            return res.status(400).send({
                success: false,
                message: "Please provide name and baseAmount both"
            })
        }

        if(!category && !subcategory){
            res.status(400).send({
                success: false,
                message: "Please provide either category or subcategory"
            })
        }
        console.log("hello");
        
        let subcategoryByName; 
        let categoryByName;
        
        if(subcategory){
            
            
            subcategoryByName  = await subcategories.find({name: subcategory});
            
            if(subcategoryByName.length==0){
                return res.status(400).send({
                success: false,
                message: "No subcategory of this name found."
                })
            }
            subcategoryByName = subcategoryByName[0];
            categoryByName = await categories.findById(subcategoryByName.category);

        } else if(category){
            categoryByName = await categories.find({name: category});
            if(categoryByName.length===0){
                return res.status(400).send({
                success: false,
                message: "No category of this name found."
                })   
            }
            categoryByName = categoryByName[0];
        }
        let subCategoryId;
        let categoryId;
        if(subcategoryByName){
            subCategoryId = subcategoryByName._id
        }
        if(categoryByName){
            categoryId = categoryByName._id
        }

        let imageUrl;
        if(req.file){
            imageUrl= path.join(__dirname, '..', req.file.path);
            imageUrl = imageUrl.replace(/\\/g, '/');
        }
        const newItem = new items({
            name, 
            image: imageUrl, 
            description, 
            tax_applicability, 
            tax, 
            baseAmount,
            subcategory: subCategoryId,
            category: categoryId
        })
        const createdItem = await newItem.save();
        if(categoryByName) {
            categoryByName.products.push(createdItem._id);
            await categoryByName.save();
        }
        console.log(subcategoryByName);
        
        if(subcategoryByName){
            subcategoryByName.products.push(createdItem._id);
            await subcategoryByName.save();
        }
        return res.status(201).send({
                success: true,
                message: "Successfully created new item",
                data: createdItem
        }); 

    } catch(error){
        console.log('Error creating item');
        res.status(500).send({
            success: false,
            message: 'Error in creating item',
            error: error.message
        })
        
    }
};
// ---------------------------------------------------------------------------



// --------------- GET ALL ITEMS ------------------------------------------
const getAllItemController = async(req,res) => {
    try{
        const allItems = await items.find();

        res.status(200).send({
            success: true,
            totalCount: allItems.length,
            data: allItems
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
// ----------------------------------------------------------

// --------------------- get item by id ----------------------
const getItemById= async(req,res) => {
    try{
        const itemId = req.params.id;
        if(!itemId){
            res.status(400).send({
                success: false,
                message: "Please provide item id"
            })
        }

        // category
        const itemById = await items.findById(itemId);
        
        if(!itemById){
            res.status(400).send({
                success: false,
                message: "No item found by this id"
            })
        }

        return res.status(201).send({
            success: true,
            message: "Item found by id",
            data: itemById
        })


    } catch(error){
        console.log('Error in getting item by id');
        return res.status(500).send({
            success: false,
            message: 'Error in getting item by id',
            error: error.message
        })
        
    }
    


    
};
// ----------------------------------------------------------------

// ----------------- get all items with particular category id------
const getAllItemsOfCategoryById= async(req,res) => {
    try{
        const categoryId = req.params.id;
        if(!categoryId){
            return res.status(400).send({
                success: false,
                message: "Please provide category id"
            })
        }

        // category
        console.log("before populating");
        
        const itemsOfCategoryById = await categories.findById(categoryId).populate('products');
        console.log("after populating");
        
        if(!itemsOfCategoryById){
            return res.status(400).send({
                success: false,
                message: "No category found by this id"
            })
        }

        
        
        
        return res.status(201).send({
            success: true,
            message: "Items found of category by id",
            data: itemsOfCategoryById.products
        })


    } catch(error){
        console.log('Error in getting items of this category');
        res.status(500).send({
            success: false,
            message: 'Error in getting items of this category',
            error: error.message
        })
        
    }
};
// -------------------------------------------------------------------


// ---------- get all items under particular subcategory id ----------------
const getAllItemsOfSubcategoryById= async(req,res) => {
    try{
        const subcategoryId = req.params.id;
        if(!subcategoryId){
            return res.status(400).send({
                success: false,
                message: "Please provide subcategory id"
            })
        }

        // category
        console.log("before populating");
        
        const itemsOfSubcategoryById = await subcategories.findById(subcategoryId).populate('products');
        console.log("after populating");
        
        if(!itemsOfSubcategoryById){
            return res.status(400).send({
                success: false,
                message: "No subcategory found by this id"
            })
        }

        
        
        
        return res.status(201).send({
            success: true,
            message: "Items found of subcategory by id",
            data: itemsOfSubcategoryById.products
        })


    } catch(error){
        console.log('Error in getting items of this subcategory');
        res.status(500).send({
            success: false,
            message: 'Error in getting items of this subcategory',
            error: error.message
        })
        
    }
};
// --------------------------------------------------------------------

// ----------- DELETE ITEM ---------------------------------------------
const deleteItemById = async(req,res) => {
    try{
        const itemId = req.params.id;
        if(!itemId){
            return res.status(400).send({
                success: false,
                message: "Please provide item id"
            })

        }
        const currItem = await items.findById(itemId);

        if(!currItem){
            res.status(400).send({
            success: false,
            message: 'No item found by this id',
            error: error.message
            })
        }
        const categoryId = currItem.category;
        const categoryById = await categories.findById(categoryId);
        console.log(currItem.category);
        
        const subcategoryId = currItem.subcategory;
        const subcategoryById = await subcategories.findById(subcategoryId);
        
        
        const indexOfItemInCategory = categoryById.products.indexOf(itemId); 
        const indexOfItemInSubcategory = await subcategoryById.products.indexOf(itemId);
        
        if(indexOfItemInCategory!=-1){
            await categoryById.products.splice(indexOfItemInCategory, 1);
        }
        if(indexOfItemInSubcategory!=-1){
            await subcategoryById.products.splice(indexOfItemInSubcategory, 1);
        }
        await categoryById.save();
        await subcategoryById.save();
        await items.findByIdAndDelete(itemId);

        res.status(201).send({
                success: true,
                message: "Subcategory deleted successfully"
        })


    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in deleting item by id',
            error: error.message
        })
        
    }
    

};
// ----------------------------------------------------------------

// ---------------------- search by name || GET --------------------
const searchByName = async(req,res) => {
    try{
        const searchName =req.query.name;
        if(!searchName){
            return res.status(400).send({
                success: false,
                message: "Please enter name to be searched."
            })
        }

        const itemsByName = await items.find({
            name: { $regex: searchName, $options: 'i'}
        })

        res.status(201).send({
            success: true,
            message: "Successfully searched items by name",
            data :itemsByName
        })


    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in searching item by name',
            error: error.message
        })

    }
};
// ----------------------------------------------------------------

// -------------------- edit items --------------------------------
const edit = async(req,res) => {
    try{
        const itemId = req.params.id;
        const updates = req.body;
        let imageUrl;
        if(req.file){
            imageUrl= path.join(__dirname, '..', req.file.path);
            imageUrl = imageUrl.replace(/\\/g, '/');
            updates.image = imageUrl;
        }

        const item = await items.findByIdAndUpdate(itemId, updates, { new: true });

        await item.save();

        if (!item) {
            return res.status(404).send({
                success: false,
                message: "Item not found"
            });
        }

            return res.status(200).send({
            success: true,
            message: "Item updated successfully",
            data: item
            })


    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in updating item by id',
            error: error.message
        })

    }
};
// ----------------------------------------------------------

module.exports = {createItemController, getAllItemController, getItemById, deleteItemById, getAllItemsOfCategoryById, getAllItemsOfSubcategoryById,searchByName, edit};