'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    size = require('lodash/collection/size'),
    Sidebar;

Sidebar = React.createClass({
  getInitialState: function() {
    return { currentPath: '', selectedPath: '', paths: {} };
  },
  getDefaultProps: function() {
    return {};
  },
  componentDidMount: function() {
    this.props.parentView.sidebar = this;
  },
  toggleFolder: function(fileInfo) {
    var path = fileInfo.path,
        newState = {
          currentPath: (this.state.currentPath === path) ? '' : path,
          selectedPath: path
        };

    if (fileInfo.isCollapsed) {
      var openFolderEvent = global.document.createEvent('CustomEvent');
      openFolderEvent.initCustomEvent('codebasket:openfolder', true, true, {
        codeBasket: this.props.app,
        fileInfo: fileInfo
      });

      global.dispatchEvent(openFolderEvent);
    }

    fileInfo.isCollapsed = !fileInfo.isCollapsed;

    this.setState(newState);
  },
  onClickFile: function(fileName, fileInfo) {
    var path = fileInfo.path,
        isExecutable = fileInfo.type.match('symlink') || fileInfo.type.match('application') || fileInfo.type.match('executable'),
        newState = { selectedPath: path };

    var openFileEvent = global.document.createEvent('CustomEvent');
    openFileEvent.initCustomEvent('codebasket:openfile', true, true, {
      codeBasket: this.props.app,
      fileName: fileName,
      fileInfo: fileInfo
    });

    global.dispatchEvent(openFileEvent);

    if (!isExecutable) {
      this.setState(newState);
    }
  },
  removeFile: function(fileName, fileInfo) {
    var removeFileEvent = global.document.createEvent('CustomEvent');
    removeFileEvent.initCustomEvent('codebasket:removefile', true, true, {
      codeBasket: this.props.app,
      fileName: fileName,
      fileInfo: fileInfo
    });

    global.dispatchEvent(removeFileEvent);
  },
  onDragOver: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    event.dataTransfer.dropEffect = 'copy';

    this.setState({ dragState: 'dragover' });
  },
  onDragEnter: function(folderPath, event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ dragState: 'dragover', dragPath: folderPath });
  },
  onDragLeave: function(folderPath, event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ dragState: null, dragPath: folderPath });
  },
  onDrop: function(folderPath, event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ dragState: null });
    var codeBasket = this.props.app;

    codeBasket.readFiles(event.dataTransfer.files, folderPath, function(files) {
      var dropFilesEvent = global.document.createEvent('CustomEvent');
      dropFilesEvent.initCustomEvent('codebasket:dropfiles', true, true, {
        codeBasket: codeBasket,
        files: files
      });

      global.dispatchEvent(dropFilesEvent);
    });
  },
  renderFolder: function(fileName, fileInfo) {
    var isCollapsed = fileInfo.isCollapsed,
        collapsedClass = isCollapsed ? 'collapsed' : '',
        dragClass = ((this.state.dragState === 'dragover' && this.state.dragPath === fileInfo.path) ? ' on-dragover' : ''),
        activeClass = (this.state.selectedPath === fileInfo.path) ? ' active' : '';

    return (
      <dl className={collapsedClass} key={fileInfo.name}>
        <dt className={'directory' + dragClass + activeClass} title={fileInfo.path} onClick={this.toggleFolder.bind(null, fileInfo)} onDragEnter={this.onDragEnter.bind(this, fileInfo.path)} onDragLeave={this.onDragLeave.bind(this, fileInfo.path)} onDrop={this.onDrop.bind(this, fileInfo.path)}>
          <span className="entry-text">{fileInfo.name}</span>
          <a href="#" className="remove-entry"><i className="fa fa-times"></i></a>
        </dt>
        {map(fileInfo.files, this.renderFileOrFolder, this)}
      </dl>
    );
  },
  renderFile: function(fileName, fileInfo) {
    var activeClass = (this.state.selectedPath === fileInfo.path) ? ' active' : '',
        isExecutableClass = (fileInfo.type.match('symlink') || fileInfo.type.match('application') || fileInfo.type.match('executable')) ? ' is-executable' : '',
        fileTypeClass = ' file-' + fileInfo.path.split('.').pop();

    return (
      <dd className={'file' + fileTypeClass + isExecutableClass + activeClass} title={fileInfo.path} key={fileName}>
        <span className="entry-text" onClick={this.onClickFile.bind(null, fileName, fileInfo)}>{fileInfo.name}</span>
        <span className="remove-entry" onClick={this.removeFile.bind(null, fileName, fileInfo)}><i className="fa fa-times"></i></span>
      </dd>
    );
  },
  renderFileOrFolder: function(fileInfo, fileName) {
    var type = fileInfo.type;

    if (type.match('directory')) {
      return this.renderFolder(fileName, fileInfo);
    }
    else {
      return this.renderFile(fileName, fileInfo);
    }
  },
  render: function() {
    var sidebarItems = this.props.app.sidebarItems,
        loadingClass = (this.props.parentView.state.isSidebarLoading ? ' loading' : ''),
        emptyClass = (size(sidebarItems) === 0 ? ' sidebar-empty' : ''),
        dragClass = ((this.state.dragState === 'dragover' && this.state.dragPath === '') ? ' on-dragover' : ''),
        items = map(sidebarItems, this.renderFileOrFolder, this);

    return (
      <dl className={'console-sidebar' + emptyClass + dragClass + loadingClass} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter.bind(this, '')} onDragLeave={this.onDragLeave.bind(this, '')} onDrop={this.onDrop.bind(this, this.state.currentPath)}>{items}</dl>
    );
  }
});

module.exports = Sidebar;