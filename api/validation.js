const access = require('./access-keys');
const proAccess = require('./encrypt');

module.exports = function(validate_ext = {}, secure = true) {
  // Validation for headers
  let headers = {
    headers: function (value, options) {
      console.log(secure);
      if (secure) {
        if (proAccess.decrypt(value['api-key'])) {
          return true;
        } else {
          let error = new Error("You do not have access.");
          throw error;
        }
      } else {
        return true;
      }
    },
    failAction: async (request, h, err) => {
      throw err;
    }
  };
  // Merge with additional validation
  let complete_validate = Object.assign({}, headers, validate_ext);
  // Return validation object
  return {
    config: {
      auth: false,
      validate: complete_validate
    }
  }
}