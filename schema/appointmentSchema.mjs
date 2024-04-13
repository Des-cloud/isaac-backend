import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  isPhysician: {
    type: Boolean,
    required: true
  },
});

const appointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1
  },
  patient: {
    type: userSchema,
    required: true
  },
  physician: {
    type: userSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  serviceName: {
    type: "String", 
  },
  serviceCharge: {
    type: "String", 
  },
});

export default mongoose.model("Appointment", appointmentSchema);

// export default async function createAppointmentSchema(conn) {
//   await conn.model('Appointment', appointmentSchema);
//   // console.log('Appointments collection using schema was created.');
// }













// export default async function createAppointmentSchema(conn) {
//   await conn.db("medicus").createCollection("appointments", {
//     validator: {
//       $jsonSchema: {
//         bsonType: "object",
//         title: "appointments",
//         additionalProperties: false,
//         properties: {
//           _id: {
//             bsonType: "objectId"
//           },
//           title: {
//             bsonType: ["string"],
//             minLength: 1,
//             description: "Title of appointment."
//           },
//           patient: {
//             bsonType: ["object"],
//             description: "Username of patient."
//           },
//           physician: {
//             bsonType: ["object"],
//             minLength: 1,
//             description: "Username of physician."
//           },
//           status: {
//             enum: ["Pending", "Accepted", "Rejected", "Completed"],
//             description: "Status of appointment."
//           },
//           startTime: {
//             bsonType: ["date"],
//             description: "Start time of appointment."
//           },
//           endTime: {
//             bsonType: ["date"],
//             description: "End Time of appointment."
//           },
//           description: {
//             bsonType: ["string"],
//             description: "Description of appointment."
//           },
//           chatId: {
//             bsonType: ["objectId", null],
//             description: "Associated Chat Id for the appointment."
//           }
//         },
//         required: ["title", "patient", "physician", "status", "startTime", "endTime", "description"]
//       }
//     },
//     validationLevel: "strict",
//     validationAction: "error"
//   })

//   // console.log(`Appointments collection using schema was created.`)
// }
