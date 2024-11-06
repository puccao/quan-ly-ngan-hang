// Kết nối socket một lần duy nhất
const socket = io();

// Kiểm tra kết nối với server
socket.on('connect', () => {
    console.log('Connected to server');
});

// Nhận tin nhắn từ server (chỉ một lần duy nhất)
socket.on('receiveMessage', (data) => {
    console.log('New message received:', data);
    const chatBox = document.getElementById('chatBox');

    if (chatBox) {
        const newMessage = document.createElement('p');
        newMessage.textContent = `${data.senderId}: ${data.message}`;
        chatBox.appendChild(newMessage);
    } else {
        console.error('chatBox element not found');
    }
});

// Gửi tin nhắn đến server khi bấm nút
document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message !== '') {
        const senderId = document.getElementById('senderId').value;
        const receiverId = document.getElementById('receiverId').value;

        // Gửi dữ liệu tin nhắn qua Socket.io
        socket.emit('sendMessage', { senderId, receiverId, message });
        messageInput.value = ''; // Xóa nội dung ô nhập
    }
});
