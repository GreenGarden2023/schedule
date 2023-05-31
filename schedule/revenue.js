const cron = require('node-cron');
const httpClient = require('../lib/http-client');
const nodemailer = require('nodemailer');

// Cấu hình thông tin email
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Hoặc bạn có thể sử dụng các dịch vụ email khác như Outlook, Yahoo, vv.
    auth: {
      user: 'gott150899@gmail.com', // Địa chỉ email của bạn
      pass: 'g x h l q o w f p o i d o f f q' // Mật khẩu email của bạn
    }
});

const adminGmailOptions = {
    from: 'gott150899@gmail.com', 
    to: 'gottse130528@fpt.edu.vn', // admin gmail
    subject: 'Test Email', 
    // text: 'Hello from Node.js!'
}

function getCurrentDate(){
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    return formattedDate
}

function getMonthYear(){
    const currentDate = new Date();

    const options = {
        year: 'numeric',
        month: '2-digit'
    };

    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    return formattedDate
}

function currencyFormat(number){
    const formattedCurrency = number.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    });
    return formattedCurrency
}

function getRevenueInDate(){
    console.log('getRevenueInDate');
    try{
        // 10h tối mỗi ngày
        // 0 22 * * *
        // */10 * * * * *
        cron.schedule('0 22 * * *', async () => {
            const res = await httpClient.get('/revenue/get-revenue-in-date')
            const { totalRevenue, rentRevenue, saleRevenue, serviceRevenue, serviceComboRevenue } = res.data.revenues

            adminGmailOptions.html = `
            <html>
                <head>
                    <style>
                        p{
                            margin: 0;
                        }
                        h3{
                            color: #00a76f;
                            font-size: 24px;
                        }
                        .container{
                            text-align: center;
                        }
                        .item{
                            border-radius: 5px;
                            color: #fff;
                            padding: 5px 0;
                            margin-top: 10px;
                        }
                        .title{
                            font-size: 22px;
                        }
                        .price{
                            font-size: 28px;
                        }
                        .green{
                            background-color: #00a76f;
                        }
                        .blue{
                            background-color: #0099FF;
                        }
                        .orange{
                            background-color: #f95441;
                        }
                        .light-blue{
                            background-color: #5cb9d8;
                        }
                        .soft{
                            background-color: #707070;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h3>Báo cáo doanh thu ngày ${getCurrentDate()}</h3>
                        <div class="content">
                            <div class="item green">
                                <p class="title">Doanh thu thuê</p>
                                <p class="price">${currencyFormat(rentRevenue)}</p>
                            </div>
                            <div class="item blue">
                                <p class="title">Doanh thu bán</p>
                                <p class="price">${currencyFormat(saleRevenue)}</p>
                            </div>
                            <div class="item light-blue">
                                <p class="title">Doanh thu dv chăm sóc tự chọn</p>
                                <p class="price">${currencyFormat(serviceRevenue)}</p>
                            </div>
                            <div class="item soft">
                                <p class="title">Doanh thu dv chăm sóc theo gói</p>
                                <p class="price">${currencyFormat(serviceComboRevenue)}</p>
                            </div>
                            <div class="item orange">
                                <p class="title">Tổng doanh thu</p>
                                <p class="price">${currencyFormat(totalRevenue)}</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `
            transporter.sendMail(adminGmailOptions, function(error, info){
                if (error) {
                console.log('Gửi email không thành công:', error);
                } else {
                console.log('Gửi email thành công:', info.response);
                }
            });
            console.log('running a task every 5 seconds');
        });
    }catch(err){
        console.log('getRevenueInDate-----', err)
    }
}

function getRevenueInMonth(){
    console.log('getRevenueInMonth');
    try{
        // 11h tối cuối tháng
        // 30 23 28-31 * *
        // */15 * * * * *
        cron.schedule('30 23 28-31 * *', async () => {
            const res = await httpClient.get('/revenue/get-revenue-in-month')
            const { totalRevenue, rentRevenue, saleRevenue, serviceRevenue, serviceComboRevenue } = res.data.revenues

            adminGmailOptions.html = `
            <html>
                <head>
                    <style>
                        p{
                            margin: 0;
                        }
                        h3{
                            color: #00a76f;
                            font-size: 24px;
                        }
                        .container{
                            text-align: center;
                        }
                        .item{
                            border-radius: 5px;
                            color: #fff;
                            padding: 5px 0;
                            margin-top: 10px;
                        }
                        .title{
                            font-size: 22px;
                            color: #fff;
                        }
                        .price{
                            font-size: 28px;
                            color: #fff;
                        }
                        .green{
                            background-color: #00a76f;
                        }
                        .blue{
                            background-color: #0099FF;
                        }
                        .orange{
                            background-color: #f95441;
                        }
                        .light-blue{
                            background-color: #5cb9d8;
                        }
                        .soft{
                            background-color: #707070;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h3>Báo cáo doanh thu tháng ${getMonthYear()}</h3>
                        <div class="content">
                            <div class="item green">
                                <p class="title">Doanh thu thuê</p>
                                <p class="price">${currencyFormat(rentRevenue)}</p>
                            </div>
                            <div class="item blue">
                                <p class="title">Doanh thu bán</p>
                                <p class="price">${currencyFormat(saleRevenue)}</p>
                            </div>
                            <div class="item light-blue">
                                <p class="title">Doanh thu dv chăm sóc tự chọn</p>
                                <p class="price">${currencyFormat(serviceRevenue)}</p>
                            </div>
                            <div class="item soft">
                                <p class="title">Doanh thu dv chăm sóc theo gói</p>
                                <p class="price">${currencyFormat(serviceComboRevenue)}</p>
                            </div>
                            <div class="item orange">
                                <p class="title">Tổng doanh thu</p>
                                <p class="price">${currencyFormat(totalRevenue)}</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `
            transporter.sendMail(adminGmailOptions, function(error, info){
                if (error) {
                console.log('Gửi email không thành công:', error);
                } else {
                console.log('Gửi email thành công:', info.response);
                }
            });
            console.log('running a task every 5 seconds');
        });
    }catch{
        console.log('getRevenueInMonth-----', err)
    }
}

function sendMailForTechnician(item){
    return new Promise((res, rej) => {
        try{
            const { technicianMail, listComboCarlendar, listServiceCarlendar } = item
            const mailOptions = {
                from: 'gott150899@gmail.com', 
                to: technicianMail, // admin gmail
                subject: `Đơn hàng cần chăm sóc ngày ${getCurrentDate()}`, 
                // text: 'Hello from Node.js!'
            }

            const fontEndGateway = 'https://ggarden.shop'

            if(listComboCarlendar.length === 0 && listServiceCarlendar.length === 0){
                mailOptions.text = `Không có đơn hàng nào cần chăm sóc ngày hôm nay`
                
            }else{
                let msg = 'Đơn hàng chăm sóc tự chọn\n-----------------------------\n'
                if(listServiceCarlendar.length === 0){
                    msg += 'Không có đơn hàng nào\n'
                }else{
                    listServiceCarlendar.forEach(e => {
                        const { serviceOrderId, serviceOrderCode } = e
                        msg += `Đơn hàng ${serviceOrderCode}. Link: ${fontEndGateway}/panel/take-care-order-assigned/${serviceOrderId} \n`
                    });
                }
                msg += '\n-----------------------------\n'
                msg += 'Đơn hàng chăm sóc theo gói\n-----------------------------\n'
                if(listComboCarlendar.length === 0){
                    msg += 'Không có đơn hàng nào\n'
                }else{
                    listComboCarlendar.forEach(e => {
                        const { serviceOrderId, serviceOrderCode } = e
                        msg += `Đơn hàng ${serviceOrderCode}. Link: ${fontEndGateway}/panel/manage-package-order/${serviceOrderId} \n`
                    });
                }
                mailOptions.text = msg
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log('Gửi email không thành công:', error);
                } else {
                    console.log('Gửi email thành công:', info.response);
                }
            });
            res()
        }catch(err){
            rej(err)
        }
    })
}

function getServiceCalendars(){
    console.log('getServiceCalendars');
    try{
        // 8h sáng mỗi ngày
        // 0 8 * * *
        // 0p mỗi giờ
        // 0 * * * *
        cron.schedule('0 8 * * *', async () => {
            try{
                const res = await httpClient.get('/service-calendar/get-service-calendars-today-by-technician')
                console.log('---------------res-----------------', res)
                const prmAll = []
    
                res.data.forEach(element => {
                    prmAll.push(sendMailForTechnician(element))
                });
    
                await Promise.all(prmAll)
    
                console.log('send mail tech success');
            }catch(err){
                console.log('err---320', err)
            }
        });
    }catch{
        console.log('getRevenueInMonth-----', err)
    }
}

module.exports = {
    getRevenueInDate,
    getRevenueInMonth,
    getServiceCalendars
}