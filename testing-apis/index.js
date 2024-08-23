const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


// Initialize Express app
const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://yashgupta7247:Y%40sh7247@cluster0.4pumz8s.mongodb.net/employees', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Mongoose schema and model
const employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobile: String,
    age: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);

// CRUD Operations

// Create a new employee
app.post('/api/employees', async (req, res) => {
    const { firstName, lastName, mobile, age } = req.body;

    let employee = new Employee({
        firstName,
        lastName,
        mobile,
        age,
    });

    employee = await employee.save();
    res.send(employee);
});

// Get all employees
app.get('/api/employees', async (req, res) => {
    const employees = await Employee.find();
    res.send(employees);
});

// Get a specific employee by ID
app.get('/api/employees/:id', async (req, res) => {
    const employee = await Employee.findById(req.params.id);

    if (!employee) return res.status(404).send('Employee not found');
    res.send(employee);
});

// Update an employee by ID
app.put('/api/employees/:id', async (req, res) => {
    const { firstName, lastName, mobile, age } = req.body;

    const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, mobile, age },
        { new: true, runValidators: true }
    );

    if (!employee) return res.status(404).send('Employee not found');
    res.send(employee);
});

// Delete an employee by ID
app.delete('/api/employees/:id', async (req, res) => {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) return res.status(404).send('Employee not found');
    res.send(employee);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
