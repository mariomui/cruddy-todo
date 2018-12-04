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
      _.each(items, (item) => {
        data.push({ id: item.split('.')[0], text: item.split('.')[0] });
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, function(error, items) {
    if(!items.includes(id + '.txt')) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      for(let i = 0; i < items.length; i++) {
        const currElem = items[i];
        if(currElem.split('.')[0] === id) {
          var theLocat = exports.dataDir+'/'+currElem;
          fs.readFile(theLocat, function(error, readTodo) {            
            var todo = {
              id: id,
              text: readTodo.toString()
            };
            var flag = false;
            callback(null, todo);
          });
        }  
      }
    }     
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, function(error, items) {
    if(!items.includes(id + '.txt')) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      for(let i = 0; i < items.length; i++) {
        const currElem = items[i];
        if(currElem.split('.')[0] === id) {
          var theLocat = exports.dataDir+'/'+currElem;
          fs.writeFile(theLocat, text, (err, todo) => {
            // console.log('text:', text);
            if(err) {
              throw ('error writing file');
            } else {
              fs.readFile(theLocat, (err, todo) => {
                callback(null, todo.toString());
              });
            }

          });
        }
      }
    }
  });
}

exports.delete = (id, callback) => {

  //if readthefile and it's not there error fs.readFile
  //if on success delete file fs.
  
  var pathname = path.join(exports.dataDir,id + '.txt');
  fs.readFile( pathname, (err, file) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
      return;
    }
    fs.unlink(pathname, (err) => {
      if (err) {
        throw err;
      }
      callback(null);
    });
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
