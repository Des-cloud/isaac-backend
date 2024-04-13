import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    description: "Username of user for sign in. Must be unique.",
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    description: "Password of user for sign in.",
  },
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    description: "First name of the user.",
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    description: "Last name of the user.",
  },
  description: {
    type: String,
    description: "About me.",
  },
  dob: {
    type: Date,
    description: "Date of Birth.",
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    description: "Gender of user.",
  },
  emailId: {
    type: String,
    description: "Email ID of user.",
  },
  phoneNumber: {
    type: String,
    description: "Phone Number of user.",
  },
  isPhysician: {
    type: Boolean,
    required: true,
    description: "Is user a physician?",
  },
  qualification: {
    type: String,
    required: function () {
      return this.isPhysician;
    },
    description: "Qualification if user is a physician.",
  },
  specialization: {
    type: String,
    required: function () {
      return this.isPhysician;
    },
    description: "Specialization if user is a physician.",
  },
});

export default mongoose.model("User", UserSchema);

// UserSchema.set('collection', 'users');

// UserSchema.index({ username: 1 }, { unique: true });

// const UserModel = mongoose.model('User', UserSchema);

// async function createUserSchema() {
//   try {
//     await UserModel.init();
//     // console.log('Users collection using schema was created.');
//   } catch (error) {
//     console.error(error);
//   }
// }

// module.exports = { UserSchema, UserModel, createUserSchema };

// export default async function createUserSchema(conn) {
//   await conn.db("medicus").createCollection("users", {
//     validator: {
//       $jsonSchema: {
//         bsonType: "object",
//         title: "users",
//         additionalProperties: false,
//         properties: {
//           _id: {
//             bsonType: "objectId"
//           },
//           username: {
//             bsonType: ["string"],
//             minLength: 1,
//             description: "username of user for sign in. must be unique"
//           },
//           password: {
//             bsonType: ["string"],
//             minLength: 1,
//             description: "password of user for sign in."
//           },
//           firstName: {
//             bsonType: ["string"],
//             minLength: 1,
//             description: "First name of the user."
//           },
//           lastName: {
//             bsonType: ["string"],
//             minLength: 1,
//             description: "Last name of the user."
//           },
//           dob: {
//             bsonType: ["date"],
//             description: "Date of Birth."
//           },
//           gender: {
//             enum: ["Male", "Female", "Other"],
//             description: "Gender of user."
//           },
//           emailId: {
//             bsonType: ["string"],
//             description: "Email ID of user."
//           },
//           phoneNumber: {
//             bsonType: ["string"],
//             description: "Phone Number of user."
//           },
//           isPhysician: {
//             bsonType: ["boolean"],
//             description: "Is user a physician?"
//           },
//           qualification: {
//             bsonType: ["string"],
//             description: "Qualification if user is a physician."
//           },
//           specialization: {
//             bsonType: ["string"],
//             description: "Specialization if user is a physician."
//           }
//         },
//         required: ["username", "password", "firstName", "isPhysician"],
//         dependencies: {
//           qualification: ["isPhysician"],
//           specialization: ["isPhysician"]
//         }
//       }
//     },
//     validationLevel: "strict",
//     validationAction: "error"
//   })

//   // console.log(`Users collection using schema was created.`)
//   await conn.db(process.env.DB_URI).collection("users")
//     .createIndex({ username: 1 }, { unique: true })

//   // console.log(`Added username Index to Users collection.`)
// }
