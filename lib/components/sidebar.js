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
  renderItemsList: function(items, title) {
    if (items.length === 0) {
      return undefined;
    }

    return (
      <ul className="codebasket-items-list">
        <li className="codebasket-list-title">{title}</li>
        {items.map(function(item, index) {
          var itemClass = item.isActive ? 'active' : '',
              closeButton = item.isCloseable ? <i className="icon icon-close" onClick={this.onClickCloseItem.bind(this, item)}></i> : undefined;

          return (
            <li className={'codebasket-item-terminal ' + itemClass} key={index}>
              <span className="codebasket-item-name" onClick={this.onClickItem.bind(this, item)}>{item.name}</span>
              <nav className="codebasket-item-actions">
                {closeButton}
              </nav>
            </li>
          );
        }, this)}
      </ul>
    );
  },
  renderFilesList: function(items) {
    var search,
        dragSidebarClass = ((this.state.dragState === 'dragover' && this.state.dragPath === '') ? 'dragover' : '');

    search = (
      <li className="codebasket-search">
        <input type="search" name="search" placeholder="Search" onKeyUp={this.onKeyUpSearch} />
      </li>
    );

    return (
      <ul className={'codebasket-items-list ' + dragSidebarClass}
        onDragEnter={this.onDragEnter.bind(this, '')}
        onDragOver={this.onDragOver}
        onDragExit={this.onDragExit.bind(this, '')}
        onDrop={this.onDrop.bind(this, '')}>
        <li className="codebasket-list-title">
          Files
          <nav className="codebasket-item-actions">
            <span className="text">Collapse all</span>
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