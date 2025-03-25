const express = require('express');
const database = require('./db/connection')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const authenticationRoutes = require('./authentications/auth');
const verifyToken = require('./authentications/JWT_middlewares');

const adminRoutes = require('./routes/admin/endpoints')
const customerRoutes = require('./routes/customer/endpoints')

const path = require('path');

dotenv.config();

const corsOptions = {
    origin: ['http://localhost:5173'], // List of allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies and other credentials
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authenticationRoutes);
app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);



// Example route to verify server
app.get('/home', verifyToken, (request, response) => {
    response.json({ message: `Image Management & Bidding System ${request.user.role}!` });
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
