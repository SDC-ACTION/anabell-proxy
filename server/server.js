const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const bodyParser = require('body-parser');
require('newrelic');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/products', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
}));

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
}));

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
