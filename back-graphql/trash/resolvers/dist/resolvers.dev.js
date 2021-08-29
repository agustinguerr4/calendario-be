'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _Ambiente = _interopRequireDefault(require("../models/Ambiente"));

var _Planta = _interopRequireDefault(require("../models/Planta"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _Query;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var resolvers = {
  Query: (_Query = {
    Users: function Users() {
      return regeneratorRuntime.async(function Users$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(_User["default"].find());

            case 2:
              return _context.abrupt("return", _context.sent);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, _defineProperty(_Query, "Users", function Users() {
    return _User["default"].find().populate('ambientes').then(function (users) {
      return users.map(function (user) {
        return user;
      });
    })["catch"](function (err) {
      throw err;
    });
  }), _defineProperty(_Query, "Ambientes", function Ambientes() {
    return _Ambiente["default"].find().populate('user plantas').then(function (ambientes) {
      return ambientes.map(function (ambiente) {
        return ambiente;
      });
    })["catch"](function (err) {
      throw err;
    });
  }), _defineProperty(_Query, "Plantas", function Plantas() {
    return _Planta["default"].find().populate('ambiente').then(function (plantas) {
      return plantas.map(function (planta) {
        return planta;
      });
    })["catch"](function (err) {
      throw err;
    });
  }), _Query),
  Mutation: {
    createUser: function createUser(_, args) {
      return _User["default"].findOne({
        email: args.input.email
      }).then(function (user) {
        if (user) {
          throw new Error('El usuario ya existe');
        }

        return _bcrypt["default"].hash(args.input.password, 12);
      }).then(function (hashedPass) {
        var user = new _User["default"]({
          email: args.input.email,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          age: args.input.age,
          password: hashedPass
        });
        return user.save();
      }).then(function (result) {
        return _objectSpread({}, result, {
          password: null
        });
      })["catch"](function (error) {
        throw error;
      });
    },
    createAmbiente: function createAmbiente(_, args) {
      var ambiente = new _Ambiente["default"]({
        nombre: args.input.nombre,
        tipo: args.input.tipo,
        tiempo: args.input.tiempo,
        fecha: new Date(args.input.fecha),
        user: "612a742aa2e826b985d2e139"
      });
      var ambienteCreado;
      return ambiente.save().then(function (result) {
        ambienteCreado = result;
        return _User["default"].findById('612a742aa2e826b985d2e139');
      }).then(function (user) {
        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        user.ambientes.push(ambiente);
        return user.save();
      }).then(function (result) {
        return ambienteCreado;
      })["catch"](function (err) {
        throw err;
      });
    },
    createPlanta: function createPlanta(_, args) {
      var now = new Date();
      var planta = new _Planta["default"]({
        nombre: args.input.nombre,
        origen: args.input.origen,
        etapa: args.input.etapa,
        fecha: now.toISOString(),
        ambiente: "612a763c09c0dd79276ee4ca"
      });
      var plantaCreada;
      return planta.save().then(function (result) {
        plantaCreada = result;
        return _Ambiente["default"].findById("612a763c09c0dd79276ee4ca");
      }).then(function (ambiente) {
        if (!ambiente) {
          throw new Error('Ambiente no encontrado');
        }

        ambiente.plantas.push(planta);
        return ambiente.save();
      }).then(function (result) {
        return plantaCreada;
      })["catch"](function (err) {
        throw err;
      });
    },
    deleteUser: function deleteUser(_, _ref) {
      var _id;

      return regeneratorRuntime.async(function deleteUser$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _id = _ref._id;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_User["default"].findByIdAndDelete(_id));

            case 3:
              return _context2.abrupt("return", _context2.sent);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    updateUser: function updateUser(_, _ref2) {
      var _id, input;

      return regeneratorRuntime.async(function updateUser$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _id = _ref2._id, input = _ref2.input;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_User["default"].findByIdAndUpdate(_id, input, {
                "new": true
              }));

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      });
    },
    deleteAmbiente: function deleteAmbiente(_, _ref3) {
      var _id;

      return regeneratorRuntime.async(function deleteAmbiente$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _id = _ref3._id;
              _context4.next = 3;
              return regeneratorRuntime.awrap(_Ambiente["default"].findByIdAndDelete(_id));

            case 3:
              return _context4.abrupt("return", _context4.sent);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      });
    },
    updateAmbiente: function updateAmbiente(_, _ref4) {
      var _id, input;

      return regeneratorRuntime.async(function updateAmbiente$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _id = _ref4._id, input = _ref4.input;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_Ambiente["default"].findByIdAndUpdate(_id, input, {
                "new": true
              }));

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      });
    },
    deletePlanta: function deletePlanta(_, _ref5) {
      var _id;

      return regeneratorRuntime.async(function deletePlanta$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _id = _ref5._id;
              _context6.next = 3;
              return regeneratorRuntime.awrap(_Planta["default"].findByIdAndDelete(_id));

            case 3:
              return _context6.abrupt("return", _context6.sent);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      });
    },
    updatePlanta: function updatePlanta(_, _ref6) {
      var _id, input;

      return regeneratorRuntime.async(function updatePlanta$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _id = _ref6._id, input = _ref6.input;
              _context7.next = 3;
              return regeneratorRuntime.awrap(_Planta["default"].findByIdAndUpdate(_id, input, {
                "new": true
              }));

            case 3:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  }
};
exports.resolvers = resolvers;