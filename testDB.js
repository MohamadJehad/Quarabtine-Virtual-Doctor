var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "jehad",
  password: "Jehad123456@22",
  database: "graduation_project"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    const currentDate = new Date().toISOString().slice(0, 10); // get current date in ISO format
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // get current time in 24-hour format

    con.query(`
    UPDATE doctor
SET birthDate = '12-08-1970';

; `
    , function (err, result, fields) {
        if (err) throw err;
          
      console.log( result);
    });
  });

//INSERT INTO healthIndicator (temp, heartRate, oxygenRate, date, time) VALUES ('37', '90', '92', '${currentDate}', '${currentTime}');
  //select * from DOCTOR;
  //`SELECT * FROM Doctor WHERE username = '${userName}' AND password = '${Password}'`
  //INSERT INTO Doctor values ('jehad','01026984456')  ;
  //insert into docotr (username,password) values ('jk','jk') where docotr_Name='mohamad jehad';
  //create table patient (FirstName varchar(255),Address varchar(255),phone varchar(255));
  //create table healthIndicator (date DATE,time TIME,temp varchar(255),heartRate varchar(255),bloodPressure varchar(255),oxygenRate varchar(255));
  // create table patient (FName varchar(255),gender varchar(255),birthDate varchar(255),prescription varchar(255),mobile varchar(255),city varchar(255),street varchar(255),buildingNo varchar(255));

  /*
  
  INSERT INTO doctor (FName, gender, username, password, specialization, mobile, city, street, buildingNo)
VALUES 
  ('Alice', 'Female', 'alice123', 'pass123', 'Surgeon', '555-555-5555', 'London', 'Oxford St', '1234'),
  ('Bob', 'Male', 'bob456', 'pass456', 'Pediatrician', '555-555-5556', 'Paris', 'Champs-Élysées', '5678'),
  ('Charlie', 'Male', 'charlie789', 'pass789', 'Dermatologist', '555-555-5557', 'Berlin', 'Unter den Linden', '9012');

  */

  //CREATE TABLE caregiver (id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL,username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, patient_id INT, FOREIGN KEY (patient_id) REFERENCES patient(ID));

  //CREATE TABLE patient_situation ( id INT PRIMARY KEY,patient_id INT,Situation  VARCHAR(255), medicine VARCHAR(255),FOREIGN KEY (patient_id) REFERENCES patient(ID));



  //CREATE TABLE patient_status (patient_id INT, bloodpressure VARCHAR(255),diabetes VARCHAR(255),heartdisease VARCHAR(255),pregnant VARCHAR(255),allergies VARCHAR(255),PRIMARY KEY (patient_id), FOREIGN KEY (patient_id) REFERENCES patient(ID) );