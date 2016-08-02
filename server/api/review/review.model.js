'use strict';

export default function(sequelize, DataTypes) {
    return sequelize.define('Review', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        evaluation: DataTypes.STRING,
        expertise: DataTypes.STRING,
        strongpoints: DataTypes.STRING,
        weakpoints: DataTypes.STRING,
        summary: DataTypes.STRING,
        comment: DataTypes.STRING
    });
}
