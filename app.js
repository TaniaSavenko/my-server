const express = require('express');
const app = express();
app.use(express.static('public'));
const port = 3000;

// The home page ("/") is public/index.html, served by express.static above.

app.get('/about', (req, res) => {
  res.send('This is the about page. I built this server myself!');
});

app.get('/contact', (req, res) => {
  res.send('Contact me at: hello@mysite.com');
});

app.get('/api/time', (req, res) => {
  res.json({
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString()
  });
});

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'stranger';
  res.json({ message: `Hello, ${name}! Welcome to my server.` });
});

// Only start listening when this file is run directly (node app.js).
// When tests load it with require(), they start their own copy instead.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;
