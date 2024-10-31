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

    console.log(req.body); 

    try {
        
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).send('Email đã tồn tại. Vui lòng sử dụng email khác.');
        }

        
        const newEmployee = await Employee.create({ name, position, email, username, password });
        res.redirect('/employees');
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi thêm nhân viên. Vui lòng kiểm tra lại.');
    }
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
