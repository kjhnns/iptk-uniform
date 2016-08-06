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
        summary: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        comment: {
            type: DataTypes.STRING,
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
        title: {
           type: DataTypes.STRING,
           allowNull: true
        }

    }, {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
}
