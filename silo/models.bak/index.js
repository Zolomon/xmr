(function() {
  "use strict";

  var fs = require("fs"),
      path = require("path"),
      Sequelize = require("sequelize"),
      env = process.env.NODE_ENV || "development",
      config = require(__dirname + '/../../config/config.json')[env],
      sequelize = new Sequelize(config.database, config.username, config.password, config),
      db = {};

  fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0)  && (file !== "index.js");
  })
  .forEach(function(file) {
    debugger;
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

  Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  // fs
  // .readdirSync(__dirname)
  // .filter(function(file) {
  //   return (file.indexOf(".") !== 0) && (file !== "index.js");
  // })
  // .forEach(function(file) {
  //   // var model = sequelize["import"](path.join(__dirname, file));
  //   // db[model.name] = model;
  //   sequelize.import(__dirname, file);
  // });

  // // Object.keys(db).forEach(function(modelName) {
  // //   if ("associate" in db[modelName]) {
  // //     db[modelName].associate(db);
  // //   }
  // // });

  
  //debugger;

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  
  // //console.log(db);
  // console.log(config);
  // console.log(path.join(__dirname, '../data/data.db'));

  // console.log('LOADED SEQUELIZER');

  module.exports = db;
}());
