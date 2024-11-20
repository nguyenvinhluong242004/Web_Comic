const path = require('path'); // Xử lý đường dẫn tệp
const express = require('express'); // Web framework cho Node.js
const morgan = require('morgan'); // Module ghi log
const expressHandlebars = require('express-handlebars'); // Template engine
const session = require('express-session');
const bodyParser = require('body-parser'); // Xử lý dữ liệu từ các yêu cầu HTTP

// Load biến môi trường từ file .env
require('dotenv').config({ path: './app/config/.env' });

const app = express();
const port = process.env.PORT || 8888; // Sử dụng PORT từ .env hoặc mặc định là 8888

// Middleware log request
app.use(morgan('dev'));

// Middleware session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Middleware để parse dữ liệu JSON
app.use(bodyParser.json());

const route = require('../../routes');



// Cấu hình thư mục tĩnh cho các file CSS, JS, hình ảnh
app.use(express.static(path.join(__dirname, '../../public')));

app.use(morgan('combined')); // Cấu hình ghi log HTTP requests
app.use(express.json()); // Xử lý dữ liệu JSON từ yêu cầu HTTP



// Cấu hình Handlebars làm template engine
const hbs = expressHandlebars.create({
    extname: '.hbs', // Đặt phần mở rộng file là .hbs
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../../resources/views')); // Đặt thư mục views

// Kiểm tra xem .env có được load thành công không
console.log('Environment variables loaded:');
console.log(`PORT: ${process.env.PORT}`);

// Route init
route(app);


// Lắng nghe trên cổng
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
