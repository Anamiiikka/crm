const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Init middleware
app.use(bodyParser.json());

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
