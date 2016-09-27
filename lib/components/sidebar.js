'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    find = require('lodash/collection/find'),
    sortBy = require('lodash/collection/sortBy'),
    size = require('lodash/collection/size'),
    renderMixin = require('./mixins/render_mixin'),
    sidebarMixin = require('./mixins/sidebar_mixin'),
    Sidebar;

Sidebar = React.createClass({
  mixins: [renderMixin, sidebarMixin],
  getInitialState: function() {
    return { selectedItem: this.props.selectedItem };
  },
  getDefaultProps: function() {
    return { isVisible: true, isLoading: false };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ selectedItem: nextProps.selectedItem });
  },
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
      this.setState({ selectedItem: item });
    }
  },
  onClickFolder: function(item) {
    var instance = this.props.instance,
        previouslySelectedInstanceItem = find(instance.items, function(item) {
          return item.type === 'file' && item.isActive;
        }),
        path = item.path;

    if (item.isCollapsed) {
      instance.emit('openfolder', {
        codeBasket: instance,
        item: item
      });
    }

    item.isCollapsed = !item.isCollapsed;

    if (previouslySelectedInstanceItem) {
      previouslySelectedInstanceItem.isActive = false;
    }

    this.setState({ selectedItem: item });
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
    var dragSidebarClass = ((this.state.dragState === 'dragover' && this.state.dragPath === '') ? 'dragover' : '');
    return (
      <ul className={'codebasket-items-list ' + dragSidebarClass}
        onDragEnter={this.onDragEnter.bind(this, '')}
        onDragOver={this.onDragOver}
        onDragExit={this.onDragExit.bind(this, '')}
        onDrop={this.onDrop.bind(this, '')}>
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
        {sortBy(items, this.sortByName).map(this.renderFileOrFolder, this)}
      </ul>
    );
  },
  renderFileOrFolder: function(item) {
    var name = item.name,
        instanceItem = this.props.instance.findFile(item.path),
        // activeFileClass = ((instanceItem && instanceItem.isActive) || this.state.selectedItem === item) ? 'active' : '',
        // activeFileClass = (instanceItem && instanceItem.isActive) ? 'active' : '',
        // activeFileClass = this.state.selectedItem === item ? 'active' : '',
        activeFileOrFolderClass = this.state.selectedItem === item ? 'active' : '',
        unsavedFileOrFolderClass = (instanceItem && instanceItem.hasChanged) ? 'unsaved' : '',
        fileOrFolderClasses = (activeFileOrFolderClass + ' ' + unsavedFileOrFolderClass).trim();

    if (this.isItemAFolder(item)) {
      return (
        <li className={'codebasket-item-folder ' + this.folderClassName(item) + ' ' + fileOrFolderClasses} key={name}>
          <span className="codebasket-item-name"
            title={name}
            onClick={this.onClickFolder.bind(this, item)}
            onDragEnter={this.onDragEnter.bind(this, item.path)}
            onDragExit={this.onDragExit.bind(this, item.path)}
            onDrop={this.onDrop.bind(this, item.path)}>{name}</span>
          {this.renderFileOrFolderActions(item)}
          <ul className="codebasket-items-list">
            {sortBy(item.files, this.sortByName).map(this.renderFileOrFolder, this)}
          </ul>
        </li>
      );
    }
    else {
      return (
        <li className={'codebasket-item-file ' + this.fileClassName(item) + ' ' + fileOrFolderClasses} key={name}>
          <span className="codebasket-item-name" title={name} onClick={this.onClickFile.bind(this, item)}>{name}</span>
          {this.renderFileOrFolderActions(item)}
        </li>
      );
    }
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