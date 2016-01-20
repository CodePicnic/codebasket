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
      var openFolderEvent = new global.CustomEvent('codebasket:openfolder', {
        detail: {
          codeBasket: this.props.app,
          fileInfo: fileInfo
        }
      });

      global.dispatchEvent(openFolderEvent);
    }

    fileInfo.isCollapsed = !fileInfo.isCollapsed;

    this.setState(newState);
  },
  onClickFile: function(fileName, fileInfo) {
    var path = fileInfo.path,
        newState = { selectedPath: path };

    var openFileEvent = new global.CustomEvent('codebasket:openfile', {
      detail: {
        codeBasket: this.props.app,
        fileName: fileName,
        fileInfo: fileInfo
      }
    });

    global.dispatchEvent(openFileEvent);

    this.setState(newState);
  },
  removeFile: function(fileName, fileInfo) {
    var removeFileEvent = new global.CustomEvent('codebasket:removefile', {
      detail: {
        codeBasket: this.props.app,
        fileName: fileName,
        fileInfo: fileInfo
      }
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
  onDragEnter: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    this.setState({ dragState: 'dragover' });
  },
  onDragLeave: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    this.setState({ dragState: null });
  },
  onDrop: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }

    this.setState({ dragState: null });
    var codeBasket = this.props.app;

    codeBasket.readFiles(event.dataTransfer.files, this.state.currentPath, function(files) {
      var removeFileEvent = new global.CustomEvent('codebasket:dropfiles', {
        detail: {
          codeBasket: codeBasket,
          files: files
        }
      });

      global.dispatchEvent(removeFileEvent);
    });
  },
  renderFolder: function(fileName, fileInfo) {
    var isCollapsed = fileInfo.isCollapsed,
        collapsedClass = isCollapsed ? 'collapsed' : '',
        activeClass = (this.state.selectedPath === fileInfo.path) ? ' active' : '';

    return (
      <dl className={collapsedClass} key={fileInfo.name}>
        <dt className={'directory' + activeClass} title={fileInfo.path} onClick={this.toggleFolder.bind(null, fileInfo)}>
          <span className="entry-text">{fileInfo.name}</span>
          <a href="#" className="remove-entry"><i className="fa fa-times"></i></a>
        </dt>
        {map(fileInfo.files, this.renderFileOrFolder, this)}
      </dl>
    );
  },
  renderFile: function(fileName, fileInfo) {
    var activeClass = (this.state.selectedPath === fileInfo.path) ? ' active' : '';

    return (
      <dd className={'file' + activeClass} title={fileInfo.path} key={fileName}>
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
        dragClass = (this.state.dragState === 'dragover' ? ' on-dragover' : ''),
        items = map(sidebarItems, this.renderFileOrFolder, this);

    return (
      <dl className={'console-sidebar' + emptyClass + dragClass + loadingClass} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>{items}</dl>
    );
  }
});

module.exports = Sidebar;