 const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [true, 'Category name is required.']
    },
    image: {
        type: String,
        default: "https://icons.veryicon.com/png/o/commerce-shopping/icon-of-lvshan-valley-mobile-terminal/home-category.png"
    },
    description: {
        type: String
    },
    tax_applicability:{
        type: Boolean,
        default: false
    },
    tax: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }]

 },{timestamps: true});

 module.exports = mongoose.model("Subcategory", subCategorySchema);