const Employee = require('../models/employee');

exports.listEmployees = async (req, res) => {
    const employees = await Employee.find();
    res.render('employees/employeeList', { employees });
};

exports.addEmployeeForm = (req, res) => {
    res.render('employees/addEmployee');
};

exports.addEmployee = async (req, res) => {
    const { name, position, email, username, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
        return res.status(400).send('Email đã tồn tại. Vui lòng sử dụng email khác.');
    }

    // Thêm nhân viên mới
    await Employee.create({ name, position, email, username, password });
    res.redirect('/employees');
};

exports.editEmployeeForm = async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    res.render('employees/editEmployee', { employee });
};

exports.editEmployee = async (req, res) => {
    await Employee.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/employees');
};

exports.deleteEmployee = async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
};
