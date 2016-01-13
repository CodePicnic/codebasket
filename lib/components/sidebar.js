'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    size = require('lodash/collection/size'),
    Sidebar;

Sidebar = React.createClass({
  getInitialState: function() {
    return { currentPath: '' };
  },
  getDefaultProps: function() {
    return {};
  },
  toggleFolder: function(path) {
    var elementProperties = this.props[path] || { isCollapsed: false },
        newState = { currentPath: path },
        newProps = {};

    elementProperties.isCollapsed = !elementProperties.isCollapsed;
    newProps[path] = elementProperties;

    this.setState(newState);
    this.setProps(newProps);
  },
  onClickFile: function(fileName, fileInfo) {
    var openFileEvent = new global.CustomEvent('codebasket:openfile', {
      detail: {
        codeBasket: this.props.app,
        fileName: fileName,
        fileInfo: fileInfo
      }
    });

    global.dispatchEvent(openFileEvent);
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
    var elementState = this.props[fileInfo.path],
        isCollapsed = (elementState && elementState.isCollapsed);

    return (
      <dl className={isCollapsed ? 'collapsed' : ''} key={fileInfo.name}>
        <dt className="directory" title={fileInfo.path} onClick={this.toggleFolder.bind(null, fileInfo.path)}>
          <span className="entry-text">{fileInfo.name}</span>
          <a href="#" className="remove-entry"><i className="fa fa-times"></i></a>
        </dt>
        {map(fileInfo.files, this.renderFileOrFolder, this)}
      </dl>
    );
  },
  renderFile: function(fileName, fileInfo) {
    return (
      <dd className="file" title={fileInfo.path} key={fileName}>
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
        emptyClass = (size(sidebarItems.length) === 0 ? ' sidebar-empty' : ''),
        dragClass = (this.state.dragState === 'dragover' ? ' on-dragover' : ''),
        items = map(sidebarItems, this.renderFileOrFolder, this);

    return (
      <dl className={'console-sidebar' + emptyClass + dragClass} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>{items}</dl>
    );
  }
});

module.exports = Sidebar;