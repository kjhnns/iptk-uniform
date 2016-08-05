'use strict';

export default function(sequelize, DataTypes) {
    return sequelize.define('Submission', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        file: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
            validate: {
                isUrl: true
            }
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 4,
                isNumeric: true
            }
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        keywords: DataTypes.STRING,
        abstract: DataTypes.STRING
    }, {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
}
