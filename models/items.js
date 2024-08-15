 const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema( {
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
    baseAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    total_amount:{
        type: Number,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    }
    

 },{timestamps: true});

// saving the total amount after making the required calculation everytime update happens
itemSchema.pre('save', function (next) {
    this.total_amount = this.baseAmount - this.discount;
    next();
});

 module.exports = mongoose.model("Item", itemSchema);