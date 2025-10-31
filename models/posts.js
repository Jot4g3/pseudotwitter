const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const posts = sequelize.define("posts", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });

    // O onDelete deve ficar sempre no lado que possui a FK (lado N).
    // O Sequelize ignora onDelete no lado do hasMany.
    posts.associate = (models) => {
        posts.belongsTo(models.users, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        posts.hasMany(models.comments, {
            foreignKey: 'postId'
        });
    }

    return posts;
}