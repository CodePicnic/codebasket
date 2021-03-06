'use strict';

var React = require('react'),
    forEach = require('lodash/collection/forEach'),
    map = require('lodash/collection/map');

module.exports = {
  isItemExecutable: function(item) {
    return item.type.match(/symlink|application|executable/);
  },
  isItemAFile: function(item) {
    return !this.isItemAFolder(item);
  },
  isItemAFolder: function(item) {
    return item.type.match('directory');
  },
  getFolderPath: function(path) {
    var parts = path.split('/');
    parts.pop();

    return parts ? parts.join('/') : '';
  },
  fileClassName: function(item) {
    var instanceItem = this.props.instance.findFile(item.path),
        openedFileClass = (instanceItem && instanceItem.isVisible) ? 'opened' : '',
        executableClass = this.isItemExecutable(item) ? ' is-executable' : '',
        fileTypeClass = 'file-' + item.path.split('.').pop();

    return (fileTypeClass + ' ' + executableClass + ' ' + openedFileClass).trim();
  },
  folderClassName: function(item) {
    var collapsedFolderClass = item.isCollapsed ? 'closed' : 'opened',
        dragClass = ((this.state.dragState === 'dragover' && this.state.dragPath === item.path) ? 'dragover' : '');

    return (collapsedFolderClass + ' ' + dragClass).trim();
  },
  sortByName: function(item) {
    return item.name;
  },
  onDragEnter: function(path, event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ dragState: 'dragover', dragPath: path });
  },
  onDragOver: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    event.dataTransfer.dropEffect = 'copy';

    this.setState({ dragState: 'dragover' });
  },
  onDragExit: function(path, event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ dragState: null, dragPath: null });
  },
  onDrop: function onDrop(path, event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ dragState: null });

    var instance = this.props.instance;

    // console.log('items', event.dataTransfer.items);
    // console.log('files', event.dataTransfer.files);

    if (event.dataTransfer.items) {
      var dropEntriesEvent = global.document.createEvent('CustomEvent');

      dropEntriesEvent.initCustomEvent('codebasket:dropentries', true, true, {
        codeBasket: instance,
        entries: map(event.dataTransfer.items, function(item) {
          return (item.webkitGetAsEntry && item.webkitGetAsEntry());
        }),
        path: path
      });

      global.dispatchEvent(dropEntriesEvent);
    }
    else if (event.dataTransfer.files) {
      var dropFilesEvent = global.document.createEvent('CustomEvent');
      dropFilesEvent.initCustomEvent('codebasket:dropfiles', true, true, {
        codeBasket: instance,
        files: event.dataTransfer.files,
        path: path
      });

      global.dispatchEvent(dropFilesEvent);
    }
  },
  onKeyUpSearch: function(event) {
    if (event.keyCode === 13) {
      var instance = this.props.instance,
          path = (this.state.selectedItem && this.isItemAFolder(this.state.selectedItem)) ? this.state.selectedItem.path : '';

      var searchEvent = global.document.createEvent('CustomEvent');
      searchEvent.initCustomEvent('codebasket:searchfiles', true, true, {
        codeBasket: instance,
        term: event.target.value,
        path: path
      });

      global.dispatchEvent(searchEvent);
    }
  },
  onClickItem: function(item) {
    var instance = this.props.instance;

    instance.selectItem(item);
  },
  onClickFile: function(item) {
    var instance = this.props.instance,
        instanceItem = instance.findFile(item.path),
        path = item.path,
        isOpened = (instanceItem && instanceItem.isVisible),
        isItemExecutable = this.isItemExecutable(item);

    if (!isOpened) {
      var openFileEvent = global.document.createEvent('CustomEvent');
      openFileEvent.initCustomEvent('codebasket:openfile', true, true, {
        codeBasket: instance,
        fileName: item.name,
        fileInfo: item
      });

      global.dispatchEvent(openFileEvent);
    }

    instance.selectedSidebarItem = instance.getSidebarItem(this.getFolderPath(item.path));

    if (instanceItem && !isItemExecutable) {
      instance.selectItem(instanceItem);
      this.setState({ selectedItem: item });
    }
  },
  onClickFolder: function(item) {
    var instance = this.props.instance,
        path = item.path,
        previouslySelectedFile = find(instance.items, function(item) {
          return item.type === 'file' && item.isActive;
        });

    if (item.isCollapsed) {
      var openFolderEvent = global.document.createEvent('CustomEvent');
      openFolderEvent.initCustomEvent('codebasket:openfolder', true, true, {
        codeBasket: instance,
        fileInfo: item
      });

      global.dispatchEvent(openFolderEvent);
    }

    item.isCollapsed = !item.isCollapsed;

    if (previouslySelectedFile) {
      previouslySelectedFile.isActive = false;
    }

    instance.selectedSidebarItem = item;
    this.setState({ selectedItem: item });
  },
  onClickCloseItem: function(item) {
    var instance = this.props.instance,
        visibleItems = filter(instance.items, function(item) { return item.isVisible; }),
        index = visibleItems.indexOf(item);

    item.isVisible = false;

    if (visibleItems.length > 0 && visibleItems[index - 1]) {
      instance.selectItem(visibleItems[index - 1]);
    }

    var closeItemEvent = global.document.createEvent('CustomEvent');
    closeItemEvent.initCustomEvent('codebasket:closeitem', true, true, {
      codeBasket: instance,
      item: item
    });

    global.dispatchEvent(closeItemEvent);
  },
  onClickEditFileOrFolder: function(item, event) {
    var instance = this.props.instance;

    if (this.isItemAFile(item)) {
      var instanceItem = instance.findFile(item.path),
          oldName,
          newName;

      oldName = instanceItem.name;
      newName = prompt('Enter the new name', instanceItem.name);

      if (instanceItem && newName && newName !== '') {
        instance.renameItem(instanceItem, newName);
      }
    }
  },
  onClickRemoveFileOrFolder: function(item, event) {
    var instance = this.props.instance;

    var removeItemEvent = global.document.createEvent('CustomEvent');
    removeItemEvent.initCustomEvent('codebasket:removeentry', true, true, {
      codeBasket: instance,
      fileName: item.name,
      fileInfo: item
    });

    global.dispatchEvent(removeItemEvent);
  },
  onClickCollapseAll: function(event) {
    var sidebarItems = this.props.instance.sidebarItems;

    forEach(sidebarItems, function collapse(sidebarItem, name) {
      sidebarItem.isCollapsed = true;

      if (sidebarItem.files) {
        forEach(sidebarItem.files, collapse);
      }
    });

    this.props.instance.render();
  },
  renderFileOrFolderActions: function(item) {
    var instance = this.props.instance,
        editButton = (this.isItemAFile(item) && instance.findFile(item.path)) ? <span className="icon edit" title="Edit" onClick={this.onClickEditFileOrFolder.bind(this, item)}>E</span> : undefined;

    return (
      <nav className="codebasket-item-actions">
        {editButton}
        <span className="icon delete" title="Delete" onClick={this.onClickRemoveFileOrFolder.bind(this, item)}>G</span>
      </nav>
    );
  }
};