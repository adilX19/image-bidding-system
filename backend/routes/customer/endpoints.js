const database = require('../../db/connection');
const express = require('express');
const dotenv = require('dotenv');
const verifyToken = require('../../authentications/JWT_middlewares');

dotenv.config();

const router = express.Router();

const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

// assigned images endpoint
router.get('/assigned/images', verifyToken, (request, response) => {
    database.all(`SELECT * FROM Images WHERE assigned_to = ?`, [request.user.id], (err, images) => {
        if (err) {
            console.error("Error fetching assigned images:", err);
            return response.status(500).json({ message: "Failed to fetch images", error: err.message });
        }
        response.status(200).json(images);
    });
});

// assigned image details
router.get('/assigned/images/:image_id', verifyToken, (request, response) => {
    const imageId = request.params.image_id;

    database.get(
        `SELECT * FROM Images WHERE id = ? AND assigned_to = ?`,
        [imageId, request.user.id],
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
});

// list all bids for the current customer
router.get('/bids', verifyToken, (request, response) => {
    database.all(
        `SELECT Bids.*, Images.title AS image_title FROM Bids
         JOIN Images ON Bids.image_id = Images.id
         WHERE Bids.user_id = ?`,
        [request.user.id],
        (err, bids) => {
            if (err) {
                console.error("Error fetching Bids:", err);
                return response.status(500).json({ message: "Failed to fetch bids", error: err.message });
            }
            response.status(200).json(bids);
        }
    );
});

// get a specific bid
router.get('/bids/:bid_id', verifyToken, (request, response) => {
    const { bid_id } = request.params;

    database.get(
        `SELECT Bids.*, Images.title AS image_title FROM Bids
         JOIN Images ON Bids.image_id = Images.id
         WHERE Bids.id = ? AND Bids.user_id = ?`,
        [bid_id, request.user.id],
        (err, bid) => {
            if (err) {
                return response.status(500).json({ message: "Failed to fetch bid", error: err.message });
            }
            if (!bid) {
                return response.status(404).json({ message: "Bid not found." });
            }
            response.status(200).json(bid);
        }
    );
});

// cancel a pending bid
router.delete('/bids/:bid_id', verifyToken, (request, response) => {
    const { bid_id } = request.params;

    database.get(`SELECT * FROM Bids WHERE id = ? AND user_id = ?`, [bid_id, request.user.id], (err, bid) => {
        if (err) {
            return response.status(500).json({ message: "Database error", error: err.message });
        }
        if (!bid) {
            return response.status(404).json({ message: "Bid not found." });
        }
        if (bid.status === 'approved') {
            return response.status(400).json({ message: "Cannot cancel an already approved bid." });
        }

        database.run(`DELETE FROM Bids WHERE id = ?`, [bid_id], (err) => {
            if (err) {
                return response.status(500).json({ message: "Failed to cancel bid", error: err.message });
            }
            response.status(200).json({ message: "Bid cancelled successfully." });
        });
    });
});

// place a bid on an image
router.post('/place/bid', verifyToken, (request, response) => {
    const { image_id, amount } = request.body;

    if (!image_id || !amount) {
        return response.status(400).json({ message: "All fields are required." });
    }

    const bidAmount = parseFloat(amount);

    // verify the image is assigned to this customer
    database.get(`SELECT * FROM Images WHERE id = ? AND assigned_to = ?`, [image_id, request.user.id], (err, image) => {
        if (err) {
            return response.status(500).json({ message: "Database error", error: err.message });
        }
        if (!image) {
            return response.status(403).json({ message: "Image not found or not assigned to you." });
        }

        if (bidAmount < image.starting_price) {
            return response.status(400).json({ message: `Bid amount must be at least the starting price of ${image.starting_price}.` });
        }

        // ensure bid exceeds the current highest bid
        database.get(`SELECT MAX(bid_amount) AS highest_bid FROM Bids WHERE image_id = ?`, [image_id], (err, row) => {
            if (err) {
                return response.status(500).json({ message: "Database error", error: err.message });
            }

            const highestBid = row.highest_bid;
            if (highestBid !== null && bidAmount <= highestBid) {
                return response.status(400).json({ message: `Bid amount must exceed the current highest bid of ${highestBid}.` });
            }

            database.run(
                `INSERT INTO Bids (image_id, user_id, bid_amount) VALUES (?, ?, ?)`,
                [image_id, request.user.id, bidAmount],
                (err) => {
                    if (err) {
                        return response.status(500).json({ message: "Error placing bid", error: err.message });
                    }
                    response.status(201).json({ message: "Bid placed successfully." });
                }
            );
        });
    });
});

// get transaction history for the current customer
router.get('/transactions', verifyToken, (request, response) => {
    database.all(
        `SELECT Transactions.*, Bids.bid_amount, Bids.image_id, Images.title AS image_title
         FROM Transactions
         JOIN Bids ON Transactions.bid_id = Bids.id
         JOIN Images ON Bids.image_id = Images.id
         WHERE Bids.user_id = ?`,
        [request.user.id],
        (err, transactions) => {
            if (err) {
                return response.status(500).json({ message: "Failed to fetch transactions", error: err.message });
            }
            response.status(200).json(transactions);
        }
    );
});

module.exports = router;