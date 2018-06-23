
module.exports = function(sequelize, DataTypes) {
  const Tweet =  sequelize.define('tweet', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    tweet_id: {
      type: DataTypes.INTEGER(11)
    },
    user_id: {
      type: DataTypes.INTEGER(11)
    },
    user_screen_name: {
      type: DataTypes.TEXT
    },
    user_followers: {
      type: DataTypes.INTEGER(11)
    },
    user_following: {
      type: DataTypes.INTEGER(11)
    },
    user_profile_description: {
      type: DataTypes.TEXT
    },
    keyword: {
      type: DataTypes.TEXT
    },
    tweet_text: {
      type: DataTypes.TEXT
    }
  },{
    timestamps: true,
    underscored: true, // force createdAt, updatedAt => created_at, updated_at
    tableName: 'tweet',
    instanceMethods: {
      print: () => {
        console.log("sup")
      }
    }
  });

  Tweet.associate = (models) => {
    Tweet.sync({force: true})
  }

  return Tweet;
};