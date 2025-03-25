const database = require('../../db/connection');
const express = require('express');
const dotenv = require('dotenv');
const verifyToken = require('../../authentications/JWT_middlewares');
const upload = require('../../middlewares/uploadMiddleware');

dotenv.config();

const router = express.Router();

const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

// dashboard endpoint
router.get('/dashboard', verifyToken, async (request, response) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: 'No token provided' });
    }

    response.status(200).json({
        user: request.user
    })

})

// fetch available customers
router.get('/customers/list', verifyToken, async (request, response) => {

    if (request.user.role !== 'admin') {
        return response.status(403).json({message: "Unauthorized to access."})
    }

    database.all(`SELECT * FROM Users WHERE role = ?`, ['customer'], async (err, rows) => {
        if (err) {
            console.error("Error fetching customers:", err);
            return response.status(500).json({ message: "Failed to fetch customers", error: err.message });
        }
        response.status(200).json(rows);
    })
})

// image upload endpoint
router.post('/upload/image', upload.single("image"), verifyToken, async (request, response) => {
    try {

        const { title, description, starting_price, assigned_to } = request.body;
        const assigned_by = request.user.id;

        if (!request.file || !title || !description || !starting_price || !assigned_to) {
            return response.status(400).json({ message: "All fields are required." });
        }

        const filePath = request.file.path;

        // storing in database...
        const query = `INSERT INTO Images (image_path, assigned_to, assigned_by, title, description, starting_price) VALUES (?, ?, ?, ?, ?, ?)`;

        await database.run(query, [
            filePath, assigned_to, assigned_by, title, description, parseFloat(starting_price)
        ]);

        response.status(201).json({
            message: "Image uploaded successfully",
            filePath,
        });
    } catch (error) {
        response.status(500).json({ message: "Error uploading image", error: error.message });
    }
});


// bid management endpoint


// customer management endpoint

module.exports = router;