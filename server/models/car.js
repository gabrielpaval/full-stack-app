module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Cars', {
      brand_name: {
        type: DataType.TEXT,
        allowNull: false
      },
      model_name: {
        type: DataType.TEXT,
        allowNull: false
      },
      year: {
        type: DataType.INTEGER,
        allowNull: false
      },
      cilindrical_capacity: {
        type: DataType.INTEGER,
        allowNull: false
      },
      tax: {
        type: DataType.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: true
    });
    return model;
  };
  