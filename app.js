require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');
const app = express();
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sessionMiddleware = require('socket.io-express-session');

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);


const session = require('express-session');

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(cors());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Đặt true nếu sử dụng HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // Cookie sống 24 giờ
    }
}));


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60 // Thời gian sống của session (24 giờ)
    }),
    cookie: { secure: false, httpOnly: true }
}));

// Socket.io: xử lý sự kiện khi có người dùng kết nối
io.use(sessionMiddleware(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Khi người dùng gia nhập phòng chat
    socket.on('joinRoom', (chatId) => {
        socket.join(chatId);  // Gia nhập phòng với chatId duy nhất
        console.log(`User ${socket.id} joined room: ${chatId}`);
    });

    // Khi người dùng gửi tin nhắn
    socket.on('sendMessage', (data) => {
        console.log('Received message:', data);
        // Kiểm tra chatId trước khi gửi tin nhắn tới phòng chat
        socket.to(data.chatId).emit('receiveMessage', {
            message: data.message,
            chatId: data.chatId,
            username: data.username
        });
        // Gửi tin nhắn đến tất cả những người trong phòng chat với chatId đó

    });

    // Khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });

});




// Routes
const accountRoutes = require('./routes/account');
const customerRoutes = require('./routes/customer');
const employeeRoutes = require('./routes/employee');
const supplierRoutes = require('./routes/supplierRoutes');
const billRoutes = require('./routes/billRoutes');
const Message = require('./models/message');
const chatRoutes = require('./routes/chatRoutes');
const loginRouter = require('./routes/login');
const indexRouter = require('./routes/index');
const blogRouter = require('./routes/blogRouter');
const Employee = require('./models/employee');



app.use('/accounts', accountRoutes);
app.use('/customers', customerRoutes);
app.use('/employees', employeeRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/bills', billRoutes);
app.use('/chat', chatRoutes);
app.use('/blog', blogRouter);


//////////////////////
// Trang login
app.get('/login', (req, res) => {
    res.render('login/login');
});

// Định nghĩa route cho login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm nhân viên theo tên đăng nhập
        const employee = await Employee.findOne({ username });
        if (!employee) {
            return res.status(401).send('Tên đăng nhập hoặc mật khẩu không chính xác.');
        }

        // So sánh mật khẩu nhập vào với mật khẩu trong cơ sở dữ liệu
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).send('Tên đăng nhập hoặc mật khẩu không chính xác.');
        }

        // Lưu thông tin vào session nếu đăng nhập thành công
        req.session.employeeId = employee._id;
        res.redirect('/'); // Chuyển hướng đến trang chủ
    } catch (err) {
        console.error('Lỗi trong quá trình đăng nhập:', err);
        res.status(500).send('Đã xảy ra lỗi trên server.');
    }
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
app.get('/', async (req, res) => {
    const employeeId = req.session.employeeId;
    if (!employeeId) {
        return res.redirect('/login');
    }

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).send('Nhân viên không tồn tại');
        }
        res.render('index', { employee });
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi truy xuất thông tin nhân viên');
    }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
