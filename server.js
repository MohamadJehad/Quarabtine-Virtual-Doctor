const express=require ("express");
const path=require("path")
const mqtt=require("mqtt")
var parseUrl = require('body-parser');

const app=express()

const port=3005
const session = require("express-session");
topic='my';


/*
the req.sessions used here are

authenticated
nurseID
role
patientID
doctorID
roomID
*/ 



const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/vCall', (req, res) => {
  session.roomID=uuidV4();
  res.redirect(`/room${req.session.roomID}`)
 
})

app.get('/room:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

app.get('/vCallForMobile', (req, res) => {
  res.render('vCallForMobile/vCallForMobile', { roomId: 25 })
})
app.get('/vCallForMobile1', (req, res) => {
  res.render('vCallForMobile1/vCallForMobile', { roomId: 25 })
})

app.get('/PatientProfileFornurse', (req, res) => {
  //it is in the url of redirect in login as IT_Manager post 
  var ID = req.query.id;
  con.query(`SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, p.city, p.street, p.buildingNo, doctor.FName as assigned_doctor 
  FROM patient as p 
  JOIN doctor ON p.doctor_id = doctor.ID
  WHERE p.ID = '${ID}';`,
   function (error, results1, fields) {
    if (error) throw error;

    con.query(`select * from patient_situation where patient_id='${ID}'`,(err,result)=>{
      if (err) throw err;
      con.query(`select * from healthIndicator where patient_id= '${ID}';`,function (err,result2,filed){
        if(err) throw err;
        
   
      res.render('HomePage/PatientProfileFornurse',  { patients: results1, history:result ,situations: result ,health:result2,showMeassure:false, roomId:25});

    })
  })
  }); 
});


app.get('/PatientProfileForDoctor', (req, res) => {
   
  var ID = req.query.id;

  con.query(`SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, p.city, p.street, p.buildingNo, doctor.FName as assigned_doctor 
  FROM patient as p 
  JOIN doctor ON p.doctor_id = doctor.ID
  WHERE p.ID = '${ID}';`,
   function (error, results1, fields) {
    if (error) throw error;
    con.query(`select * from healthIndicator where patient_id= '${ID}';`,function (err,result,filed){
      if(err) throw err;
      con.query(`select * from patient_situation where patient_id= '${ID}';`,function (err,result2,filed){
        if(err) throw err;
        con.query(`select * from patient_status where patient_id= '${ID}';`,function (err,result3,filed){
          if(err) throw err;
        //  roomId:uuidV4()
      res.render('HomePage/PatientProfileForDoctor',  {status:result3  ,patients: results1 ,
        health: result, history:result2,showMeassure:false , roomId:25
      });
      client.publish('M11', 's');
    })
  })
})
  });
});
   

//database initialization
var mysql = require('mysql2');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nuttertools123A",
  database: "graduation_project"
});


//this for authentication not to direct access home page as IT_Manager
app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));


//uses for css
 
app.use(express.static(path.join(__dirname ,"/views/FirstPage")));

 const staticPath=path.join(__dirname ,"/views/AddDoctor")
 app.use(express.static(staticPath));
const staticPath8=path.join(__dirname ,"/views/HomePage")
app.use(express.static(staticPath8));

const staticPath2=path.join(__dirname ,"/views/AddPatient")
app.use(express.static(staticPath2));

const staticPath3=path.join(__dirname ,"/views/login_as_IT_Manager")
app.use(express.static(staticPath3));
app.use(express.static(path.join(__dirname,"/views/login_as_doctor")));

//parser to can access elements in the page
let encodeUrl = parseUrl.urlencoded({ extended: false });
app.use(encodeUrl);


app.use(express.static(path.join(__dirname ,"/views/PatientsRooms")));

//MQTT section  
//---------------------------------------
const client=mqtt.connect('http://broker.hivemq.com');
//const client = mqtt.connect('mqtt://localhost')
client.on('connect', () => {
  client.subscribe('my', (err) => {
    if (err) {
      console.error('Error subscribing to topic my:', err);
    } else {
      console.log('Subscribed to topic: my');
    }
  });
  client.subscribe('M11', (err) => {
    if (err) {
      console.error('Error subscribing to topic M11:', err);
    } else {
      console.log('Subscribed to topic: M11');
    }
  });
  client.subscribe('motion', (err) => {
    if (err) {
      console.error('Error subscribing to topic motion:', err);
    } else {
      console.log('Subscribed to topic: motion');
    }
  });
  
})

client.on('message', (topic, message) => {
  console.log(`Received message on topic '${topic}': ${message}`)
})
//variable used to identify which patient will be measuring right now , it takes it's value from post method new meassure
var ID_patient_forMeasure;

//recieve measure from mqtt and insert it into database
client.on('connect', function () {
  const topic = 'my';
  client.subscribe(topic, function (err) {
    if (err) {
      console.log('Error:', err);
      res.status(500).send('Failed to subscribe');
    } else {
      console.log(`Subscribed to topic '${topic}'`);
    }
  });

  client.on('message', function (topic, message) {
    //console.log(`Received message on topic '${topic}': ${JSON.stringify(data)}`);
    if (topic === 'my') {
      try {
        const data = JSON.parse(message.toString());
        console.log(`Received message on topic '${topic}': ${JSON.stringify(data)}`);
        const currentDate = new Date().toISOString().slice(0, 10); // get current date in ISO format
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // get current time in 24-hour format

        con.query(`INSERT INTO healthIndicator (temp, heartRate, oxygenRate, date, time, patient_id) VALUES ('${data.temp}', '${data.spo2}', '${data.bpm}', '${currentDate}', '${currentTime}',${ID_patient_forMeasure}) ;`, function (err, result, fields) {
          if (err) throw err;
        });
      } catch (e) {
        console.log(`Error parsing message: ${message.toString()}`);
      }
      // Reset the variable to undefined
     // ID_patient_forMeasure = undefined;
    }
  });
});


app.post('/NewMeasure', encodeUrl, (req, res) => {
  client.publish('M11', 's');

  var ID=req.body.patientID;
  ID_patient_forMeasure=ID;
  console.log(ID_patient_forMeasure);
  
  // delay of 200ms
  setTimeout(() => {
    con.query(`SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, p.city, p.street, p.buildingNo, doctor.FName as assigned_doctor 
    FROM patient as p 
    JOIN doctor ON p.doctor_id = doctor.ID
    WHERE p.ID = '${ID}';`,
    function (error, results1, fields) {
      if (error) throw error;

      con.query(`select * from healthIndicator where patient_id= '${ID}';`,function (err,result,filed){
        if(err) throw err;
        con.query(`select * from patient_situation where patient_id= '${ID}';`,function (err,result2,filed){
          if(err) throw err;
          con.query(`select * from patient_status where patient_id= '${ID}';`,function (err,result3,filed){
            if(err) throw err;
        res.render('HomePage/PatientProfileForDoctor',  { status:result3, patients: results1,history:result2 ,health: result,showMeassure:true,roomId:25});
            /*
            const queryParameters = new URLSearchParams({
  id: ID_patient_forMeasure,
  status: result3,
  patients: results1,
  history: result2,
  health: result,
  showMeasure: true,
  roomId: 25
});

res.redirect(`/PatientProfileForDoctor?${queryParameters}`);

            */ 
      })
    })
  })
    });
  }, 700);
 
});


// // this using mosquito
// const client2 = mqtt.connect('mqtt://localhost')
// client2.on('connect', () => {
//   client2.publish('test_sensor_data', JSON.stringify(data))
 

//   client2.publish('my/topic', 'Hello, world!+2')
//   console.log('Connected to Mosquitto broker000!');
// })



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname ,"/views/FirstPage/index.html"));
})

//to enable using ejs
app.use(express.static(path.join(__dirname ,"/views/Patient And HomePage")));
app.set('view engine', 'ejs');

app.get('/HomePageIT_Manager',(req, res) => {
  if (!req.session.authenticated) {
   // res.send("<!DOCTYPE html><html><head><title>Login Required</title></head><body><h1>Please Login First</h1></body></html>");
    //  return res.redirect("/");
  }  
  con.query('SELECT * FROM IT_Manager;', function (error, results3, fields) {
    if (error) throw error;
    con.query('SELECT * FROM doctor;', function (error, results, fields) {
      if (error) throw error;
      con.query('SELECT p.ID,p.FName, p.gender, p.birthDate, p.weight, p.mobile, p.city, p.street, p.buildingNo,p.room_id, doctor.FName as assigned_doctor FROM patient as p JOIN doctor ON p.doctor_id = doctor.ID;',
       function (error, results1, fields) {
        if (error) throw error;
        con.query('SELECT * FROM nurse ;',function(error, results2, fields){
          if (error) throw error;

        con.query('SELECT * FROM Receptionist;',function(error,result4,fields){
          if(error) throw error;
        

        res.render('HomePage/homePageIT_Manager',  {IT_Manager:results3,nurses :results2,doctors: results, patients: results1,Receptionist:result4 });
      } );
      })
      });
    });
    });
  
  
});

//-----------------------
app.get('/HomePageReceptionist',(req, res) => {
  if (!req.session.authenticated) {
   // res.send("<!DOCTYPE html><html><head><title>Login Required</title></head><body><h1>Please Login First</h1></body></html>");
    //  return res.redirect("/");
  }  
      con.query('SELECT p.ID,p.FName, p.gender, p.birthDate, p.weight, p.mobile, p.city, p.street, p.buildingNo,p.room_id, doctor.FName as assigned_doctor FROM patient as p JOIN doctor ON p.doctor_id = doctor.ID;',
       function (error, results1, fields) {
        if (error) throw error;
        con.query('SELECT * FROM nurse ;',function(error, results2, fields){


          con.query(`SELECT * FROM N_monitor_P   ;`, function (error, results, fields) {
            if (error) throw error;
            res.render('HomePage/homePageForReceptionist',  { patients: results1,nurses:results2,nmonitorp:results});
          })

        
        })

        
    });
});
//-----------------------

app.get('/HomePageDoctor', (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect("/loginAsDoctor");
  }
  const doctorID = req.session.doctorID;

    con.query(`SELECT * FROM patient where doctor_id='${doctorID}';`, function (error, results1, fields) {
      if (error) throw error;
    
      res.render('HomePage/homePageDoctor',  { patients: results1});
    });
  });

  app.get('/HomePageNurse', (req, res) => {
    // if (!req.session.authenticated) {
    //   return res.redirect("/loginAsDoctor");
    // }
    const nurseID = req.session.nurseID;
    console.log(nurseID);
    con.query(`select floor from nurse where ID=${nurseID};`,function(error,result,filed){
      if (error) throw error;
      let roomNumbers=[];
     
       for(i=0;i<10;i++){
        roomNumbers[i]=(result[0].floor-1)*10+i;
       
      }
      
      con.query(`SELECT * FROM patient WHERE room_id IN (?);`, [roomNumbers],function (error, results1, fields) {
        if (error) throw error;
         
   
      
        res.render('HomePage/homePageNurse',  { patients: results1,nurseID:nurseID});
      })
    }) 
  
    //   con.query(`SELECT * FROM patient where nurse_id='${nurseID}';`, function (error, results1, fields) {
    //     if (error) throw error;
      
    //     res.render('HomePage/homePageNurse',  { patients: results1});
    //   });
     });




 
app.post('/PatientProfileForIT_Manager', (req, res) => {
  var ID=req.body.patientID;

  con.query(`SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, p.city, p.street, p.buildingNo,p.room_id, doctor.FName as assigned_doctor 
  FROM patient as p 
  JOIN doctor ON p.doctor_id = doctor.ID
  WHERE p.ID = '${ID}';`,
   function (error, results1, fields) {
    if (error) throw error;
   con.query(`select * from nurse `
   ,function (error, results, fields) {
    if (error) throw error;
  
    res.render('HomePage/PatientProfileForIT_Manager',  { nurses:results, patients: results1});
  });
  });
  });

  
  app.post('/DoctorProfile', (req, res) => {
    console.log(req.body.doctorID);
    var ID=req.body.doctorID;
    con.query(`select * from doctor where ID='${ID}';`, function (error, results1, fields) {
      if (error) throw error;
    
      res.render('HomePage/DoctorProfile',  { Doctors: results1});
    });
    });
    app.post('/PatientSaveEdit', (req, res) => {
      var ID=req.body.patientID;
      var firstName = req.body.FName;
      var gender=req.body.gender;
      var male=req.body.Male;
      var female=req.body.Female;
      var weight=req.body.weight;
      var buildingNo=req.body.buildingNo;
      var mobile = req.body.mobile;
      var city=req.body.city;
      var birthDate=req.body.birthDate;
      var street=req.body.street;
      var room_id=req.body.room_id;
      con.query(`UPDATE patient
      SET FName = '${firstName}',room_id='${room_id}' ,gender = '${gender}', weight = '${weight}', birthDate = '${birthDate}', mobile = '${mobile}', city = '${city}', street = '${street}', buildingNo = '${buildingNo}'
      WHERE ID = '${ID}';`, function (err, result, fields) {
      if (err) throw err;
    }); 
    res.redirect('/homePageIT_Manager');
  });

  app.post('/DoctorSaveEdit', (req, res) => {
    var ID=req.body.doctorID;
    var firstName = req.body.FName;
    var gender=req.body.gender;
    var username=req.body.username;
    var password=req.body.password;
    var specialization=req.body.specialization;
    var buildingNo=req.body.buildingNo;
    var mobile = req.body.mobile;
    var city=req.body.city;
    var street=req.body.street;
    var birthDate=req.body.birthDate;
    con.query(`UPDATE doctor
    SET FName = '${firstName}',birthDate='${birthDate}',username='${username}',password='${password}', gender = '${gender}', specialization = '${specialization}', mobile = '${mobile}', city = '${city}', street = '${street}', buildingNo = '${buildingNo}'
    WHERE ID = ${ID};`, function (err, result, fields) {
    if (err) throw err;
  }); 
  res.redirect('/homePageIT_Manager');
});

  app.post('/DeletePatient', (req, res) => {
    var ID=req.body.patientID;
    con.query(`delete from n_monitor_p where patient_id = '${ID}';`,function(err,result,field){
      if (err) throw err;
    })
    con.query(`delete from healthindicator WHERE patient_id = '${ID}';`, function (err, result, fields) {
      if (err) throw err;
    }); 
    con.query(`DELETE FROM patient_status WHERE patient_id = ${ID}`, function(err, result) {
      if (err) throw err;
     })
    //  con.query(`DELETE FROM nurse WHERE patient_id = ${ID}`, function(err, result) {
    //   if (err) throw err;
    //  })
     con.query(`DELETE FROM patient_situation WHERE patient_id = ${ID}`, function(err, result) {
      if (err) throw err;
     })
    con.query(`delete from patient WHERE ID = '${ID}';`, function (err, result, fields) {
    if (err) throw err;
  }); 
  //console.log(req.session.role);
  if(req.session.role=='IT_Manager'){
    console.log("redirect to it manage")
    res.redirect('/homePageIT_Manager');
  }
  if(req.session.role=='receptionist'){
    console.log("redirect to it receptionist")
    res.redirect('/homePageReceptionist');
  }
  
});

app.post('/DeleteDoctor', (req, res) => {
  var ID = req.body.doctorID;
  con.query(`delete from doctor WHERE ID = ${ID};`, function (err, result, fields) {
      try {
          if (err) throw err;
          res.redirect('/homePageIT_Manager');
      } catch (error) {
          console.error(error);
          // handle the error, for example:
          res.status(500).send('Error deleting doctor the doctor is assigned to many patients');
      }
  }); 
});
app.post('/Deletenurse', (req, res) => {
  var nurseID=req.body.nurseID;
  con.query(`delete from n_monitor_p where nurse_id = '${nurseID}';`,function(err,result2,field){
    if (err) throw err;
  })
  con.query(`delete from nurse WHERE id = ${nurseID};`, function (err, result, fields) {
  if (err) throw err;
}); 
res.redirect('/homePageIT_Manager');
});

//
app.post('/removeIT_Manager', (req, res) => {
  var IT_Manager=req.body.IT_ManagerID;
  con.query(`delete from IT_Manager WHERE id = ${IT_Manager};`, function (err, result, fields) {
  if (err) throw err;
}); 
res.redirect('/homePageIT_Manager');
});
app.post('/removeReceptionist', (req, res) => {
  var Receptionist=req.body.ReceptionistID;
  con.query(`delete from Receptionist WHERE id = ${Receptionist};`, function (err, result, fields) {
  if (err) throw err;
}); 
res.redirect('/homePageIT_Manager');
});


app.post('/removenurse', (req, res) => {
  var nurse=req.body.nurseID;
  con.query(`delete from n_monitor_p where nurse_id = '${nurse}';`,function(err,result,field){
    if (err) throw err;
  })
  con.query(`delete from nurse WHERE id = ${nurse};`, function (err, result, fields) {
  if (err) throw err;
}); 
res.redirect('/homePageIT_Manager');
});






app.get('/addpatient', (req, res) => {
  con.query('SELECT FName FROM doctor', (error, results) => {
    if (error) throw error;
  

    res.render('AddPatient/index', { doctors: results });
  });
});
app.get('/adddoctor', (req, res) => {
  res.sendFile(path.join(__dirname ,'/views/AddDoctor/index.html'));

})
app.get('/addIT_Manager', (req, res) => {
  res.sendFile(path.join(__dirname ,'/views/AddIT_Manager/index.html'));
})
//---------------
app.get('/addReceptionist', (req, res) => {
  res.sendFile(path.join(__dirname ,'/views/AddReceptionist/index.html'));
})
//--------------

app.post('/adddoctor', encodeUrl, (req, res) => {
    var firstName = req.body.name;
    var mobile = req.body.mobile;
    var userName = req.body.Username;
    var city=req.body.city;
    var street=req.body.street;
    var buildingNo=req.body.buildingNo;
    const DPassword = req.body.password;
    var specialization=req.body.specialization;
    var gender;
    var male=req.body.Male;
    var female=req.body.Female;
  
  if (male) {
      gender = "Male";
  } 
  else if (female) {
      gender = "Female";
  } 
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(`INSERT INTO doctor (FName, gender, username, password, specialization, mobile, city, street, buildingNo)
        VALUES 
          ('${firstName}', '${gender}', '${userName}', '${DPassword}', '${specialization}', '${mobile}', '${city}', '${street}', '${buildingNo}');`
          , function (err, result, fields) {
          if (err) throw err;
        });
      });
      res.redirect('/homePageIT_Manager');
});
app.post('/addIT_Manager', encodeUrl, (req, res) => {
    var firstName = req.body.name;
    var userName = req.body.Username;
    const DPassword = req.body.password;
    var mobile = req.body.mobile;
    var gender;
    var male=req.body.Male;
    var female=req.body.Female;
  
  if (male) {
      gender = "Male";
  } 
  else if (female) {
      gender = "Female";
  } 
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(`INSERT INTO IT_Manager (FName,  username, password, mobile,gender)
        VALUES 
          ('${firstName}','${userName}', '${DPassword}',  '${mobile}','${gender}');`
          , function (err, result, fields) {
          if (err) throw err;
        });
      });
      res.redirect('/homePageIT_Manager');
});


//----------------
app.post('/addReceptionist', encodeUrl, (req, res) => {
  var firstName = req.body.name;
  var userName = req.body.Username;
  const DPassword = req.body.password;
  var mobile = req.body.mobile;
  var gender;
  var male=req.body.Male;
  var female=req.body.Female;

if (male) {
    gender = "Male";
} 
else if (female) {
    gender = "Female";
} 
  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query(`INSERT INTO Receptionist (FName,  username, password, mobile,gender)
      VALUES 
        ('${firstName}','${userName}', '${DPassword}',  '${mobile}','${gender}');`
        , function (err, result, fields) {
        if (err) throw err;
      });
    });
    res.redirect('/homePageIT_Manager');
});
//-------------


var patient_ID;
app.post('/addpatient', encodeUrl, (req, res) => {
  var firstName = req.body.FName;
  var gender;
  var male=req.body.Male;
  var female=req.body.Female;
  var weight=req.body.weight;
  var buildingNo=req.body.buildingNo;
  var mobile = req.body.mobile;
  var city=req.body.city;
  var birthDate=req.body.birthDate;
  var street=req.body.street;
  const doctor = req.body['doctor-list'];

if (male) {
  gender = "Male";
} 
else if (female) {
  gender = "Female";
} 
  
  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query(`INSERT INTO patient (FName, gender, weight, birthDate, mobile, city, street, buildingNo,doctor_id,room_id)
        VALUES 
          ('${firstName}', '${gender}', '${weight}', '${birthDate}', '${mobile}', '${city}', '${street}', '${buildingNo}',(select ID from doctor where FName='${doctor}'), 0 );`
          , function (err, result, fields) {
            
        if (err) throw err;
        con.query(`SELECT * FROM patient WHERE FName = '${firstName}' AND birthDate = '${birthDate}' AND mobile = '${mobile}'`
        , function (err, result2, fields) {
          if (err) throw err;
  
        req.session.authenticated = true;
        req.session.patientID = result2[0].ID;
        patient_ID=result2[0].ID;
       
         res.redirect(`/addPatientHealthQuestionnaire?id=${result2[0].ID}`);
        // res.redirect(`selectRoom`);

      });
    });
    });
});
const invalidSeats = [2, 3, 5, 8, 13, 15, 18];

app.get('/selectRoom', (req, res) => {
  const ID = req.query.id;

  con.query(`SELECT room_id FROM patient;`, function (err, result, fields) {
    if (err) throw err;

    // Convert the JSON result to an array of integers
    const invalidRooms = result.map(row => row.room_id);

    console.log(invalidRooms);

    res.render('PatientsRooms/index', { IRooms: invalidRooms });
  });
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/selectRoom', (req, res) => {
  const selectedSeat = req.body.seatNumber;
  const patientID = req.session.patientID;
  console.log(`Selected seat: ${selectedSeat}`);
  console.log(`Patient ID: ${patientID}`);

  // Update the patient table with the selected seat number
  con.query(`UPDATE patient SET room_id = '${selectedSeat}' WHERE ID = ${patientID}`, function(err, result) {
    if (err) throw err;

    console.log(`${result.affectedRows} row(s) updated.`);
  console.log(req.session.role);
  if(req.session.role=='receptionist'){
    console.log("redirect to it receptionist")
    res.redirect('/homePagereceptionist');
  }
  if(req.session.role=='IT_Manager'){
    console.log("redirect to it manage")
    res.redirect('/homePageIT_Manager');
  }
  
  
  });
});


//this post method performed after selecting the room
app.post('/goToHomePageFromSelectSeat', (req, res) => {
   console.log(req.session.role);
  if(req.session.role=='IT_Manager'){
    console.log("redirect to it manage")
    res.redirect('/homePageIT_Manager');
  }
  if(req.session.role=='receptionist'){
    console.log("redirect to it receptionist")
    res.redirect('/homePageReceptionist');
  }
  
});





//----------------------
  app.get('/addPatientHealthQuestionnaire', (req, res) => {
    res.sendFile(path.join(__dirname ,'/views/Patient Health Questionnaire/index.html'));
  })

app.post('/addPatientHealthQuestionnaire', encodeUrl, (req, res) => {
  var patientId=patient_ID;
  var bloodpressure = req.body.bloodpressure;
  var diabetes=req.body.diabetes;
  var heartdisease=req.body.heartdisease;
  var allergies=req.body.allergies;
  var pregnant=req.body.pregnant;
  
  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query(`INSERT INTO patient_status (patient_id, bloodpressure, diabetes, heartdisease, pregnant, allergies)
           VALUES (${patientId}, '${bloodpressure}', '${diabetes}', '${heartdisease}', '${pregnant}', '${allergies}')`,
           function (err, result, fields) {
               if (err) throw err;
           });
    });
    req.session.authenticated = true;
    
      res.redirect(`selectRoom?id=${patient_ID}`);

});


app.post('/LoginDoctor',(req,res)=>{
  res.sendFile(path.join(__dirname ,"/views/Login_as_doctor/index.html"))
})

app.post('/LoginReceptionist',(req,res)=>{
  res.sendFile(path.join(__dirname ,"/views/Login_as_doctor/index.html"))
})
app.post('/LoginIT_Manager',(req,res)=>{
  res.sendFile(path.join(__dirname ,"/views/Login_as_IT_Manager/index.html"))
 
})


app.post("/Login", encodeUrl, (req, res) => {
  var UserName = req.body.name;
  var Password = req.body.password;
  con.connect(function (err) {
    if (err) {
      console.log(err);
    }
    con.query(
      `SELECT * FROM Doctor WHERE username = '${UserName}' AND password = '${Password}'`,
      function (err, result) {
        if (result && result[0]) {
          req.session.authenticated = true;
          req.session.doctorID = result[0].ID;
          req.session.role='doctor';
          console.log(req.session.role);
          res.redirect('/homePageDoctor');
        } else {
        //  console.log('here login receptionist');
          con.query(
            `SELECT * FROM receptionist WHERE username='${UserName}' AND password='${Password}'`,
            function (err, result) {
              if (result && result[0]) {
                req.session.role='receptionist';
                console.log(req.session.role);
                res.redirect(`/HomePageReceptionist`);
              } else {
               // console.log('here login nurse');
                con.query(
                  `SELECT * FROM nurse WHERE username='${UserName}' AND password='${Password}'`,
                  function (err, result) {
                    if (result && result[0]) {
                      req.session.nurseID = result[0].id;
                      req.session.role='nurse123';
                      console.log(req.session.role);
                      res.redirect(`/homePageNurse`);
                    } else {
                   //   console.log('here login IT Manager');
                      con.query(
                        `SELECT * FROM IT_Manager WHERE username='${UserName}' AND password='${Password}'`,
                        function (err, result) {
                          if (result && result[0]) {
                            req.session.authenticated = true;
                            req.session.role='IT_Manager';
                            console.log(req.session.role);
                            res.redirect('/homePageIT_Manager');
                          } else {
                            res.send('Username or Password is incorrect!');
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
        if (err) {
          console.log(err);
        }
      }
    );
  });

});
app.post('/LoginNurse',(req,res)=>{
  res.sendFile(path.join(__dirname ,"/views/Login_as_IT_Manager/index.html"))
})
   

app.post('/NewMeasureFornurse', encodeUrl, (req, res) => {
  client.publish('M11', 's');
  
  var ID=req.body.patientID;
  ID_patient_forMeasure=ID;
  
  // delay of 200ms
  setTimeout(() => {
    con.query(`SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, p.city, p.street, p.buildingNo, doctor.FName as assigned_doctor 
    FROM patient as p 
    JOIN doctor ON p.doctor_id = doctor.ID
    WHERE p.ID = '${ID}';`,
    function (error, results1, fields) {
      if (error) throw error;
      con.query(`select * from patient_situation where patient_id='${ID}'`,(err,result2)=>{
        if (err) throw err;
      con.query(`select * from healthIndicator where patient_id= '${ID}';`,function (err,result,filed){
        if(err) throw err;

        res.render('HomePage/PatientProfileFornurse',  {  patients: results1, situations: result2 ,health: result,showMeassure:true,roomId:25});
      })
    });
    });
  }, 800);
});


app.get('/addnurse', (req, res) => {
  con.query('SELECT FName FROM patient', (error, results) => {
    if (error) throw error;

    res.render('Addnurse/index', { patient: results });
  });
});
app.post('/addnurse', encodeUrl, (req, res) => {
  var Name = req.body.FName;
    var userName = req.body.Username;
    var gender;
   var phone = req.body.mobile;
   var floor=req.body.floor;
    const Password = req.body.password;
    var male=req.body.Male;
    var female=req.body.Female;
    const patient = req.body['doctor-list'];
  console.log('floor = '+ floor)
if (male) {
  gender = "Male";
} 
else if (female) {
  gender = "Female";
} 
  
  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query(`INSERT INTO nurse (Name, username, password,phone, gender,floor)
        VALUES  
          ('${Name}', '${userName}', '${Password}', '${phone}','${gender}','${floor}');`
          , function (err, result, fields) {
        if (err) throw err;
      });
    });
    req.session.authenticated = true;
    res.redirect('/homePageIT_Manager');
});





// app.post('/NewMeasure', encodeUrl, (req, res) => {
//   var ID=req.body.patientID;

//   // subscribe to the MQTT topic
//   client.subscribe('my', function (err) {
//     if (err) {
//       console.log('Error:', err);
//       res.status(500).send('Failed to subscribe');
//     } else {
//       console.log("Subscribed to topic 'my'");
//       // send the message after subscribing
//       client.publish('my', 'start measure');
//     }
//   });

//   // handle the MQTT message
//   client.on('message', function (topic, message) {
//     // parse the JSON data received from MQTT
//     const data = JSON.parse(message.toString());
//     console.log("Received data:", data);

//     // insert the data into the database
//     con.connect(function(err) {
//       if (err) throw err;
//       console.log("Connected!");
      
//       con.query(`INSERT INTO healthIndicator (temp,heartRate,oxygenRate) VALUES ('${data.temp}','${data.bpm}','${data.spo2}');`,
//         function (err, result, fields) {
//           if (err) throw err;
//           console.log("Data inserted successfully");
          
//           // render the HTML template with the data received from MQTT
//           con.query(`SELECT p.ID, p.FName, p.gender, p.birthDate, p.weight, p.mobile, p.city, p.street, p.buildingNo, doctor.FName as assigned_doctor 
//             FROM patient as p 
//             JOIN doctor ON p.doctor_id = doctor.ID
//             WHERE p.ID = '${ID}';`,
//             function (error, results1, fields) {
//               if (error) throw error;


//               res.render('HomePage/PatientProfileForDoctor', { patients: results1 });
//             });
//         });
//     });
//   });
// });





app.post('/direction', function(req, res) {
  const direction = req.body.direction;
  client.publish('motion', direction);
  res.sendStatus(200);
});


app.post('/PatientProfileForDoctor', (req, res) => {
  var ID = req.body.patientID ;
  req.session.ID_patient_forMeasure=ID;
  res.redirect(`/PatientProfileForDoctor?id=${ID}`);
  
});

app.post('/PatientProfileForNurse', (req, res) => {
  var ID = req.body.patientID ;
  var nurseID=req.body.nurseID;
  var patientID=req.body.patientID;
  req.session.ID_patient_forMeasure=ID;
  const currentDate = new Date().toISOString().slice(0, 10); // get current date in ISO format
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // get current time in 24-hour format


  con.query(`insert into N_monitor_P (date, time, nurse_id, patient_id) values ('${currentDate}', '${currentTime}', '${nurseID}', '${patientID}');`)
  res.redirect(`/PatientProfileForNurse?id=${ID}`);
  
});

app.post('/LogOut', (req, res) => {
  res.redirect(`/`);
  
});



 
 

app.post('/AddNewSituation', (req, res) => {
  var ID=req.body.patientID;
  var situation=req.body.situation;
  var medicine=req.body.medicine;
//INSERT INTO patient_situation (Situation, Medicine, patient_id) VALUES ('hard situation', 'take whatever you need', 13);
const currentDate = new Date().toISOString().slice(0, 10); // get current date in ISO format
const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // get current time in 24-hour format

  con.query(`insert into patient_situation (Situation,Medicine,patient_id,date, time ) values( "${situation}",  "${medicine}",${ID} ,'${currentDate}', '${currentTime}' ) ;`, 

  function (error, results, fields) {
    if (error) throw error;
    res.redirect(`/PatientProfileForDoctor?id=${ID}`);
    
  });

  });
  app.post('/edit-medicine', (req, res) => {
    var situationID = req.body.situation_id;
    var medicine = req.body.medicine;
    var patientID = req.body.patientID;
    const currentDate = new Date().toISOString().slice(0, 10); // get current date in ISO format
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // get current time in 24-hour format
  
    con.query(`UPDATE patient_situation SET medicine = '${medicine}', date = '${currentDate}', time = '${currentTime}' WHERE id = ${situationID};`, function (error, results, fields) {
      if (error) throw error;
      req.session.ID_patient_forMeasure=patientID;
      res.redirect(`/PatientProfileForDoctor?id=${patientID}`);
    });
  });
  
  app.post('/edit-floor', (req, res) => {
    var nurseID = req.body.nurse_id;
    var floor = req.body.floor;
    var patientID = req.body.patientID;
   
    con.query(`UPDATE nurse SET floor = '${floor}' WHERE id = ${nurseID};`, function (error, results, fields) {
      if (error) throw error;
      res.redirect(`/HomePageReceptionist`);
    });
  });
  
  // Delete a patient situation
app.post('/delete-situation', (req, res) => {
  var situationID = req.body.situation_id;
  var patientID = req.body.patientID;

  con.query(`DELETE FROM patient_situation WHERE id = ${situationID};`, function (error, results, fields) {
    if (error) throw error;
    res.redirect(`/PatientProfileForDoctor?id=${patientID}`);
  });
});


server.listen(3000)