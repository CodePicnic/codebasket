'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    Sidebar;

Sidebar = React.createClass({
  getInitialState: function() {
    return {};
  },
  toggleFolder: function(path) {
    var elementState = this.state[path] || { isCollapsed: false },
        newState = {};

    elementState.isCollapsed = !elementState.isCollapsed;
    newState[path] = elementState;

    this.setState(newState);
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
  renderFolder: function(fileName, fileInfo) {
    var elementState = this.state[fileInfo.path],
        isCollapsed = (elementState && elementState.isCollapsed);

    return (
      <dl className={isCollapsed ? 'collapsed' : ''} key={fileName}>
        <dt className="directory" title={fileName} onClick={this.toggleFolder.bind(null, fileInfo.path)}>
          <span className="entry-text">{fileName}</span>
          <a href="#" className="remove-entry"><i className="fa fa-times"></i></a>
        </dt>
        {map(fileInfo.files, this.renderFileOrFolder, this)}
      </dl>
    );
  },
  renderFile: function(fileName, fileInfo) {
    return (
      <dd className="file" title={fileName} key={fileName}>
        <span className="entry-text" onClick={this.onClickFile.bind(null, fileName, fileInfo)}>{fileName}</span>
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
        items = map(sidebarItems, this.renderFileOrFolder, this);

    return (
      <dl className={'console-sidebar' + (sidebarItems.length === 0 ? ' sidebar-empty' : '')}>{items}</dl>
    );
  }
});

module.exports = Sidebar;