/* The schema defines an author as having String SchemaTypes for the first and family names 
(required, with a maximum of 100 characters), and Date fields for the dates of birth and death. */

// 這裡引入了Mongoose庫，並創建一個Schema物件的參照。
const mongoose = require("mongoose");
const { DateTime } = require("luxon")

const Schema = mongoose.Schema;

//定義Schema物件
const AuthorSchema = new Schema({
    first_name:{ type : String, required : true , maxLength : 100},
    family_name:{ type: String, required : true , maxLength : 100},
    date_of_birth : { type : Date },
    date_of_death : { type : Date },
});

// Virtual for author's full name  虛擬屬性 - 全名:
AuthorSchema.virtual("name").get(function(){
    // To avoid errors in cases where an author does not have either a family name or a first name
    // We want to make sure we handle the exeception by returning an empty string for that case 
    let fullname = "";
    if(this.first_name && this.family_name) {
        fullname = `${this.family_name},${this.first_name}`
    }

    return fullname;
});

// Virtual for author's URL  虛擬屬性 - URL:
AuthorSchema.virtual("url").get(function(){
    // We don't use an arrow function as we'll need the this object
    return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function(){
    return this.date_of_birth ? 
    DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
})

AuthorSchema.virtual("date_of_death_formatted").get(function(){
    return this.date_of_death ? 
    DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
})

AuthorSchema.virtual("lifespan").get(function(){
    let lifespanString = "";

    if(this.date_of_birth){
        lifespanString = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    }

    lifespanString += ' - ';

    if(this.date_of_death) {
        lifespanString += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
    }

    return lifespanString;
})
// Export model 
module.exports = mongoose.model("Author",AuthorSchema);