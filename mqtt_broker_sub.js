const mqtt=require("mqtt")
const express=require ("express");


const client = mqtt.connect('mqtt://localhost')
client.on('connect', () => {
  client.subscribe('my/topic')
  client.publish('my/topic','m444')
})

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`)
})


// //MQTT section  
// //---------------------------------------
// //const client=mqtt.connect('http://broker.hivemq.com');
// client.on('connect', () => {
//   client.subscribe('my', (err) => {
//     if (err) {
//       console.error('Error subscribing to topic my:', err);
//     } else {
//       console.log('Subscribed to topic: my');
//     }
//   });
//   client.subscribe('M11', (err) => {
//     if (err) {
//       console.error('Error subscribing to topic M11:', err);
//     } else {
//       console.log('Subscribed to topic: M11');
//     }
//   });
//   client.subscribe('motion', (err) => {
//     if (err) {
//       console.error('Error subscribing to topic motion:', err);
//     } else {
//       console.log('Subscribed to topic: motion');
//     }
//   });
  
// })

// client.on('message', (topic, message) => {
//   console.log(`Received message on topic '${topic}': ${message}`)
// })


// // const client2=mqtt.connect('http://broker.hivemq.com');

// // client2.on('connect', () => {
// //   client2.subscribe('my')
// // })

// // client2.on('message', (topic, message) => {
// //   console.log(`Received message on topic ${topic}: ${message}`)
// // })



