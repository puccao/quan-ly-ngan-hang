require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const socketIo = require('socket.io');

const http = require('http');
const server = http.createServer(app);
const io = socketIo(server);


const session = require('express-session');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 

app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const accountRoutes = require('./routes/account');
const customerRoutes = require('./routes/customer');
const employeeRoutes = require('./routes/employee');
const supplierRoutes = require('./routes/supplierRoutes');
const billRoutes = require('./routes/billRoutes');

const Employee = require('./models/employee');



app.use('/accounts', accountRoutes);
app.use('/customers', customerRoutes);
app.use('/employees', employeeRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/bills', billRoutes);


// Real-time Messaging with socket.io
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     // Listen for new messages from clients
//     socket.on('newMessage', (data) => {
//         console.log(`Message from ${data.senderId} to ${data.recipientId}: ${data.content}`);
//         // Broadcast the message to the specific recipient
//         socket.to(data.recipientId).emit('newMessage', data);
//     });

//     // Handle user disconnection
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });



//////////////////////
// Trang login
app.get('/login', (req, res) => {
    res.render('login/login');
});

// Định nghĩa route cho login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Tìm employee
    const employee = await Employee.findOne({ username, password }); // Tìm employee
    if (employee) {
        req.session.employeeId = employee._id; // Lưu ID vào session
        return res.redirect('/'); // Chuyển hướng đến trang chính
    }
    return res.status(401).send('Tên đăng nhập hoặc mật khẩu không chính xác.');
});

// Middleware để kiểm tra đăng nhập
const checkAuth = (req, res, next) => {
    if (!req.session.employeeId) {
        return res.redirect('/login');
    }
    next();
};

// Đặt route cho các trang cần xác thực
app.use('/employees', checkAuth, require('./routes/employee'));


// Home route
app.get('/', (req, res) => {
    res.render('index');
});

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
