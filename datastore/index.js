const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counter) => {
    let id = counter;

    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      callback(err, { id, text })});
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('I failed');
    } else {
      var data = _.map(files, (text) => {
        text = text.slice(0, -4);
        let id = text;
        return { id, text };
      });

      callback(null, data);
    }
  })

};

exports.readOne = (id, callback) => {
  fs.readFile (`${exports.dataDir}/${id}.txt`, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {

  // fs.readFile
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, oldText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      // callback(null, { id, text });
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        callback(err, { id, text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log('file deleted');
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
