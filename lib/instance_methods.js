'use strict';

var find = require('lodash/collection/find'),
    filter = require('lodash/collection/filter'),
    forEach = require('lodash/collection/forEach'),
    remove = require('lodash/array/remove'),
    includes = require('lodash/collection/includes'),
    ace = global.ace,
    React = require('react'),
    ReactDOM = require('react-dom'),
    App = require('./components/app'),
    constants = require('./constants');

function createFileSession(item) {
  if (item.type === 'file') {
    if (item.session) {
      return item.session;
    }
    else {
      var fileLanguage = (constants.MODES[item.language] || item.language),
          session = new ace.EditSession(item.content, 'ace/mode/' + fileLanguage);

      session.$id = fileLanguage + '-' + item.name;
      session.setOptions({
        firstLineNumber: 1,
        indentedSoftWrap: true,
        newLineMode: "auto",
        overwrite: false,
        tabSize: 2,
        useSoftTabs: true,
        useWorker: true,
        wrap: "off",
        wrapMethod: "auto"
      });

      session.setUndoManager(new ace.UndoManager());
      session.setValue(item.content || '');
      session.setUseWrapMode(true);

      return session;
    }
  }
}

function addItem(newItem) {
  if (newItem.isVisible === undefined) {
    newItem.isVisible = true;
  }

  if (newItem.type === 'file') {
    newItem.session = createFileSession(newItem);
  }

  if (newItem.title === undefined) {
    newItem.title = newItem.name;
  }

  this.items.push(newItem);
}

function addFile(newFile) {
  newFile.type = 'file';
  newFile.session = createFileSession(newFile);

  this.addItem(newFile);
}

function addLibrary(newLibrary) {
  this.libraries.push(newLibrary);
}

function findItem(name) {
  return find(this.items, function(item) { return item.name === name; });
}

function findFile(name) {
  return find(this.items, function(item) { return item.type === 'file' && item.name === name; });
}

function hasLibrary(library) {
  return includes(this.libraries, library);
}

function removeLibrary(library) {
  remove(this.libraries, function(item) { return item === library; });
}

function toggleLibrary(library) {
  if (this.hasLibrary(library)) {
    this.removeLibrary(library);
  }
  else {
    this.addLibrary(library);
  }
}

function selectItem(item, index) {
  var activeItem = find(this.items, function(item) { return item.isActive });

  activeItem.isActive = false;
  item.isActive = true;

  if (item.type === 'file' && item.session && this.editor) {
    this.editor.setSession(item.session);
  }

  this.render();
}

function renameItem(item, newName) {
  item.title = item.name = newName;

  this.render();
}

function enableEditMode(item) {
  var otherItems = filter(this.items, function(itemInArray) { return itemInArray.isEditing; });
  forEach(otherItems, function(itemInArray) { itemInArray.isEditing = false; });
  item.isEditing = true;

  this.render();
}

function disableEditMode(item) {
  item.isEditing = false;

  this.render();
}

function addSidebarItems(paths, types, rootPath) {
  var sidebarItems = this.sidebarItems;

  if (rootPath) {
    rootPath.split('/').forEach(function(path) {
      sidebarItems = sidebarItems[path].files;
    });
  }

  forEach(paths, function(filePath, fileName) {
    var type = types[filePath],
        fileInfo;

    if (type) {
      fileInfo = {
        name: fileName,
        path: filePath,
        type: type
      };

      if (type.match('directory')) {
        fileInfo.files = {};
      }

      sidebarItems[fileName] = fileInfo;
    }
  });

  this.render();
}

function setStatus(status) {
  this.status = status;

  this.render();
}

function render() {
  if (this.element) {
    this.view = ReactDOM.render(React.createElement(App, { codeBasket: this }), this.element);
  }
}

function toString() {
  if (this.element) {
    var files = filter(this.items, function(item) { return item.type === 'file'; }),
        preElements;

    preElements = files.map(function(item) {
      var element = global.document.createElement('pre');

      element.dataset['language'] = item.language;
      element.dataset['name'] = item.name;

      element.textContent = item.session.getValue();

      return element.outerHTML;
    });

    if (preElements.length > 0) {
      preElements[0].dataset['libs'] = this.libraries.join(';');
    }

    return preElements.join('\n');
  }
}

module.exports = {
  addItem: addItem,
  addFile: addFile,
  addLibrary: addLibrary,
  removeLibrary: removeLibrary,
  hasLibrary: hasLibrary,
  toggleLibrary: toggleLibrary,
  findItem: findItem,
  findFile: findFile,
  selectItem: selectItem,
  renameItem: renameItem,
  enableEditMode: enableEditMode,
  disableEditMode: disableEditMode,
  addSidebarItems: addSidebarItems,
  render: render,
  setStatus: setStatus,
  toString: toString
};