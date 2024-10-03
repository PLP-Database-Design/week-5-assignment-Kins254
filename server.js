// import some dependecies/packages

const express= require('express');//express framework, for handling http requests and responses

//create an instance 
const app=express();
//DBMS MySql
const mysql=require('mysql2');
//cross origin resource sharing
const cors=require('cors'); //allows requests from other domains, which is useful in modern web development when making requests from a frontend hosted on a different domain

//environment variable
const dotenv=require('dotenv'); //used to load sensitive information (like DB credentials) from a .env file for security purposes.

app.use(express.json()); //Parses incoming JSON requests so you can access the request body using req.body.
app.use(cors()); //Enables Cross-Origin Resource Sharing to allow the server to handle requests from other domains.
dotenv.config();//Loads environment variables from a .env file into process.env.

//connecting to the database
const db=mysql.createConnection({
    host: process.env.DB_HOST,
   user:process.env.DB_USERNAME,
   password:process.env.DB_PASSWORD,
   database:process.env.DB_NAME 
})

//Checking Database Connection
db.connect((err) => {
  if (err) return console.log("Error connecting to MySQL", err);
  console.log("Connected to MySQL as id:", db.threadId);
});

//setting Up View Engine (EJS) 
app.set('view engine', 'ejs');              // Set EJS as the templating/view engine
app.set('views', __dirname + '/views');     // Set the directory for view templates



// Root route - home page
app.get('/', (req, res) => {
  res.send('Welcome to the API! Use /patients or /providers to fetch data.');
});




//Getting route to fetch and display data from database
//question 1 :Retrieve all patients
app.get('/patients',(req,res)=>{
  db.query('SELECT patient_id,first_name,last_name,date_of_birth FROM patients',(err,results)=>{
    if(err){
      console.error(err);
      res.status(500).send('Error Retrieving data');
    }else{
      res.render('patients',{results:results});
    }
  });
});

//Quesdtion 2 :Retrieve all providers
app.get('/providers',(req,res)=>{
  db.query('SELECT first_name,last_name,provider_specialty FROM providers',(err,results)=>{
    if(err){
      console.error(err);
      res.status(500).send('Error Retrieving data');
    }else{
      res.render('providers',{results:results});
    }
  });
});

//Question 3:Filter patients by First Name
app.get('/patients_filter', (req, res) => {
  const firstName = req.query.first_name;  // Get first_name from the query parameters

  if (!firstName) {
    return res.status(400).send('First name is required');
  }

  db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error Retrieving data');
    } else {
      res.render('patients_filter',{results:results});
    }
  });
});

//Question 4:Retrieve all providers by their specialty
app.get('/providers_filter', (req, res) => {
  const specialty = req.query.specialty;  // Get specialty from the query parameters

  if (!specialty) {
    return res.status(400).send('Specialty is required');
  }

  db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error Retrieving data');
    } else {
      res.render('providers_filter',{results:results});
    }
  });
});






// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
})