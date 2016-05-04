'use strict';

// Test specific configuration
// ===========================
module.exports = {
  sequelize: {
    uri: 'postgres://',
    options: {
      logging: false,
      define: {
        timestamps: false
      }
    }
  }
};
