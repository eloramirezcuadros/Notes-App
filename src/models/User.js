const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});
//Encrypt password
UserSchema.methods.encryptPassword = async(password) => {
    const toEncrypt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, toEncrypt);
    return hash;
};
//Compare passwords
UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
