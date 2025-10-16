const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const comments = sequelize.define("comments", {
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    return comments;
}