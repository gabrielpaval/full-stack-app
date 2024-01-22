module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Persons', {
      last_name: {
        type: DataType.TEXT,
        allowNull: false
      },
      first_name: {
        type: DataType.TEXT,
        allowNull: false
      },
      cnp: {
        type: DataType.TEXT,
        allowNull: false
      },
      age: {
        type: DataType.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: true
    });
   
    return model;
  };
  