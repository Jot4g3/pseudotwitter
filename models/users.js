const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    users.associate = (models) => {
        users.hasMany(models.posts, {
            foreignKey: 'userId'
        });
    };

    return users;
};
