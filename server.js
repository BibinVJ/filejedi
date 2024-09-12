const express = require('express');
const path = require('path');
const routesHandler = require('./routes/handler');

const app = express();

app.use(express.json());

// Enable CORS manually
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE'); // Allow these methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow these headers
  if (req.method === 'OPTIONS') {
    res.sendStatus(204); // Send 204 for preflight requests
  } else {
    next();
  }
});

app.use('/public', express.static(path.join(__dirname, './', 'public')));

// API routes
app.use('/api', routesHandler);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'The API is working fine' });
});

// Serve static files from the React app only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
