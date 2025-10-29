const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define("users", {
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
            onDelete: "cascade",
        });
    };

    return users;
};
