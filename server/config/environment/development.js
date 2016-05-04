'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    uri: process.env.SEQUELIZE_URI ||
         'postgres://user:pass@localhost:5432/user',
    options: {
      logging: false,
      define: {
        timestamps: false
      }
    }
  },

  // Seed database on startup
  seedDB: true

};
