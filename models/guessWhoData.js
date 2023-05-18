const Sequelize = require('sequelize');

class GuessWhoData extends Sequelize.Model{
  static init(sequelize){
    return super.init({
      name:{
        type:Sequelize.STRING(10),
        allowNull:false,
        unique:true
      },
      url:{
        type:Sequelize.STRING(100),
        allowNull:false,
        unique:true,
      }
    },{
      sequelize,
      timestamps:false,
      underscored:false,
      modelName:'guesswhodata',
      tableName:'guesswhodatas',
      paranoid:false,
      charset:'utf8',
      collate:'utf8_general_ci'
    })
  }
  static associate(db){}
};

module.exports = GuessWhoData;