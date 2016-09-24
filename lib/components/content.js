'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    renderMixin = require('./mixins/render_mixin'),
    Viewport = require('./viewport'),
    Content;

Content = React.createClass({
  mixins: [renderMixin],
  getInitialState: function() {
    return { isOptionsListVisible: false, isAsideVisible: false };
  },
  getDefaultProps: function() {
    return { splitMode: null };
  },
  componentDidMount: function() {},
  toggleSidebar: function() {
    var instance = this.props.instance;

    if (instance.view) {
      instance.view.setState({ isSidebarVisible: !instance.view.state.isSidebarVisible });
    }
  },
  toggleOptionsList: function() {
    this.setState({ isOptionsListVisible: !this.state.isOptionsListVisible });
  },
  toggleAside: function() {
    this.setState({ isAsideVisible: !this.state.isAsideVisible });
  },
  render: function contentRender() {
    var instance = this.props.instance,
        items = filter(instance.items, function(item) { return item.isVisible; }),
        primaryViewportClassIfSplitted = this.props.splitMode === 'horizontal' ? 'horizontal top' : 'vertical left',
        secondaryViewportClassIfSplitted = this.props.splitMode === 'horizontal' ? 'horizontal bottom' : 'vertical right',
        primaryViewportClasses = this.props.splitMode ? primaryViewportClassIfSplitted : ' full',
        secondaryViewportClasses = this.props.splitMode ? secondaryViewportClassIfSplitted : ' inactive',
        sidebarTogglerClass = this.props.isFull ? 'icon-show-sidebar' : 'icon-hide-sidebar',
        optionsListClass = this.state.isOptionsListVisible ? 'opened' : '',
        asideClass = this.state.isAsideVisible ? 'opened' : '',
        contentClasses = this.props.isFull ? ' full' : '';

    return (
      <section className={'codebasket-content' + contentClasses}>
        {this.renderNavButton({ icon: sidebarTogglerClass + ' codebasket-toggle-sidebar', action: this.toggleSidebar })}
        <nav className="codebasket-navbar codebasket-navbar-global">
          {instance.actions.map(this.renderNavButton)}
          {this.renderNavButton({ icon: 'icon-cog', action: this.toggleOptionsList })}
          {this.renderNavButton({ icon: 'icon-info', action: this.toggleAside })}
        </nav>
        <nav className={'codebasket-options-list' + ' ' + optionsListClass}>{instance.options.map(this.renderOption)}</nav>
        <aside className={'codebasket-aside-content' + ' ' + asideClass}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </aside>
        <Viewport viewportClasses={primaryViewportClasses} items={filter(items, function(item) { return item.pane !== 'secondary'; })} instance={instance} />
        <Viewport viewportClasses={secondaryViewportClasses} items={filter(items, function(item) { return item.pane === 'secondary'; })} instance={instance} />
      </section>
    );
  }
});

module.exports = Content;