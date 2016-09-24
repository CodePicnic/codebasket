'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    size = require('lodash/collection/size'),
    renderMixin = require('./mixins/render_mixin'),
    sidebarMixin = require('./mixins/sidebar_mixin'),
    Sidebar;

Sidebar = React.createClass({
  mixins: [renderMixin, sidebarMixin],
  // getInitialState: function() {},
  getDefaultProps: function() {
    return { isVisible: true, isLoading: false };
  },
  componentDidMount: function() {},
  onClickFile: function(item) {
    var instance = this.props.instance,
        instanceItem = instance.findFile(item.path),
        path = item.path,
        isItemExecutable = this.isItemExecutable(item);

    instance.emit('openfile', {
      codeBasket: instance,
      fileName: item.name,
      fileInfo: item
    });

    if (instanceItem && !isItemExecutable) {
      instance.selectItem(instanceItem);
    }
  },
  renderItemsList: function(items, title) {
    if (items.length === 0) {
      return undefined;
    }

    return (
      <ul className="codebasket-items-list">
        <li className="codebasket-list-title">{title}</li>
        {items.map(function(item, index) {
          return (
            <li className="codebasket-item-terminal" key={index}>
              <span className="codebasket-item-name">{item.name}</span>
              <nav className="codebasket-item-actions">
                <i className="fa fa-close"></i>
              </nav>
            </li>
          );
        })}
      </ul>
    );
  },
  renderFilesList: function(items) {
    return (
      <ul className="codebasket-items-list">
        <li className="codebasket-list-title">
          Files
          <nav className="codebasket-item-actions">
            <span>Collapse all</span>
          </nav>
        </li>
        <li>
          <nav className="codebasket-search">
            <input type="search" name="search" placeholder="Search" />
          </nav>
        </li>
        {map(items, this.renderFileOrFolder, this)}
      </ul>
    );
  },
  renderFileOrFolder: function(item, name) {
    var instanceItem = this.props.instance.findFile(item.path),
        activeFileOrFolderClass = (instanceItem && instanceItem.isActive) ? 'active' : '',
        unsavedFileOrFolderClass = (instanceItem && instanceItem.hasChanged) ? 'unsaved' : '',
        openedFileOrFolderClass = (instanceItem && instanceItem.isVisible) ? 'opened' : '',
        fileTypeClass = 'file-' + item.path.split('.').pop(),
        isExecutableClass = this.isItemExecutable(item) ? ' is-executable' : '',
        fileClasses = (fileTypeClass + ' ' + isExecutableClass).trim(),
        fileOrFolderClasses = (activeFileOrFolderClass + ' ' + openedFileOrFolderClass + ' ' + unsavedFileOrFolderClass).trim();

    if (item.type.match('directory')) {
      return (
        <li className={'codebasket-item-folder ' + fileOrFolderClasses} key={name}>
          <span className="codebasket-item-name" title={name}>{name}</span>
          {this.renderFileOrFolderActions(item)}
          {this.renderFilesList(item.files)}
        </li>
      );
    }
    else {
      return (
        <li className={'codebasket-item-file ' + fileClasses + ' ' + fileOrFolderClasses} key={name}>
          <span className="codebasket-item-name" title={name} onClick={this.onClickFile.bind(this, item)}>{name}</span>
          {this.renderFileOrFolderActions(item)}
        </li>
      );
    }
  },
  renderFileOrFolderActions: function(item) {
    return (
      <nav className="codebasket-item-actions">
        <i className="fa fa-copy"></i>
        <i className="fa fa-edit"></i>
        <i className="fa fa-trash-o"></i>
      </nav>
    );
  },
  render: function sidebarRender() {
    var instance = this.props.instance,
        terminals = filter(instance.items, function(item) { return item.isVisible && item.type === 'terminal'; }),
        loadingSidebarClass = this.props.isLoading ? 'loading' : '',
        emptySidebarClass = size(instance.sidebarItems) === 0 ? 'empty' : '',
        visibleSidebarClass = this.props.isVisible ? 'visible' : '',
        parentClasses = loadingSidebarClass + ' ' + emptySidebarClass + ' ' + visibleSidebarClass;

    return (
      <aside className={'codebasket-sidebar ' + parentClasses}>
        <nav className="codebasket-navbar">{this.props.actions.map(this.renderNavButton)}</nav>
        <article className="codebasket-sidebar-content">
          {this.renderItemsList(terminals, 'Terminals')}
          {this.renderFilesList(instance.sidebarItems)}
        </article>
      </aside>
    );
  }
});

module.exports = Sidebar;