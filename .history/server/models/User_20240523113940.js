const {Model, DataTypes} = require("sequelize");

module.exports = function(connection) {
    class User extends Model {};

    User.init ({
        email: {
            type: Datatypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password:,
        lastname: DataTypes.STRING
    }, {
        sequelize : connection, 
    })
}