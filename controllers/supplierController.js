const Supplier = require('../models/supplier');
const Customer = require('../models/customer');
const Bill = require('../models/bill'); 

// Danh sách nhà cung cấp
exports.listSuppliers = async (req, res) => {
    const suppliers = await Supplier.find();
    res.render('suppliers/supplierList', { suppliers });
};

// Form thêm nhà cung cấp
exports.addSupplierForm = (req, res) => {
    res.render('suppliers/addSupplier');
};

// Thêm nhà cung cấp
exports.addSupplier = async (req, res) => {
    const { name, serviceType } = req.body;
    await Supplier.create({ name, serviceType });
    res.redirect('/suppliers');
};

// Xóa nhà cung cấp
exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
    await Supplier.findByIdAndDelete(id);
    res.redirect('/suppliers');
};

// Tạo hóa đơn cho khách hàng
exports.createBillForm = async (req, res) => {
    const customers = await Customer.find(); 
    const supplier = await Supplier.findById(req.params.id); 
    res.render('suppliers/createBill', { supplier, customers });
};

exports.createBill = async (req, res) => {
    const { customerId, billAmount } = req.body;
    const supplier = await Supplier.findById(req.params.id); 
    await Bill.create({
        customerId,
        billAmount,
        supplier: supplier._id,
        serviceType: supplier.serviceType,
        status: 'pending'
    });
    res.redirect('/bills');
};
