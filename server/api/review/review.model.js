'use strict';

export default function(sequelize, DataTypes) {
    return sequelize.define('Review', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        evaluation: DataTypes.TEXT,
        expertise: DataTypes.TEXT,
        strongpoints: DataTypes.TEXT,
        weakpoints: DataTypes.TEXT,
        summary: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        submissionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
}
