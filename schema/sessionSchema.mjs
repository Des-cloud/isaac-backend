import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    description: "Username of current user."
  },
  startTime: {
    type: Date,
    required: true,
    description: "Start time"
  }
}, {
  collection: 'sessions',
  strict: true,
  validateBeforeSave: true
});

export default mongoose.model('Session', sessionSchema);















// export default async function createSessionSchema(conn) {
//   await conn.db("medicus").createCollection("sessions", {
//     validator: {
//       $jsonSchema: {
//         bsonType: "object",
//         title: "sessions",
//         additionalProperties: false,
//         properties: {
//           _id: {
//             bsonType: "objectId"
//           },
//           username: {
//             bsonType: "string",
//             description: "Username of current user."
//           },
//           authToken: {
//             bsonType: "string",
//             description: "Authentication token for current user."
//           }
//         },
//         required: ["username", "authToken"]
//       }
//     },
//     validationLevel: "strict",
//     validationAction: "error"
//   })

//   // console.log(`Sessions collection using schema was created.`)
// }
