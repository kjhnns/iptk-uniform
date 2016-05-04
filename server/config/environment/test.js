'use strict';

// Test specific configuration
// ===========================
module.exports = {
  sequelize: {
    uri: process.env.SEQUELIZE_URI ||
         'postgres://user:pass@localhost:5432/user',
    options: {
      logging: false,
      define: {
        timestamps: false
      }
    }
  }
};
