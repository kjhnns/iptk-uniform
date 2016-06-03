'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Submission', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    file: DataTypes.STRING,
    status: DataTypes.INTEGER,
    keywords: DataTypes.STRING,
    abstract: DataTypes.STRING

  });
}
