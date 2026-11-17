import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// In-memory array of food items
const foods = [
 {
 id: 1,
 foodName: "Pizza",
 category: "Fast Food",
 price: 250,
 availability: true
 },
 {
 id: 2,
 foodName: "Veg Burger",
 category: "Fast Food",
 price: 150,
availability: true
 },
 {
 id: 3,
 foodName: "Pasta Alfredo",
 category: "Italian",
 price: 220,
 availability: false
 }
];
const server = http.createServer((req, res) => {
 const { method, url } = req;
 // Route: GET / (Welcome page in HTML format)
 if (method === 'GET' && url === '/') {
 res.writeHead(200, { 'Content-Type': 'text/html' });
 res.end(`
 <!DOCTYPE html>
 <html>
 <head><title>Welcome</title></head>
 <body>
 <h1>Welcome to the Online Food Ordering System</h1>
 <p>Explore our routes: <a href="/menu">Menu</a> | <a href="/foods">Available Foods (JSON)</a> | <a href="/about">About Us</a></p>
 </body>
 </html>
 `);
 }
 // Route: GET /about (Restaurant information)
 else if (method === 'GET' && url === '/about') {
 res.writeHead(200, { 'Content-Type': 'text/html' });
 res.end(`
 <!DOCTYPE html>
 <html>
 <head><title>About Us</title></head>
 <body>
 <h1>About Our Restaurant</h1>
 <p>We serve freshly prepared Fast Food, Italian Dishes, and Beverages with quick online delivery.</p>
 </body>
 </html>
 `);
 }
 // Route: GET /foods (Available food items where availability = true in JSON format)
 else if (method === 'GET' && url === '/foods') {
 const availableFoods = foods.filter((food) => food.availability === true);
 res.writeHead(200, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify(availableFoods));
 }
 // Route: GET /menu (Serve static file public/menu.html using fs.readFile)
 else if (method === 'GET' && url === '/menu') {
 const menuFilePath = path.join(__dirname, 'public', 'menu.html');
 fs.readFile(menuFilePath, 'utf8', (err, data) => {
 if (err) {
 res.writeHead(500, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ error: 'Internal Server Error: Could not read menu.html' }));
 return;
 }
 res.writeHead(200, { 'Content-Type': 'text/html' });
 res.end(data);
 });
 }
 // Route: POST /add-food (Accept food details in JSON format and add to array)
 else if (method === 'POST' && url === '/add-food') {
 let body = '';
 req.on('data', (chunk) => {
 body += chunk.toString();
 });
 req.on('end', () => {
 try {
 const newFood = JSON.parse(body);
 const { id, foodName, category, price, availability } = newFood;
 // Validate required fields
if (
 id === undefined ||
 !foodName ||
 !category ||
 typeof price !== 'number' ||
 price <= 0 ||
 typeof availability !== 'boolean'
 ) {
 res.writeHead(400, { 'Content-Type': 'application/json' });
 res.end(
 JSON.stringify({
 error: 'Bad Request: Missing or invalid required fields (id, foodName, category, positive price, availability)'
 })
 );
 return;
 }
 const foodRecord = { id, foodName, category, price, availability };
 foods.push(foodRecord);
 res.writeHead(201, { 'Content-Type': 'application/json' });
 res.end(
 JSON.stringify({
 message: 'Food item added successfully',
 food: foodRecord
 })
 );
 } catch (error) {
 res.writeHead(400, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ error: 'Bad Request: Invalid JSON payload' }));
 }
 });
 }
 // Error Handling: 404 for invalid routes
 else {
 res.writeHead(404, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ error: '404 Not Found: The requested route does not exist' }));
 }
});
server.listen(PORT, () => {
 console.log(`HTTP Server running at http://localhost:${PORT}`);
});