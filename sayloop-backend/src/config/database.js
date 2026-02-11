const mongoose = require('mongoose');

function callToDB() {
    return mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error(err);
        });
}

module.exports = callToDB;