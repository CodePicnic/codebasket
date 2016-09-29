'use strict';

var React = require('react');

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
  onDrop: function(path, event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ dragState: null });

    var instance = this.props.instance;

    instance.readFiles(event.dataTransfer.files, path, function(files) {
      instance.emit('dropfiles', {
        codeBasket: instance,
        files: files
      });
    });
  },
  onClickEditFileOrFolder: function(item, event) {
    var instance = this.props.instance;

    if (this.isItemAFile(item)) {
      var instanceItem = instance.findFile(item.path),
          oldName = instanceItem.name,
          newName = prompt('Enter the new name', instanceItem.name);

      if (instanceItem && newName && newName !== '') {
        instance.renameItem(instanceItem, newName);

        instance.emit('renameitem', {
          codeBasket: instance,
          item: instanceItem,
          oldName: oldName,
          newName: newName
        });
      }
    }
    else {}
  },
  onClickRemoveFileOrFolder: function(item, event) {
    var instance = this.props.instance;

    instance.emit('removeentry', {
      codeBasket: instance,
      fileName: item.name,
      fileInfo: item
    });
  },
  renderFileOrFolderActions: function(item) {
    return (
      <nav className="codebasket-item-actions">
        <span className="icon edit" title="Edit" onClick={this.onClickEditFileOrFolder.bind(this, item)}>C</span>
        <span className="icon delete" title="Delete" onClick={this.onClickRemoveFileOrFolder.bind(this, item)}>G</span>
      </nav>
    );
  }
};