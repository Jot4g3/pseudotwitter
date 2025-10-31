module.exports = (sequelize, DataTypes) => {
    const comments = sequelize.define("comments", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    });

    comments.associate = (models) => {
        comments.belongsTo(models.posts, {
            allowNull: false,
            foreignKey: 'postId',
            onDelete: 'CASCADE'
        });
        comments.belongsTo(models.users, {
            allowNull: false,
            foreignKey: 'userId',
            onDelete: 'NO ACTION'
        });
    };

    return comments;
}   