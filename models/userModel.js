const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/databaseConfig');

const etnies = ['mestizo', 'negro', 'blanco'];
const gender = ['femenino', 'masculino'];
const civilStatus = ['casado', 'divorciado', 'soltero'];
const bloodType = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];
const country = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];
const province = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];
const city = ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'];

const UserSchema = mongoose.Schema({
  ced: {
    type: String,
    required: [true, 'Numero de cedula requerido'],
    unique: [true, 'Numero de cedula ya se encuentra registrado'],
   // validate: validateCed(ced)
  },
  password:{
    type: String,
    required: [true, 'Contrasena requerida'],
    minlength:[6, 'Contrasena muy corta']
  },
  names: {
    type: String,
    required: [true, 'Nombre de usuario requerido']
  },
  lastNames: {
    type: String,
    required: [true, 'Apellido de usuario requerido']
  },
  civilStatus: {
    type: String,
    enum: civilStatus
  },
  birthDate: {
    type: Date
  },
  gender: {
    type: String,
    //validate: validateGender(gender) // enum?
    enum: gender
  },
  etnie: {
    type: String,
    // validate: validateEtnie(etnie) // enum?
    enum: etnies
  },
  bloodType: {
    type: String,
    enum: bloodType
  },
  disability: { type: Boolean },
  contactPhone1: { type: String, minlength: 6 },
  contactPhone2: { type: String, minlength: 6 },
  email: {
    type: String,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    lowercase: true,
    minlength: 6
  },
  residenceCountry: { type: String },
  residenceProvince: { type: String },
  residenceCity: { type: String },
  parish: { type: String },
  address: { type: String },
  addressReference: { type: String },
  postalCode: { type: String },
  birthCountry: { type: String },
  birthProvince: { type: String },
  birthCity: { type: String },
  updated: {
    type: Date,
    default: Date.now
  }
  //TODO AGREGAR MAS CAMPOS DE INFORMACION USUARIO
});

const User = (module.exports = mongoose.model('User', UserSchema));

module.exports.getUserByCed = function(ced, callback) {
  const query = {
    ced: ced
  };
  User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, hash) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
