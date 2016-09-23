'use strict';

var find = require('lodash/collection/find'),
    filter = require('lodash/collection/filter'),
    forEach = require('lodash/collection/forEach'),
    some = require('lodash/collection/some'),
    pull = require('lodash/array/pull'),
    includes = require('lodash/collection/includes'),
    constants = require('./constants'),
    ace = global.ace;

var React = require('react'),
    ReactDOM = require('react-dom'),
    CodeBasketView = require('./components/index');

function createFileSession(item) {
  if (item.type === 'file') {
    if (item.session) {
      return item.session;
    }
    else {
      var fileLanguage = (constants.MODES[item.language] || item.language),
          session = new ace.EditSession(item.content, 'ace/mode/' + fileLanguage);

      session.$id = fileLanguage + '-' + item.name.replace(/\./ig, '-');
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

      var addSessionEvent = global.document.createEvent('CustomEvent');
      addSessionEvent.initCustomEvent('codebasket:addsession', true, true, {
        codeBasket: this,
        item: item,
        session: session
      });

      window.dispatchEvent(addSessionEvent);

      return session;
    }
  }
}

function addItem(newItem) {
  newItem.isVisible = (newItem.isVisible === undefined) ? true : newItem.isVisible;
  newItem.content = (newItem.type === 'file' && newItem.content === undefined) ? '' : newItem.content;
  newItem.name = (newItem.type === 'file' && newItem.name === undefined) ? (this.items.length + '.' + newItem.language) : newItem.name;
  newItem.title = (newItem.title === undefined) ? newItem.name : newItem.title;
  newItem.session = (newItem.type === 'file') ? createFileSession.call(this, newItem) : newItem.session;
  newItem.id = (newItem.id === undefined) ? (newItem.type || 'item') + '-' + this.items.length : newItem.id;
  newItem.pane = (newItem.pane === undefined) ? 'main' : newItem.pane;

  this.items.push(newItem);

  return newItem;
}

function addFile(newFile) {
  newFile.type = 'file';
  newFile.session = createFileSession.call(this, newFile);

  return this.addItem(newFile);
}

function addFileAndOpen(newFile) {
  newFile.isVisible = true;

  this.addFile(newFile);
}

function addLibrary(newLibrary) {
  this.libraries.push(newLibrary);

  var addLibraryEvent = global.document.createEvent('CustomEvent');
  addLibraryEvent.initCustomEvent('codebasket:addlibrary', true, true, {
    codeBasket: this,
    library: newLibrary
  });

  global.dispatchEvent(addLibraryEvent);
}

function hasLibrary(library) {
  return includes(this.libraries, library);
}

function removeLibrary(library) {
  pull(this.libraries, library);

  var removeLibraryEvent = global.document.createEvent('CustomEvent');
  removeLibraryEvent.initCustomEvent('codebasket:removelibrary', true, true, {
    codeBasket: this,
    library: library
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
  var activeItem = find(this.items, function(itemInCollection) {
    return itemInCollection.pane === item.pane && itemInCollection.isActive;
  });

  if (activeItem !== item) {
    if (activeItem && activeItem.pane === item.pane) {
      activeItem.isActive = false;
    }

    item.isActive = true;

    if (item.type === 'file' && item.session && this.editor) {
      this.editor.setSession(item.session);
      this.editor.focus();
    }

    // if (item.type === 'file') {
    //   if (this.view && this.view.sidebar) {
    //     this.view.sidebar.setState({ selectedPath: item.name });
    //   }
    // }
  }

  this.emit('tabselected', {
    codeBasket: this,
    item: item,
    index: index
  });

  // var tabSelectedEvent = global.document.createEvent('CustomEvent');
  // tabSelectedEvent.initCustomEvent('codebasket:tabselected', true, true, {
  //   codeBasket: this,
  //   item: item,
  //   index: index
  // });
  //
  // global.dispatchEvent(tabSelectedEvent);

  this.render();
}

function renameItem(item, newName, options) {
  var oldName = item.name,
      directory = oldName.split('/'),
      newDirectory = newName.split('/'),
      oldFileName = directory.pop(),
      newFileName = newDirectory.pop(),
      sidebarItems = this.findInSidebar(directory.join('/')),
      sidebarItem = sidebarItems[item.name],
      options = options || {};

  if (sidebarItems && sidebarItem) {
    sidebarItem.name = newFileName;
    sidebarItem.path = newName;

    sidebarItems[newFileName] = sidebarItem;
    delete sidebarItems[item.name];

    if (this.view.sidebar.state.selectedPath === oldName) {
      this.view.sidebar.setState({ selectedPath: newName });
    }
  }

  item.title = item.name = newName;
  item.language = item.name.split('.').pop();
  item.session.setMode('ace/mode/' + (constants.MODES[item.language] || item.language));

  this.render();

  if (!options.silent) {
    var renameItemEvent = global.document.createEvent('CustomEvent');
    renameItemEvent.initCustomEvent('codebasket:renameitem', true, true, {
      codeBasket: this,
      item: item,
      oldName: oldName,
      newName: newName
    });

    global.dispatchEvent(renameItemEvent);
  }
}

function removeItem(item) {
  pull(this.items, item);

  return item;
}

function moveItemToPane(item) {
  var currentPane = item.pane,
      nextPane = (item.pane === 'secondary' ? 'main' : 'secondary'),
      itemInCurrentPane = find(this.items, function(itemInCollection) {
        return itemInCollection.isVisible && itemInCollection.pane === currentPane && itemInCollection !== item;
      }),
      activeFile;

  item.isActive = !some(this.items, function(itemInCollection) {
    return itemInCollection.pane === nextPane;
  });
  item.pane = nextPane;

  if (itemInCurrentPane) {
    itemInCurrentPane.isActive = true;
  }

  activeFile = find(this.items, function(itemInCollection) {
    return itemInCollection.isVisible && itemInCollection.isActive && itemInCollection.type === 'file';
  });

  if (activeFile) {
    if (activeFile.session && this.editor) {
      var self = this;

      if (global.requestAnimationFrame || global.webkitRequestAnimationFrame) {
        (global.requestAnimationFrame || global.webkitRequestAnimationFrame)(function() {
          self.editor.setSession(activeFile.session);
          // self.editor.focus();
        });
      }
      else {
        global.setTimeout(function() {
          self.editor.setSession(activeFile.session);
          // self.editor.focus();
        }, 0);
      }
    }

    if (this.view && this.view.sidebar) {
      this.view.sidebar.setState({ selectedPath: activeFile.name });
    }
  }

  this.render();

  if (item.tabPage && item.tabPage.refs.frame) {
    item.tabPage.refs.frame.contentWindow.focus();
  }

  var itemChangedPaneEvent = global.document.createEvent('CustomEvent');
  itemChangedPaneEvent.initCustomEvent('codebasket:itemchangedpane', true, true, {
    codeBasket: this,
    item: item,
    pane: nextPane
  });

  global.dispatchEvent(itemChangedPaneEvent);
}

function enableEditMode(item) {
  var otherItems = filter(this.items, function(itemInCollection) { return itemInCollection.isEditing; });
  forEach(otherItems, function(itemInCollection) { itemInCollection.isEditing = false; });
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

function addFileToSidebar(fileName, fullName, rootPath) {
  var paths = {},
      types = {};

  paths[fileName] = fullName;
  types[fullName] = 'text/plain';

  this.addSidebarItems(paths, types, rootPath);
}

function addFolderToSidebar(fileName, fullName, rootPath) {
  var paths = {},
      types = {};

  paths[fileName] = fullName;
  types[fullName] = 'application/x-directory';

  this.addSidebarItems(paths, types, rootPath);
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
  return this.view.sidebar.state.currentPath;
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
    this.view = ReactDOM.render(React.createElement(CodeBasketView, { instance: this }), this.element);
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
  moveItemToPane: moveItemToPane,
  enableEditMode: enableEditMode,
  disableEditMode: disableEditMode,
  addSidebarItems: addSidebarItems,
  addFileToSidebar: addFileToSidebar,
  addFolderToSidebar: addFolderToSidebar,
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