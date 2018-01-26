const co = require('co');
const Joi = require('joi');
// Get DB config
const db = require('../db-config');
// Validation processes
const validate = require('../validation');
const proAccess = require('../encrypt');
// Column list
const column_list = ["first_name","last_name","email","password"];
// Define table structure
const userTb = db.instance.define('users', {
  user_id: {
    type: db.Sequelize.INTEGER,
    primaryKey: true
  },
  first_name: db.Sequelize.STRING,
  last_name: db.Sequelize.STRING,
  email: {
    type: db.Sequelize.STRING,
    uniqueKey: true
  },
  password: db.Sequelize.TEXT
}, {
  timestamps: false
})

// Create routes with their functionality
const user = [
  // User login
  {
    method: 'POST',
    path:'/user/signin',
    config: validate({
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required()
      }
    }, false).config,
    handler: function (req, h) {
      return co(function*() {
        return yield userTb.findOne({
          where: {
            email: req.payload.email,
            password: proAccess.basicEnc(req.payload.signin_pass)
          },
          plain: true
        }).then(function(user_data){
          if (user_data == null || Object.keys(user_data).length === 0) {
            return {
              success: false,
              message: "User was not found."
            };
          } else {
            tokenSigned = proAccess.encrypt(user_data.user_id+":"+user_data.email);
            return {
              success: true,
              message: "You have successfully signed in.",
              user: user_data,
              token: tokenSigned
            };
          }
        }).catch(function(error){
          console.log("Error: "+error);
          return {
            success: false,
            message: "There was an error adding user."
          }
        });
      });
    }
  },

  // Get a user
  {
    method: 'GET',
    path:'/user',
    config: validate().config,
    handler: function (request, h) {
      return {
        type: 'user'
      };
    }
  },

  // Add a user
  {
    method: 'POST',
    path:'/user/add',
    config: validate({
      payload: {
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
      }
    }, false).config,
    handler: function (req, h) {
      let payload = req.payload;

      return co(function*() {
        return yield userTb.create({
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: payload.email,
          password: proAccess.basicEnc(payload.signin_pass)
        },{
          isNewRecord: true
        }).then(function(response){
          console.log("Added User: "+response);
          return {
            success: true,
            message: "User has been added."
          }
        }).catch(function(error){
          console.log("Error: "+error);
          return {
            success: false,
            message: "There was an error adding user."
          }
        });
      });
    }
  },

  // Update a user
  {
    method: 'POST',
    path:'/user/update',
    config: validate().config, 
    handler: function (req, h) {
      let payload = req.payload;

      // Check if all information is provided
      if (payload != null) {

        let item_found = false;
        let update_data = {};

        for (let key in payload) {
          if (column_list.includes(key)) {
            // Valid value found
            item_found = true;
            let value = payload[key];
            // Encrypt if password
            if (key == "signin_pass") {
              value = proAccess.basicEnc(value);
            }
            // Add to update data
            update_data[key] = value;
          }
        }

        if (item_found) {
          return co(function*() {
            return yield userTb.update(update_data, {
              where: {
                user_id: payload.user_id
              },
              limit: 1,
              silent: true
            }).then(function(response){
              console.log("Updated User: "+response);
              return co(function*() {
                return yield userTb.findOne({
                  where: {
                    user_id: payload.user_id
                  },
                  plain: true
                }).then(function(user_data){
                  return {
                    success: true,
                    message: "User has been added.",
                    user: user_data
                  }
                }).catch(function(error){
                  console.log("Error: "+error);
                  return {
                    success: true,
                    message: "There was an error retrieving user data.",
                    user: null
                  }
                });
              });
            }).catch(function(error){
              console.log("Error: "+error);
              return {
                success: false,
                message: "There was an error updating user."
              }
            });
          });
        } else {
          return {
            success: false,
            message: "Values provided are not acceptable."
          };
        }
      } else {
        return {
          success: false,
          message: "Missing values."
        };
      }
    }
  }
]

module.exports = user;