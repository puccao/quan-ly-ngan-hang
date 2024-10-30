const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, // Username phải duy nhất
    },
    password: {
        type: String,
        required: true,
    },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
