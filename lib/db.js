const sql = require('mssql')
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { getRevenueInDate, getRevenueInMonth, getServiceCalendars } = require('../schedule/revenue');

// mssql config
const config = {
    user: 'greengarden',
    password: 'Muaxuan2023!',
    server: 'greengarden.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'GreenGardenDB',
}

// Cấu hình thông tin email
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Hoặc bạn có thể sử dụng các dịch vụ email khác như Outlook, Yahoo, vv.
    auth: {
      user: 'gott150899@gmail.com', // Địa chỉ email của bạn
      pass: 'g x h l q o w f p o i d o f f q' // Mật khẩu email của bạn
    }
});

// Cấu hình thông tin email
const mailOptions = {
    from: 'gott150899@gmail.com', // Địa chỉ email gửi
    to: 'gottse130528@fpt.edu.vn', // Địa chỉ email người nhận
    subject: 'Test Email', // Tiêu đề email
    text: 'Hello from Node.js!' // Nội dung email dạng plain text
};

function scheduleFunction(){
    try{
        getRevenueInDate()
        getRevenueInMonth()
        getServiceCalendars()
    }catch (error) {
        console.log(error)
    }
}

module.exports = {
    scheduleFunction,
    transporter
}