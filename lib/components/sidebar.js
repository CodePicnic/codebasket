'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    size = require('lodash/collection/size'),
    renderMixin = require('./mixins/render_mixin'),
    Sidebar;

Sidebar = React.createClass({
  mixins: [renderMixin],
  // getInitialState: function() {},
  getDefaultProps: function() {
    return { isSidebarVisible: true, sidebarActions: [] };
  },
  componentDidMount: function() {},
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
        {map(items, this.renderFileOrFolder)}
      </ul>
    );
  },
  render: function sidebarRender() {
    var instance = this.props.instance,
        terminals = filter(instance.items, function(item) { return item.isVisible && item.type === 'terminal'; }),
        emptySidebarClass = size(instance.sidebarItems) === 0 ? 'empty' : '',
        visibleSidebarClass = this.props.isSidebarVisible ? 'visible' : '',
        parentClasses = emptySidebarClass + ' ' + visibleSidebarClass;

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