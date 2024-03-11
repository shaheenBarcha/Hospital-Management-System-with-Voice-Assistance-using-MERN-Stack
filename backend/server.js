const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Add this line
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

let checkRole;
let checkEmail;
let checkName;
let checkNameForPDF = '';

// Middleware
app.use(cors()); // Add this line
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Connect to MongoDB using Compass
mongoose.connect('mongodb://localhost:27017/Ehospital', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB User Schema
const User = mongoose.model('User', {
  username: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cellNumber: {type: Number},
  role: { type: String, enum: ['Patient', 'Doctor', 'Nurse', 'Pharmacist','Admin'], required: true },
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    req.user = user;
    next();
  });
};

// Registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, cellNumber,role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(role)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      cellNumber,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'your_jwt_secret');

    res.status(200).json({ token, role: user.role }); // Include user role in the response
    checkRole = user.role;
    checkEmail = user.email;
    
    console.log(checkEmail)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Example protected route (requires authentication)
app.get('/auth/protected', authenticateToken, (req, res) => {
  res.json({ message: 'You have access to this protected route', user: req.user });
});


// MongoDB Transcription Schema
const Transcription = mongoose.model('Transcription', {
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
app.post('/saveTranscription', async (req, res) => {
  try {
    const { transcription } = req.body;

    if (!transcription) {
      return res.status(400).json({ error: 'Transcription is required' });
    }

    const newTranscription = new Transcription({
      text: transcription,
    });

    await newTranscription.save();

    res.status(200).json({ message: 'Transcription saved successfully' });
  } catch (error) {
    console.error('Error saving transcription to database:', error);
    res.status(500).json({ error: 'Error saving transcription to database' });
  }
});

app.get('/getTranscriptions', async (req, res) => {
  try {
    const transcriptions = await Transcription.find({}).sort({ createdAt: -1 });

    res.status(200).json({ transcriptions });
  } catch (error) {
    console.error('Error retrieving transcriptions from database:', error);
    res.status(500).json({ error: 'Error retrieving transcriptions from database' });
  }
});
// Appointment
const appointmentSchema = new mongoose.Schema({
  patientName: String,
  doctorName: String,
  patientCell: String,
  appointmentDate: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// API endpoint to get appointments
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Add Appointment
app.post('/Addappointments', async (req, res) => {
  const { patientName, doctorName, patientCell, appointmentDate } = req.body;

  try {
    const newAppointment = new Appointment({
      patientName,
      doctorName,
      patientCell,
      appointmentDate,
    });

    await newAppointment.save();
    res.json(newAppointment);
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Delete Appointment
app.delete('/Deleteappointments/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//Sending Role:
app.get('/checkRole', async (req, res) => {
  try {
    // Ensure that checkRole is defined and not null or undefined
    if (checkRole) {
      res.json({ role: checkRole });
    } else {
      res.status(404).send('Role not found');
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).send('Internal Server Error');
  }
});
//Checking Email of Logged In user
app.get('/checkEmail', async (req, res) => {
  try {
    
    if (checkEmail) {
      res.json({ email: checkEmail });
      console.log('Email Sent to UI');
      console.log({checkEmail});
    } else {
      res.status(404).send('Email not found');
    }
  } catch (error) {
    console.error('Error fetching user email:', error);
    res.status(500).send('Internal Server Error');
  }
});
//Msg Schema
const messageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  message: String,
});

const Message = mongoose.model('Message', messageSchema);

app.use(express.json());

// Route to save a new message
app.post('/messages', async (req, res) => {
  const { sender, recipient, message } = req.body;

  try {
    const newMessage = new Message({ sender, recipient, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//Getting msg list
app.get('/messages-list', async (req, res) => {
  try {
    // Use the email obtained from the /checkEmail endpoint
    const recipientEmail = checkEmail;

    // Fetch messages from MongoDB based on the recipient's email
    const messages = await Message.find({ recipient: recipientEmail });

    // Assuming your Message model has a 'sender' field
    const messagesWithSender = messages.map(message => ({
      senderEmail: message.sender, // Add sender's email to the response
      message: message.message,
      // Add any other fields you want to include
    }));

    res.json({ messages: messagesWithSender });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//Login Check

app.get('/checkName', async (req, res) => {
  try {
    console.log(checkEmail);
  
    

    res.json({ email: checkEmail });
  } catch (error) {
    console.error('Error checking user name:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Getting user List
app.get('/usersList', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to delete a user by ID
app.delete('/Deleteusers/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    const deletedUser = await User.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//Getting patients :
app.get('/patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Patient Profile
const PatientProfile = mongoose.model('PatientProfile', {
  name: String,
  cell: String,
  appointmentDate: Date,
  doctorname:String,
  prescription: [String], // Changed to an array of strings
  specialInstructions: [String], // Changed to an array of strings
  billingAmount: Number,
});

app.use(express.json());

// Endpoint for creating a patient profile
app.post('/PatientProfile', async (req, res) => {
  try {
    const { name, cell, appointmentDate, doctorname, prescription, specialInstructions, billingAmount } = req.body;

    // Validate input data
    if (!name || !cell) {
      return res.status(400).json({ error: 'Name and Cell are required' });
    }

    // Create patient profile
    const patient = await PatientProfile.create({
      name,
      cell,
      appointmentDate,
      doctorname,
      prescription,
      specialInstructions,
      billingAmount,
    });

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
//Verify number
app.get('/verifyNumber', async (req, res) => {
  try {
    const { cell } = req.query;

    // Check if the phone number exists in the PatientProfile
    const patient = await PatientProfile.findOne({ cell });

    if (patient) {
      res.status(200).json({ available: false });
    } else {
      res.status(200).json({ available: true });
    }
  } catch (error) {
    console.error('Error verifying number:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to search for patients by name or cell number

app.get('/searchPatient', async (req, res) => {
  try {
    const { query } = req.query;
    const filteredPatients = await PatientProfile.find({
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { cell: { $regex: new RegExp(query, 'i') } },
      ],
    });

    res.json(filteredPatients);
  } catch (error) {
    console.error('Error handling /searchPatient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get details of a specific patient by cell number
app.get('/patientDetails/:cellNumber', async (req, res) => {
  try {
    const { cellNumber } = req.params;
    const patient = await PatientProfile.findOne({ cell: cellNumber });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to add prescription for a specific patient by cell number
app.post('/addPrescription/:cellNumber', (req, res) => {
  const { cellNumber } = req.params;
  const { prescription } = req.body;

  const patient = patients.find(p => p.cell === cellNumber);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Update the patient's prescription
  patient.prescription = prescription;

  res.json({ message: 'Prescription added successfully', patient });
});

// Endpoint to update patient information
app.put('/updatePatientInfo/:cellNumber', async (req, res) => {
  try {
    const { cellNumber } = req.params;
    const { prescription, specialInstructions, billingAmount } = req.body;

    // Find the patient in the MongoDB collection
    const patient = await PatientProfile.findOne({ cell: cellNumber });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Append new prescription to the existing list
    if (prescription) {
      patient.prescription = patient.prescription || [];
      patient.prescription.push(prescription);
    }

    // Append new special instructions to the existing list
    if (specialInstructions) {
      patient.specialInstructions = patient.specialInstructions || [];
      patient.specialInstructions.push(specialInstructions);
    }

    // Update billing amount
    if (billingAmount !== undefined) {
      patient.billingAmount = billingAmount;
    }

    // Save the updated patient information
    await patient.save();

    res.json({ message: 'Patient information updated successfully', patient });
  } catch (error) {
    console.error('Error updating patient information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Express route to fetch data
app.get('/doctors', async (req, res) => {
  try {
    // Fetch users with role 'Doctor'
    const doctors = await User.find({ role: 'Doctor' });

    // Generate random days and time for each doctor (for demonstration purposes)
    const doctorsWithAvailability = doctors.map(doctor => ({
      name: doctor.username,
      days: getRandomDays(),
      time: getRandomTime(),
    }));

    res.json(doctorsWithAvailability);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function getRandomDays() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const randomDays = [];

  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * daysOfWeek.length);
    randomDays.push(daysOfWeek[randomIndex]);
  }

  return randomDays.join(', ');
}

// Helper function to generate random time
function getRandomTime() {
  const hours = Math.floor(Math.random() * 12) + 1; // 1 to 12
  const minutes = Math.floor(Math.random() * 60); // 0 to 59

  const ampm = Math.random() < 0.5 ? 'AM' : 'PM';

  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Fetch user profile
app.get('/fetchProfileP', async (req, res) => {
  try {
    // Check if checkEmail is not null
    if (checkEmail) {
      const user = await User.findOne({ email: checkEmail });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userProfile = {
        username: user.username,
        email: user.email,
        password: user.password, // Include password if needed
        cellNumber: user.cellNumber, // Include cellNumber if needed
        role: user.role,
        // Add more attributes here as needed
        // Example: firstName: user.firstName, lastName: user.lastName, age: user.age, etc.
      };
      
      return res.json(userProfile);
    } else {
      // If checkEmail is null, respond with a message indicating no user is logged in
      return res.status(401).json({ message: 'No user logged in' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update user profile
app.put('/updateProfileP', async (req, res) => {
  try {
    const updatedData = req.body; // Assuming request body contains updated data

    // Fetch the user by email
    const user = await User.findOne({ email: checkEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.username = updatedData.username || user.username;
    user.email = updatedData.email || user.email;
    user.password = updatedData.password || user.password;
    user.cellNumber = updatedData.cellNumber || user.cellNumber;
    user.role = updatedData.role || user.role;
    // Update more attributes here as needed
    // Example: user.firstName = updatedData.firstName || user.firstName;
    
    // Save the updated user
    await user.save();

    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch user profile
app.get('/fetchProfile', async (req, res) => {
  try {
    // Check if checkEmail is not null
    if (checkEmail) {
      const user = await User.findOne({ email: checkEmail });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userProfile = {
        name: user.username,
        email: user.email,
        role: user.role,
      };

      return res.json(userProfile);
    } else {
      // If checkEmail is null, respond with a message indicating no user is logged in
      return res.status(401).json({ message: 'No user logged in' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update user profile
app.put('/updateProfile', async (req, res) => {
  try {
    const updatedData = req.body; // Assuming request body contains updated data

    // Fetch the first user in this example
    const user = await User.findOne({email:checkEmail});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.username = updatedData.username || user.username;
    user.email = updatedData.email || user.email;
    user.role = updatedData.role || user.role;

    // Save the updated user
    await user.save();

    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Handling Logout
app.post('/logout', (req, res) => {
  const { loggedOut } = req.body;

  // Check if the request contains shouldLogout set to true
  if (loggedOut === true) {
    // Update checkEmail to null
    checkEmail = null;

    // Respond with a success message
    res.json({ success: true });
  } else {
    // If shouldLogout is not true, respond with an error
    res.status(400).json({ error: 'Invalid request' });
  }
});

//Get Patient History

app.get('/getPrescriptionsAndInstructions', async (req, res) => {
  try {
    

    // Replace this with your actual checkEmail variable
    const user = await User.findOne({ email: checkEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cellNo = user.cellNumber;

    const userProfile = await PatientProfile.findOne({ cell: cellNo });
    
    console.log('Checking name in Patient Profile: ');
    

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const prescriptions = userProfile.prescription || [];
    const specialInstructions = userProfile.specialInstructions || [];

    res.json({ prescriptions, specialInstructions });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Medicine Schema
const medicineSchema = new mongoose.Schema({
  medname: String, // Update from 'name' to 'medname'
  quantity: Number,
  price: Number,
  manufacturer: String,
  expiryDate: Date,
});

const Medicine = mongoose.model('Medicine', medicineSchema);

// Update the route handlers accordingly (e.g., /searchMedicine, /addMedicine, /removeMedicine)

// API endpoint to search for medicines
app.get('/searchMedicine', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // If search term is provided, perform a case-insensitive search on the 'medname' field
      query = { medname: { $regex: new RegExp(search, 'i') } };
    }

    const medicines = await Medicine.find(query);
    res.json(medicines);
  } catch (error) {
    console.error('Error searching medicines:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to add a new medicine
app.post('/addMedicine', async (req, res) => {
  try {
    const { medname, quantity, price, manufacturer, expiryDate } = req.body;

    // Validate input data
    if (!medname || !quantity || !price || !manufacturer || !expiryDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newMedicine = new Medicine({
      medname, // Update from 'name' to 'medname'
      quantity,
      price,
      manufacturer,
      expiryDate,
    });

    await newMedicine.save();

    res.status(201).json({ message: 'Medicine added successfully', medicine: newMedicine });
  } catch (error) {
    console.error('Error adding medicine:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to remove a medicine
app.delete('/removeMedicine/:medname', async (req, res) => {
  const medname = req.params.medname;

  try {
    const deletedMedicine = await Medicine.findOneAndDelete({ medname: medname });

    if (!deletedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json({ message: 'Medicine removed successfully' });
  } catch (error) {
    console.error('Error removing medicine:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to update medicine quantities
app.post('/updateQuantity', async (req, res) => {
  try {
    const updatedMedicines = req.body;

    // Iterate through the updated medicines and update quantities in the database
    for (const updatedMedicine of updatedMedicines) {
      const { medname, quantity } = updatedMedicine;

      // Find the medicine in the database
      const medicine = await Medicine.findOne({ medname });

      // Update the quantity
      if (medicine) {
        medicine.quantity -= quantity;
        await medicine.save();
      } else {
        console.error(`Medicine ${medname} not found in the database.`);
      }
    }

    // Send a success response
    res.status(200).send('Medicine quantities updated successfully.');
  } catch (error) {
    console.error('Error updating medicine quantities:', error);
    // Send an error response
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get all prescriptions
app.get('/pharmacyPrescriptions', async (req, res) => {
  try {
    const prescriptions = await PatientProfile.find();  // Use the correct collection (PatientProfile) instead of Prescription
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Medicine Request schema
const medRequestSchema = new mongoose.Schema({
  patientName: String,
  cell: String,
  medicineName: String,
});

const MedRequest = mongoose.model('MedRequest', medRequestSchema);

// Routes
app.post('/medrequests', async (req, res) => {
  try {
    const { patientName, cell, medicineName } = req.body;

    if (!patientName || !cell || !medicineName) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newMedRequest = new MedRequest({ patientName, cell, medicineName });
    await newMedRequest.save();

    res.status(201).json({ message: 'Medicine request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting medicine request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Route to handle fetching medicine requests
app.get('/viewMedreq', async (req, res) => {
  try {
    const medicineRequests = await MedRequest.find();
    res.json(medicineRequests);
  } catch (error) {
    console.error('Error fetching medicine requests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/generatePDF', async (req, res) => {
  if (checkEmail) {
    const user = await User.findOne({ email: checkEmail });
    checkNameForPDF = user.username;
  }

  const profiles = await PatientProfile.find().lean();

  const doc = new PDFDocument();
  doc.pipe(res);

  // Set font and color for the letterhead
  doc.font('Helvetica-Bold').fillColor('Black');

  // Add logo (replace 'path_to_your_logo.png' with the actual path or URL of your logo image)
  const iconPath = 'C:/Users/Shaheen/Desktop/HospitalManagementSystem/frontend/src/Components/images/medicine-icon.png';
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Add letterhead
  doc
    .image(iconPath, { align: 'left', width: 30, height: 40, radius: 10 })
    .text(`Date: ${formatDate(new Date())}`, { align: 'right',fillColor:'black' })
    .text('E-Hospital', { align: 'center' })
    .text('Email: admin@gmail.com', { align: 'center' })
    .text('Hospital Cell: 1243', { align: 'center' })
    .text(`Report Generated by: ${checkEmail}`, { align: 'center' })
    .moveDown(); // Move down to leave space between letterhead and profile information

  // Reset font and color for the profile information
  doc.font('Helvetica').fillColor('black');

  profiles.forEach((profile) => {
    // Check if the current profile's name matches the requested name
    console.log('API Called');
    console.log(checkNameForPDF);
    console.log(checkNameForPDF);
    if (profile.name === checkNameForPDF) {
      console.log('Inside if condition for the PDF');
      doc
        .text(`Name: ${profile.name}`)
        .text(`Cell: ${profile.cell}`)
        .text(`Appointment Date: ${profile.appointmentDate}`)
        .text(`Doctor Name: ${profile.doctorname}`)
        .text(`Prescription: ${profile.prescription.join(', ')}`)
        .text(`Special Instructions: ${profile.specialInstructions.join(', ')}`)
        .text(`Billing Amount: ${profile.billingAmount}`)
        .moveDown();
    }
  });

  doc.end();
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));