const express = require('express');
const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Your other routes and middleware go here

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
