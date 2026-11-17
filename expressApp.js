import express from 'express';
const app = express();
const PORT = 4000;
// Middleware to parse incoming JSON requests
app.use(express.json());
// Initialize array with 3 sample food records
let foods = [
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
 availability: true }
];
// 1. GET /foods - Retrieve all food items
app.get('/foods', (req, res) => {
 res.status(200).json(foods);
});
// 2. GET /foods/:id - Retrieve food by ID
app.get('/foods/:id', (req, res) => {
 const foodId = parseInt(req.params.id, 10);
 const food = foods.find((item) => item.id === foodId);
 if (!food) {
 return res.status(404).json({ error: 'Food item not found' });
 }
 res.status(200).json(food);
});
// 3. POST /foods - Add a new food item
app.post('/foods', (req, res) => {
 const { id, foodName, category, price, availability } = req.body;
 // Validate required fields and positive price
 if (
 id === undefined ||
 !foodName ||
 !category ||
 typeof price !== 'number' ||
 price <= 0 ||
 typeof availability !== 'boolean'
 ) {
 return res.status(400).json({
 error: 'Missing required fields (id, foodName, category, price, availability) or price is not a positive number'
 });
 }
 const newFood = {
 id: Number(id),
 foodName,
 category,
 price,
 availability
 };
 foods.push(newFood);
 res.status(201).json({
 message: 'Food item added successfully',
 food: newFood
 });
});
// 4. PUT /foods/:id - Update food details
app.put('/foods/:id', (req, res) => {
 const foodId = parseInt(req.params.id, 10);
 const foodIndex = foods.findIndex((item) => item.id === foodId);
 if (foodIndex === -1) {
 return res.status(404).json({ error: 'Food item not found' });
 }
 const { foodName, category, price, availability } = req.body;
 if (
 !foodName ||
 !category ||
 typeof price !== 'number' ||
 price <= 0 ||
 typeof availability !== 'boolean'
 ) {
 return res.status(400).json({
 error: 'Missing required fields (foodName, category, price, availability) or price is not a positive number'
 });
 }
 foods[foodIndex] = {
 id: foodId, foodName,
 category,
 price,
 availability
 };
 res.status(200).json({
 message: 'Food item updated successfully',
 food: foods[foodIndex]
 });
});
// 5. DELETE /foods/:id - Delete a food item
app.delete('/foods/:id', (req, res) => {
 const foodId = parseInt(req.params.id, 10);
 const foodIndex = foods.findIndex((item) => item.id === foodId);
 if (foodIndex === -1) {
 return res.status(404).json({ error: 'Food item not found' });
 }
 const deletedFood = foods.splice(foodIndex, 1)[0];
 res.status(200).json({
 message: 'Food item deleted successfully',
 food: deletedFood
 });
});
// Handle invalid JSON body syntax errors
app.use((err, req, res, next) => {
 if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
 return res.status(400).json({ error: 'Invalid JSON format in request body' });
 }
 next();
});
// Catch-all 404 handler for invalid routes
app.use((req, res) => {
 res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
 console.log(`Express Server running at http://localhost:${PORT}`);
});
