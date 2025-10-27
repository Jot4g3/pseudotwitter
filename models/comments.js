module.exports = (sequelize, DataTypes) => {
    const comments = sequelize.define("comments", {
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    });

    comments.associate = (models) => {
        comments.belongsTo(models.posts, {
            allowNull: false
        });
    };

    return comments;
}   