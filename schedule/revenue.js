const cron = require('node-cron');
const httpClient = require('../lib/http-client');
const nodemailer = require('nodemailer');

const fontEndGateway = 'https://ggarden.shop'

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
    to: 'tranthihaiha660@gmail.com', // admin gmail
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
function getPrevMonth(){
    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Đặt ngày hiện tại thành ngày 0 của tháng hiện tại (để truy cập vào tháng trước)
    currentDate.setDate(0);

    // Lấy ngày cuối cùng của tháng trước
    const lastDayOfPreviousMonth = currentDate.getDate();

    // Lấy tháng trước
    const previousMonth = currentDate.getMonth() + 1; // Phải cộng 1 vì getMonth() trả về giá trị từ 0 đến 11

    // Lấy năm hiện tại
    const currentYear = currentDate.getFullYear();

    return `${previousMonth}/${currentYear}`

    // console.log(`Ngày cuối cùng của tháng trước là: `);

    // const currentDate = new Date();
    
    // const dates = currentDate.getDate()
    // const month = currentDate.getMonth()
    // const year = currentDate.getFullYear()

    // let value = new Date()

    // if(dates === 1){
    //     value = new Date(year, month, 0)
    // }else{
    //     value = new Date(year, month, dates - 1)
    // }

    // const formattedDate = value.toLocaleDateString('en-GB', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric'
    // });
    // return formattedDate
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
        // 10h tối mỗi ngày
        // 0 22 * * *
        // */10 * * * * *
        cron.schedule('0 22 * * *', async () => {
            while(true){
                try{
                    const res = await httpClient.get('/revenue/get-revenue-in-date')
                    const { totalRevenue, rentRevenue, saleRevenue, serviceRevenue, serviceComboRevenue } = res.data.revenues
                    const mailOptions = {
                        from: 'gott150899@gmail.com', 
                        to: 'tranthihaiha660@gmail.com', // admin gmail
                    }
                    mailOptions.subject = `Doanh thu theo ngày (${getCurrentDate()})`
                    mailOptions.html = `
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
                    await sendMail(mailOptions)
                    console.log('getRevenueInDate----success')
                    break;
                }catch{

                }
            }
        });
}

function sendMail(gmailOptions){
    return new Promise((res, rej) =>{
        try{
            transporter.sendMail(gmailOptions, function(error, info){
                if (error) {
                    console.log('Gửi email không thành công:', error);
                    rej()
                } else {
                    console.log('Gửi email thành công:', info.response);
                    res()
                }
            });
        }catch{
            rej()
        }
    })
}

function getRevenueInMonth(){
    console.log('getRevenueInMonth', getPrevMonth());
    try{
        // 0h 0p 0s ngày 1 mỗi tháng
        // 0 0 1 * *
        cron.schedule('0 0 1 * *', async () => {
                while(true){
                    try{
                        const res = await httpClient.get('/revenue/get-revenue-in-month')
                        const { totalRevenue, rentRevenue, saleRevenue, serviceRevenue, serviceComboRevenue } = res.data.revenues
                        const mailOptions = {
                            from: 'gott150899@gmail.com', 
                            to: 'tranthihaiha660@gmail.com', // admin gmail
                            // text: 'Hello from Node.js!'
                        }
                        mailOptions.subject = `Doanh thu theo tháng (${getPrevMonth()})`
                        mailOptions.html = `
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
                                    <h3>Báo cáo doanh thu tháng ${getPrevMonth()}</h3>
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
                        await sendMail(mailOptions)
                        console.log('getRevenueInMonth----success')
                        break;
                    }catch{

                    }
                }
            });
    }catch(err){
        console.log('getRevenueInMonth-----', err)
    }
}

function sendMailForTechnician(item){
    return new Promise((res, rej) => {
        try{
            const { technicianMail, listComboCarlendar, listServiceCarlendar, technicianName } = item
            const mailOptions = {
                from: 'gott150899@gmail.com', 
                to: technicianMail, // tech gmail
                subject: `Đơn hàng cần chăm sóc ngày ${getCurrentDate()}`, 
                // text: 'Hello from Node.js!'
            }

            // if(listComboCarlendar.length === 0 && listServiceCarlendar.length === 0){
            //     mailOptions.text = `Không có đơn hàng nào cần chăm sóc ngày hôm nay`
            // }else{
                let msg = `
                <html lang="en">
                <head>
                    <title>Email Technician</title>
                    <style>
                        body {
                            background-color: #ffff;
                        }
                        h1{
                            margin-right: 10px;
                        }
                        .text-start{
                            margin-bottom: 5px;
                        }
                        .name{
                            color: orange;
                            font-size: 20px;
                            text-decoration: underline;
                        }
                        h4{
                            margin-bottom: 5px;
                            text-decoration: underline;
                        }
                        .order{
                            margin-bottom: 5px;
                        }
                        .order_no{
                            display: flex;
                            align-items: center;
                        }
                        .link{
                            padding: 10px;
                            border-radius: 5px;
                            background-color: #0099FF;
                            color: #fff;
                        }
                        .text-center{
                            color: #ffff;
                            margin: 0;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                        }
                        .card {
                            background: #00a76f ;
                        }
            
                        .card-body {
                            border: 3px solid #0db8388c;
                            border-radius: 5px;
                            padding: 30px;
                        }
            
                        .btn-light{
                            color: #02240bd2;
                            margin-top: 25px;
                            margin-bottom: 10px;
                        }
            
                        .order_no{
                            display: flex;
                        }
                        .order_no .left{
                            display: flex;
                            margin-right: 5px;
                        }
            
                        .order .order_no .order_detail{
                            display: flex;
                            padding-left:10px;
                        }
            
                        .header{
                            text-align: center;
                        }
            
                        .hr .solid{
                            border-top: 3px solid #ffff;
                        }
                        .button{
                            text-align: center;
                            margin-top: 50px;
                        }
                        .btn-light{
                            text-decoration: none;
                            color: #fff;
                            border-radius: 5px;
                            background-color: #5cb9d8;
                            padding: 10px 50px;
                            font-size: 24px;
                        }
                        .luu-y{
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="background-image">
                        <div class="text-center card">
                            <div class="card-body">
                                <div class="header">
                                    <h1>Thông báo chăm sóc cây cảnh: </h1>
                                    <h1>${getCurrentDate()}</h1>
                                </div>
                                <div>
                                    <p class="text-start">
                                        Dear 
                                        <span class="name">${technicianName}</span>
                                    </p>
                                    <p class="text-start">Bạn có đơn hàng cần chăm sóc thuộc hệ thống GreenGarden,
                                    vui lòng theo dõi đơn hàng và lên lịch chăm sóc cho đơn hàng này và cập nhật tiến độ chăm sóc.</p>
                                    <h4>Đơn hàng theo yêu cầu:</h4>
                `
                if(listServiceCarlendar.length === 0){
                    msg += '<h3>Không có đơn hàng nào</h3>'
                }else{
                    listServiceCarlendar.forEach(e => {
                        const { serviceOrderId, serviceOrderCode } = e
                        // msg += `Đơn hàng ${serviceOrderCode}. Link: ${fontEndGateway}/panel/take-care-order-assigned/${serviceOrderId} \n`
                        msg += `
                        <div class="order">
                            <div class="order_no">
                                <div class="left">Mã đơn hàng chăm sóc:</div>
                                <div class="right">${serviceOrderCode}</div>
                                <div class="order_detail"> <a href="${fontEndGateway}/panel/take-care-order-assigned/${serviceOrderId}" target="_blank" class="link">Chi tiết đơn hàng</a> </div>
                            </div>
                        </div>
                        `
                    });
                }
                msg += '<hr class="solid">'
                msg += '<h4>Đơn hàng theo gói:</h4>'
                if(listComboCarlendar.length === 0){
                    msg += '<h3>Không có đơn hàng nào</h3>'
                }else{
                    listComboCarlendar.forEach(e => {
                        const { serviceOrderId, serviceOrderCode } = e
                        // msg += `Đơn hàng ${serviceOrderCode}. Link: ${fontEndGateway}/panel/manage-package-order/${serviceOrderId} \n`
                        msg += `
                        <div class="order">
                            <div class="order_no">
                                <div class="left">Mã đơn hàng chăm sóc:</div>
                                <div class="right">${serviceOrderCode}</div>
                                <div class="order_detail"> <a href="${fontEndGateway}/panel/manage-package-order/${serviceOrderId}" target="_blank" class="link">Chi tiết đơn hàng</a> </div>
                            </div>
                        </div>`
                    });
                } 
                msg += `
                <div class="button">
                            <a href="${fontEndGateway}" target="_blank" class="btn btn-light"> Đi đến website</a>
                        </div>        
                        <p class="luu-y">LƯU Ý: Các kỹ thuật viên vui lòng cập nhật ngày chăm sóc và báo cáo đúng tiến độ.</p>           
                    </div>    
                </div>
            </div>
        </div>
    </body>
</html>`
                mailOptions.html = msg
            // }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log('Gửi email không thành công:', error);
                } else {
                    console.log('Gửi email thành công:', info.response);
                }
                res()
            });
        }catch(err){
            console.log(err)
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
            while(true){
                try{
                    const res = await httpClient.get('/service-calendar/get-service-calendars-today-by-technician')
                    console.log('---------------res-----------------', res)
                    const prmAll = []
        
                    res.data.forEach(element => {
                        prmAll.push(sendMailForTechnician(element))
                    });
        
                    await Promise.all(prmAll)
        
                    console.log('send mail tech success');
                    console.log('getServiceCalendars----success')
                    break;
                }catch(err){
                    console.log('err---320', err)
                }
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