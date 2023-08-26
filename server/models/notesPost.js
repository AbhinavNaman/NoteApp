//notesPost.js
import mongoose from 'mongoose';

const noteSchema = mongoose.Schema({
    title: String,
    tagline:String,
    about:String,
    pinned:{
        type:Boolean,
        default:false
    }
})

var notesPost = mongoose.model('notesPost', noteSchema);

export default notesPost;

