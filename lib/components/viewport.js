'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    find = require('lodash/collection/find'),
    renderMixin = require('./mixins/render_mixin'),
    Browser = require('./browser'),
    CodeEditor = require('./code_editor'),
    Viewport;

Viewport = React.createClass({
  mixins: [renderMixin],
  // getInitialState: function() {},
  componentDidMount: function() {},
  renderTab: function(item, index) {
    var tabClasses = item.isActive ? 'active' : '',
        closeButton = item.isCloseable ? <i className="icon icon-close navbar-tab-close"></i> : undefined;

    return (
      <span className={'navbar-tab ' + tabClasses} key={index}>
        <span className="navbar-tab-title">{item.name}</span>
        {closeButton}
      </span>
    );
  },
  renderTabPage: function(item, index) {
    var tabPageClasses = item.isActive ? 'active' : '',
        tabPageContent;

    if (item.type === 'file') {}
    else if (item.type === 'browser') {
      tabPageContent = <Browser item={item} />
    }
    else if (item.type === 'terminal') {
      tabPageContent = <Terminal item={item} />
    }
    else {
      tabPageContent = <iframe src={item.location} frameBorder="0" allowFullScreen />
    }

    if (tabPageContent) {
      return (
        <div className={'codebasket-tabpage ' + tabPageClasses} key={index}>{tabPageContent}</div>
      );
    }
  },
  renderExtraTabs: function() {
    return (
      <ul className="codebasket-options-list">
        {this.props.instance.items.map(function(item, index) {
          return <li key={index}>{item.name}</li>;
        })}
      </ul>
    );
  },
  render: function viewportRender() {
    var instance = this.props.instance,
        extraTabsToggler = true ? this.renderNavButton({ icon: 'icon-arrow-down toggle-extra-tabs' }) : undefined,
        extraTabsList = true ? this.renderExtraTabs() : undefined,
        activeItem = find(this.props.items, function(item) { return item.isActive; }),
        isActiveItemAFile = activeItem && (activeItem.type === 'file'),
        codeEditorClasses = isActiveItemAFile ? 'active' : '';

    return (
      <article className={'codebasket-viewport ' + this.props.viewportClasses}>
        <nav className="codebasket-navbar">
          {this.props.items.map(this.renderTab)}
          {extraTabsToggler}
          {extraTabsList}
        </nav>
        <div className={'codebasket-tabpage ' + codeEditorClasses}>
          <CodeEditor ref="editor" instance={instance} isActive={isActiveItemAFile} />
        </div>
        {this.props.instance.items.map(this.renderTabPage)}
      </article>
    );
  }
});

module.exports = Viewport;