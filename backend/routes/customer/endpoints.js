const database = require('../../db/connection');
const express = require('express');
const dotenv = require('dotenv');
const verifyToken = require('../../authentications/JWT_middlewares');

dotenv.config();

const router = express.Router();

const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

// assigned images endpoint
router.get('/assigned/images', verifyToken, async (request, response) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: 'No token provided' });
    }

    database.all(`SELECT * FROM Images WHERE assigned_to=?`, [request.user.id], async (err, images) => {
        if (err) {
            console.error("Error fetching assigned images:", err);
            return response.status(500).json({ message: "Failed to fetch customers", error: err.message });
        }
        response.status(200).json(images)
    })
})

// assigned image details
router.get('/assigned/images/:image_id', verifyToken, async (request, response) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: 'No token provided' });
    }

    const imageId = request.params.image_id;

    database.get(
        `SELECT * FROM Images WHERE id=? AND assigned_to=?`,
        [imageId, request.user.id], // Validate image_id and ownership
        (err, image) => {
            if (err) {
                console.error("Error fetching image details:", err);
                return response.status(500).json({ message: "Failed to fetch image details", error: err.message });
            }

            if (!image) {
                return response.status(404).json({ message: "Image not found or not assigned to the user" });
            }

            response.status(200).json(image);
        }
    );
})

router.get('/bids', verifyToken, async (request, response) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: 'No token provided' });
    }

    database.all(`SELECT * FROM Bids WHERE user_id=?`, [request.user.id], async (err, bids) => {
        if (err) {
            console.error("Error fetching Bids:", err);
            return response.status(500).json({ message: "Failed to fetch customers", error: err.message });
        }
        response.status(200).json(bids)
    })
})

// place a bid on image
router.post('/place/bid', verifyToken, async (request, response) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: 'No token provided' });
    }

    const { image_id, amount } = request.body;

    console.log(image_id, amount)

    if (!image_id || !amount) {
        return response.status(400).json({ message: "All fields are required." });
    }

    try {
        const query = `INSERT INTO Bids (image_id, user_id, bid_amount) VALUES (?, ?, ?)`;
        await database.run(query, [image_id, request.user.id, parseFloat(amount)]);

        response.status(201).json({
            message: "Bid added successfully.",
        });
    } catch (err) {
        response.status(500).json({ message: "Error uploading image", error: error.message });
    }

});

module.exports = router;