CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'customer')) NOT NULL
);


CREATE TABLE IF NOT EXISTS Images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_path TEXT NOT NULL,
  assigned_to INTEGER, -- Foreign Key to Users.id (Customer)
  assigned_by INTEGER, -- Foreign Key to Users.id (Admin)
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  starting_price REAL NOT NULL,
  FOREIGN KEY (assigned_to) REFERENCES Users (id),
  FOREIGN KEY (assigned_by) REFERENCES Users (id)
);


CREATE TABLE IF NOT EXISTS Bids (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id INTEGER NOT NULL, -- Foreign Key to Images.id
  user_id INTEGER NOT NULL, -- Foreign Key to Users.id
  bid_amount REAL NOT NULL,
  status TEXT CHECK(status IN ('pending', 'approved')) DEFAULT 'pending',
  FOREIGN KEY (image_id) REFERENCES Images (id),
  FOREIGN KEY (user_id) REFERENCES Users (id)
);


CREATE TABLE IF NOT EXISTS Transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bid_id INTEGER NOT NULL, -- Foreign Key to Bids.id
  amount REAL NOT NULL,
  status TEXT CHECK(status IN ('completed')) DEFAULT 'completed',
  FOREIGN KEY (bid_id) REFERENCES Bids (id)
);
