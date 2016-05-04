'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.IP ||
          undefined,

  // Server port
  port:   process.env.PORT ||
          8080,

  sequelize: {
    uri:  process.env.SEQUELIZE_URI ||
          'postgres://',
    options: {
      logging: false,
      define: {
        timestamps: false
      }
    }
  }
};
