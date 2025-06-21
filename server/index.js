
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./shipments.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Shipments table
  db.run(`CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_number TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    item_description TEXT NOT NULL,
    status TEXT DEFAULT 'purchased',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Admin users (default admin)
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // Insert default admin (username: admin, password: admin123)
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)`, ['admin', adminPassword]);
});

// Email configuration (update with your email settings)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: 'snf1117@gmail.com', // Change this
    pass: 'edwg ekeh qwte crgh' // Change this to your app password
  }
});

// API Routes

// User registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
      if (err) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Send welcome email
      const mailOptions = {
        from: 'snf1117@gmail.com',
        to: email,
        subject: 'ברוכים הבאים למערכת מעקב המשלוחים',
        html: `
          <div dir="rtl">
            <h2>ברוכים הבאים!</h2>
            <p>חשבונכם נוצר בהצלחה במערכת מעקב המשלוחים.</p>
            <p>כתובת המייל שלכם: ${email}</p>
            <p>תוכלו כעת להתחבר ולעקוב אחר המשלוחים שלכם.</p>
          </div>
        `
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Email error:', error);
        }
      });
      
      res.json({ message: 'User registered successfully', id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM admins WHERE username = ?', [username], async (err, admin) => {
    if (err || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ message: 'Admin login successful' });
  });
});

// Create shipment
app.post('/api/shipments', (req, res) => {
  const { customerEmail, itemDescription } = req.body;
  const trackingNumber = 'TR' + Math.random().toString(36).substr(2, 8).toUpperCase();
  
  db.run('INSERT INTO shipments (tracking_number, customer_email, item_description) VALUES (?, ?, ?)', 
    [trackingNumber, customerEmail, itemDescription], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create shipment' });
    }
    
    // Send shipment created email
    const mailOptions = {
      from: 'snf1117@gmail.com',
      to: customerEmail,
      subject: 'משלוח חדש נוצר - מספר מעקב: ' + trackingNumber,
      html: `
        <div dir="rtl">
          <h2>משלוח חדש נוצר!</h2>
          <p><strong>מספר מעקב:</strong> ${trackingNumber}</p>
          <p><strong>תיאור הפריט:</strong> ${itemDescription}</p>
          <p><strong>סטטוס נוכחי:</strong> נרכש</p>
          <p>תוכלו לעקוב אחר המשלוח באתר שלנו.</p>
        </div>
      `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Email error:', error);
      }
    });
    
    res.json({ 
      message: 'Shipment created successfully', 
      trackingNumber,
      id: this.lastID 
    });
  });
});

// Get shipments by email
app.get('/api/shipments/:email', (req, res) => {
  const email = req.params.email;
  
  db.all('SELECT * FROM shipments WHERE customer_email = ? ORDER BY created_at DESC', [email], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch shipments' });
    }
    res.json(rows);
  });
});

// Get all shipments (admin)
app.get('/api/admin/shipments', (req, res) => {
  const { email } = req.query;
  
  let query = 'SELECT * FROM shipments ORDER BY created_at DESC';
  let params = [];
  
  if (email) {
    query = 'SELECT * FROM shipments WHERE customer_email LIKE ? ORDER BY created_at DESC';
    params = [`%${email}%`];
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch shipments' });
    }
    res.json(rows);
  });
});

// Update shipment status
app.put('/api/shipments/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const { status } = req.body;
  
  db.run('UPDATE shipments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE tracking_number = ?', 
    [status, trackingNumber], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update shipment' });
    }
    
    // Get shipment details for email
    db.get('SELECT * FROM shipments WHERE tracking_number = ?', [trackingNumber], (err, shipment) => {
      if (!err && shipment) {
        const statusLabels = {
          purchased: 'נרכש',
          shipped: 'יצא למשלוח',
          arrived_country: 'הגיע לארץ',
          arrived_pickup: 'הגיע לאיסוף',
          out_for_delivery: 'יצא לשילוח'
        };
        
        // Send status update email
        const mailOptions = {
          from: 'snf1117@gmail.com',
          to: shipment.customer_email,
          subject: 'עדכון סטטוס משלוח - ' + trackingNumber,
          html: `
            <div dir="rtl">
              <h2>עדכון סטטוס משלוח</h2>
              <p><strong>מספר מעקב:</strong> ${trackingNumber}</p>
              <p><strong>תיאור הפריט:</strong> ${shipment.item_description}</p>
              <p><strong>סטטוס חדש:</strong> ${statusLabels[status] || status}</p>
              <p>המשלוח שלכם התעדכן! תוכלו לעקוב אחר ההתקדמות באתר שלנו.</p>
            </div>
          `
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Email error:', error);
          }
        });
      }
    });
    
    res.json({ message: 'Shipment updated successfully' });
  });
});

// Search shipment by tracking number
app.get('/api/track/:trackingNumber', (req, res) => {
  const trackingNumber = req.params.trackingNumber;
  
  db.get('SELECT * FROM shipments WHERE tracking_number = ?', [trackingNumber], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch shipment' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(row);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Database initialized successfully');
  console.log('Default admin credentials: username=admin, password=admin123');
});
