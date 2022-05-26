
const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/MyNoteBookDB" // URI TO DATABASE
const connectToMongo = () => {
    mongoose.connect(mongoURI).then(()=>{
        console.log(`successfully connected`);
        }).catch((e)=>{
        console.log(`not connected` + '' + e);
        });
}
module.exports = connectToMongo;