const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    
    var filelocation = path.join( exports.dataDir, id+'.txt');
    // console.log(filelocation, 'filelocation');  
    fs.writeFile(filelocation, text, (err) => {
      if (err) {
        throw err;
        return;
      } else {
        callback(null, {id, text});
      }
    });
    // callback(null, { id, text });
  });
  // items[id] = text;

};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, function(error, items) {
    if (error) {
      throw error;
      return;
    } else {
      var data = [];
      // console.log('These are the items:', items);
      _.each(items, (item) => {
        data.push({ id: item.split('.')[0], text: item.split('.')[0] });
      });
      callback(null, data);
    }

  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
