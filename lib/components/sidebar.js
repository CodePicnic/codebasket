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
  renderFile: function(fileName) {
    return (
      <dd className="file" title={fileName} key={fileName}>
        <span className="entry-text">{fileName}</span>
        <a href="#" className="remove-entry"><i className="fa fa-times"></i></a>
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
      <dl className={'console-sidebar sidebar-empty'}>{items}</dl>
    );
  }
});

module.exports = Sidebar;