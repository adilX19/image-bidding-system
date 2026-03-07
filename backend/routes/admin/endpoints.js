const database = require('../../db/connection');
const express = require('express');
const dotenv = require('dotenv');
const verifyToken = require('../../authentications/JWT_middlewares');
const upload = require('../../middlewares/uploadMiddleware');
const fs = require('fs');

dotenv.config();

const router = express.Router();

const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

// dashboard endpoint
router.get('/dashboard', verifyToken, async (request, response) => {
    response.status(200).json({ user: request.user });
});

// fetch available customers
router.get('/customers/list', verifyToken, async (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    database.all(`SELECT id, username, email, role FROM Users WHERE role = ?`, ['customer'], (err, rows) => {
        if (err) {
            console.error("Error fetching customers:", err);
            return response.status(500).json({ message: "Failed to fetch customers", error: err.message });
        }
        response.status(200).json(rows);
    });
});

// get a specific customer
router.get('/customers/:customer_id', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    const { customer_id } = request.params;

    database.get(`SELECT id, username, email, role FROM Users WHERE id = ? AND role = ?`, [customer_id, 'customer'], (err, customer) => {
        if (err) {
            return response.status(500).json({ message: "Failed to fetch customer", error: err.message });
        }
        if (!customer) {
            return response.status(404).json({ message: "Customer not found." });
        }
        response.status(200).json(customer);
    });
});

// delete a customer
router.delete('/customers/:customer_id', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    const { customer_id } = request.params;

    database.get(`SELECT id FROM Users WHERE id = ? AND role = ?`, [customer_id, 'customer'], (err, customer) => {
        if (err) {
            return response.status(500).json({ message: "Database error", error: err.message });
        }
        if (!customer) {
            return response.status(404).json({ message: "Customer not found." });
        }

        database.run(`DELETE FROM Users WHERE id = ?`, [customer_id], (err) => {
            if (err) {
                return response.status(500).json({ message: "Failed to delete customer", error: err.message });
            }
            response.status(200).json({ message: "Customer deleted successfully." });
        });
    });
});

// image upload endpoint
router.post('/upload/image', upload.single("image"), verifyToken, async (request, response) => {
    try {
        const { title, description, starting_price, assigned_to } = request.body;
        const assigned_by = request.user.id;

        if (!request.file || !title || !description || !starting_price || !assigned_to) {
            return response.status(400).json({ message: "All fields are required." });
        }

        const filePath = request.file.path;

        const query = `INSERT INTO Images (image_path, assigned_to, assigned_by, title, description, starting_price) VALUES (?, ?, ?, ?, ?, ?)`;
        await database.run(query, [filePath, assigned_to, assigned_by, title, description, parseFloat(starting_price)]);

        response.status(201).json({ message: "Image uploaded successfully", filePath });
    } catch (error) {
        response.status(500).json({ message: "Error uploading image", error: error.message });
    }
});

// list all images
router.get('/images', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    database.all(`SELECT * FROM Images`, [], (err, images) => {
        if (err) {
            return response.status(500).json({ message: "Failed to fetch images", error: err.message });
        }
        response.status(200).json(images);
    });
});

// get a specific image
router.get('/images/:image_id', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    const { image_id } = request.params;

    database.get(`SELECT * FROM Images WHERE id = ?`, [image_id], (err, image) => {
        if (err) {
            return response.status(500).json({ message: "Failed to fetch image", error: err.message });
        }
        if (!image) {
            return response.status(404).json({ message: "Image not found." });
        }
        response.status(200).json(image);
    });
});

// update image metadata
router.put('/images/:image_id', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    const { image_id } = request.params;
    const { title, description, starting_price, assigned_to } = request.body;

    if (!title || !description || !starting_price || !assigned_to) {
        return response.status(400).json({ message: "All fields are required." });
    }

    database.get(`SELECT id FROM Images WHERE id = ?`, [image_id], (err, image) => {
        if (err) {
            return response.status(500).json({ message: "Database error", error: err.message });
        }
        if (!image) {
            return response.status(404).json({ message: "Image not found." });
        }

        database.run(
            `UPDATE Images SET title = ?, description = ?, starting_price = ?, assigned_to = ? WHERE id = ?`,
            [title, description, parseFloat(starting_price), assigned_to, image_id],
            (err) => {
                if (err) {
                    return response.status(500).json({ message: "Failed to update image", error: err.message });
                }
                response.status(200).json({ message: "Image updated successfully." });
            }
        );
    });
});

// delete an image
router.delete('/images/:image_id', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    const { image_id } = request.params;

    database.get(`SELECT * FROM Images WHERE id = ?`, [image_id], (err, image) => {
        if (err) {
            return response.status(500).json({ message: "Database error", error: err.message });
        }
        if (!image) {
            return response.status(404).json({ message: "Image not found." });
        }

        database.run(`DELETE FROM Images WHERE id = ?`, [image_id], (err) => {
            if (err) {
                return response.status(500).json({ message: "Failed to delete image", error: err.message });
            }

            // remove file from disk
            fs.unlink(image.image_path, (fsErr) => {
                if (fsErr) {
                    console.error("File deletion failed:", fsErr.message);
                }
            });

            response.status(200).json({ message: "Image deleted successfully." });
        });
    });
});

// list all bids
router.get('/bids', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    database.all(
        `SELECT Bids.*, Images.title AS image_title, Users.username AS bidder
         FROM Bids
         JOIN Images ON Bids.image_id = Images.id
         JOIN Users ON Bids.user_id = Users.id`,
        [],
        (err, bids) => {
            if (err) {
                return response.status(500).json({ message: "Failed to fetch bids", error: err.message });
            }
            response.status(200).json(bids);
        }
    );
});

// get a specific bid
router.get('/bids/:bid_id', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    const { bid_id } = request.params;

    database.get(
        `SELECT Bids.*, Images.title AS image_title, Users.username AS bidder
         FROM Bids
         JOIN Images ON Bids.image_id = Images.id
         JOIN Users ON Bids.user_id = Users.id
         WHERE Bids.id = ?`,
        [bid_id],
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

// approve a bid and create a transaction
router.put('/bids/:bid_id/approve', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    const { bid_id } = request.params;

    database.get(`SELECT * FROM Bids WHERE id = ?`, [bid_id], (err, bid) => {
        if (err) {
            return response.status(500).json({ message: "Database error", error: err.message });
        }
        if (!bid) {
            return response.status(404).json({ message: "Bid not found." });
        }
        if (bid.status === 'approved') {
            return response.status(400).json({ message: "Bid is already approved." });
        }

        database.run(`UPDATE Bids SET status = 'approved' WHERE id = ?`, [bid_id], (err) => {
            if (err) {
                return response.status(500).json({ message: "Failed to approve bid", error: err.message });
            }

            database.run(
                `INSERT INTO Transactions (bid_id, amount) VALUES (?, ?)`,
                [bid_id, bid.bid_amount],
                (err) => {
                    if (err) {
                        return response.status(500).json({ message: "Bid approved but failed to create transaction", error: err.message });
                    }
                    response.status(200).json({ message: "Bid approved and transaction created successfully." });
                }
            );
        });
    });
});

// list all transactions
router.get('/transactions', verifyToken, (request, response) => {
    if (request.user.role !== 'admin') {
        return response.status(403).json({ message: "Unauthorized to access." });
    }

    database.all(
        `SELECT Transactions.*, Bids.bid_amount, Bids.image_id, Users.username AS bidder
         FROM Transactions
         JOIN Bids ON Transactions.bid_id = Bids.id
         JOIN Users ON Bids.user_id = Users.id`,
        [],
        (err, transactions) => {
            if (err) {
                return response.status(500).json({ message: "Failed to fetch transactions", error: err.message });
            }
            response.status(200).json(transactions);
        }
    );
});

module.exports = router;