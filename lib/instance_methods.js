'use strict';

var find = require('lodash/collection/find'),
    filter = require('lodash/collection/filter'),
    forEach = require('lodash/collection/forEach'),
    pull = require('lodash/array/pull'),
    includes = require('lodash/collection/includes'),
    constants = require('./constants'),
    ace = global.ace;

var React = require('react'),
    ReactDOM = require('react-dom'),
    App = require('./components/app');

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
        newLineMode: 'auto',
        overwrite: false,
        tabSize: 2,
        useSoftTabs: true,
        useWorker: true,
        wrap: 'off',
        wrapMethod: 'auto'
      });

      session.setUndoManager(new ace.UndoManager());
      session.setValue(item.content || '');
      session.setUseWrapMode(true);

      var addSessionEvent = new global.CustomEvent('codebasket:addsession', {
        detail: {
          codeBasket: this,
          item: item,
          session: session
        }
      });

      window.dispatchEvent(addSessionEvent);

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

  if (newItem.id === undefined) {
    newItem.id = newItem.type + '-' + this.items.length;
  }

  this.items.push(newItem);

  return newItem;
}

function addFile(newFile) {
  newFile.type = 'file';
  newFile.session = createFileSession(newFile);

  return this.addItem(newFile);
}

function addFileAndOpen(newFile) {
  newFile.isVisible = true;

  this.addFile(newFile);
}

function addLibrary(newLibrary) {
  this.libraries.push(newLibrary);

  var addLibraryEvent = new global.CustomEvent('codebasket:addlibrary', {
    detail: {
      codeBasket: this,
      library: newLibrary
    }
  });

  global.dispatchEvent(addLibraryEvent);
}

function hasLibrary(library) {
  return includes(this.libraries, library);
}

function removeLibrary(library) {
  pull(this.libraries, library);

  var removeLibraryEvent = new global.CustomEvent('codebasket:removelibrary', {
    detail: {
      codeBasket: this,
      library: library
    }
  });

  global.dispatchEvent(removeLibraryEvent);
}

function toggleLibrary(library) {
  if (this.hasLibrary(library)) {
    this.removeLibrary(library);
  }
  else {
    this.addLibrary(library);
  }
}

function findItem(name) {
  return find(this.items, function(item) { return item.name === name; });
}

function findFile(name) {
  return find(this.items, function(item) { return item.type === 'file' && item.name === name; });
}

function selectItem(item, index) {
  var activeItem = find(this.items, function(itemInCollection) { return itemInCollection.isActive });

  if (activeItem !== item) {
    if (activeItem) {
      activeItem.isActive = false;
    }

    item.isActive = true;

    if (item.type === 'file' && item.session && this.editor) {
      this.editor.setSession(item.session);
      this.editor.focus();
    }
  }

  var tabSelectedEvent = new global.CustomEvent('codebasket:tabselected', {
    detail: {
      codeBasket: this,
      item: item,
      index: index
    }
  });

  global.dispatchEvent(tabSelectedEvent);

  this.render();

  if (activeItem && item) {
    var changeSessionEvent = new global.CustomEvent('codebasket:changesession', {
      detail: {
        codeBasket: this,
        oldSession: activeItem.session,
        newSession: item.session
      }
    });

    global.dispatchEvent(changeSessionEvent);
  }
}

function renameItem(item, newName) {
  var oldName = item.name,
      directory = oldName.split('/'),
      newDirectory = newName.split('/'),
      fileName = directory.pop(),
      newFileName = newDirectory.pop(),
      sidebarItems = this.findInSidebar(directory.join('/')),
      sidebarItem = sidebarItems[item.name];

  sidebarItem.name = newFileName;
  sidebarItem.path = newName;

  sidebarItems[newFileName] = sidebarItem;
  delete sidebarItems[item.name];

  item.title = item.name = newName;
  item.language = item.name.split('.').pop();
  item.session.setMode('ace/mode/' + (constants.MODES[item.language] || item.language));

  this.render();

  var renameItemEvent = new global.CustomEvent('codebasket:renameitem', {
    detail: {
      codeBasket: this,
      oldName: oldName,
      newName: newName
    }
  });

  global.dispatchEvent(renameItemEvent);
}

function removeItem(item) {
  pull(this.items, item);

  return item;
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
        fileInfo.isCollapsed = true;
      }

      sidebarItems[fileName] = fileInfo;
    }
  });

  this.render();
}

function findInSidebar(path) {
  var sidebarItems = this.sidebarItems;

  forEach(path.split('/'), function(pathPart) {
    if (sidebarItems[pathPart]) {
      if (sidebarItems[pathPart].files) {
        sidebarItems = sidebarItems[pathPart].files;
      }
      else {
        sidebarItems = sidebarItems[pathPart];
      }
    }
  });

  return sidebarItems;
}

function removeItemFromSidebar(path) {
  var directory = path.split('/'),
      fileName = directory.pop(),
      sidebarItems;

  directory = directory.join('/');
  sidebarItems = this.findInSidebar(directory);

  delete sidebarItems[fileName];
}

function getCurrentPath() {
  return app.codeBasket.view.sidebar.state.currentPath;
}

function readFiles(files, path, callback) {
  var filesToUpload = {};

  forEach(files, function(file, index) {
    var reader = new FileReader();

    reader.addEventListener('load', function(loadEvent) {
      var fileName = file.name,
          fullName;

      if (path) {
        fullName = path + '/' + fileName;
      }
      else {
        fullName = fileName;
      }

      filesToUpload[fullName] = loadEvent.target.result;

      if (index === files.length - 1) {
        callback(filesToUpload);
      }
    });

    if (file.type.indexOf('text') > -1) {
      reader.readAsText(file, 'UTF-8');
    }
    else {
      reader.readAsBinaryString(file, 'UTF-8');
    }
  });
}

function setStatus(status) {
  this.status = status;

  this.render();
}

function showProgress() {
  this.view.setState({ isProgressBarVisible: true });
}

function hideProgress() {
  this.view.setState({ isProgressBarVisible: false });
}

function showSidebarProgress() {
  this.view.setState({ isSidebarLoading: true });
};

function hideSidebarProgress() {
  this.view.setState({ isSidebarLoading: false });
};

function showModal() {
  this.view.tabsContainer.setState({ isModalVisible: true });
};

function hideModal() {
  this.view.tabsContainer.setState({ isModalVisible: false });
};

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

      return element;
    });

    if (preElements.length > 0) {
      preElements[0].dataset['libs'] = this.libraries.join(';');
    }

    return preElements.map(function(element) { return element.outerHTML }).join('\n');
  }
}

module.exports = {
  addItem: addItem,
  addFile: addFile,
  addFileAndOpen: addFileAndOpen,
  addLibrary: addLibrary,
  removeLibrary: removeLibrary,
  hasLibrary: hasLibrary,
  toggleLibrary: toggleLibrary,
  findItem: findItem,
  findFile: findFile,
  selectItem: selectItem,
  renameItem: renameItem,
  removeItem: removeItem,
  enableEditMode: enableEditMode,
  disableEditMode: disableEditMode,
  addSidebarItems: addSidebarItems,
  findInSidebar: findInSidebar,
  removeItemFromSidebar: removeItemFromSidebar,
  getCurrentPath: getCurrentPath,
  readFiles: readFiles,
  render: render,
  setStatus: setStatus,
  showProgress: showProgress,
  hideProgress: hideProgress,
  showSidebarProgress: showSidebarProgress,
  hideSidebarProgress: hideSidebarProgress,
  showModal: showModal,
  hideModal: hideModal,
  toString: toString
};