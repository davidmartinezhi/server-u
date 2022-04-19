const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsletterSchema = Schema({
    //El id es autogenerado por mongoose
    email: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model("Newsletter", NewsletterSchema);