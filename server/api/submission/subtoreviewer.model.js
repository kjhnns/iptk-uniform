'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('SubToReviewer', {
  	 subId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
  	 userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true
    }
  });
}





