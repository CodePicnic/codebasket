'use strict';

var React = require('react'),
    renderHTML = require('react-render-html'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    renderMixin = require('./mixins/render_mixin'),
    contentMixin = require('./mixins/content_mixin'),
    Viewport = require('./viewport'),
    Content;

Content = React.createClass({
  mixins: [renderMixin, contentMixin],
  getInitialState: function() {
    return { isOptionsListVisible: false, isAsideVisible: false, isLibrariesListVisible: false };
  },
  getDefaultProps: function() {
    return { splitMode: null };
  },
  componentDidMount: function() {},
  render: function contentRender() {
    var instance = this.props.instance,
        items = instance.items,// filter(instance.items, function(item) { return item.isVisible; }),
        primaryViewportClassIfSplitted = this.props.splitMode === 'horizontal' ? 'horizontal top' : 'vertical left',
        secondaryViewportClassIfSplitted = this.props.splitMode === 'horizontal' ? 'horizontal bottom' : 'vertical right',
        primaryViewportClasses = this.props.splitMode ? primaryViewportClassIfSplitted : ' full',
        secondaryViewportClasses = this.props.splitMode ? secondaryViewportClassIfSplitted : ' inactive',
        sidebarTogglerClass = this.props.isFull ? 'icon-show-sidebar' : 'icon-hide-sidebar',
        optionsListClass = this.state.isOptionsListVisible ? 'opened' : '',
        librariesListClass = this.state.isLibrariesListVisible ? 'opened' : '',
        asideClass = this.state.isAsideVisible ? 'opened' : '',
        contentClasses = this.props.isFull ? ' full' : '';

    return (
      <section className={'codebasket-content' + contentClasses}>
        {this.renderNavButton({ icon: sidebarTogglerClass + ' codebasket-toggle-sidebar', action: this.toggleSidebar })}
        <nav className="codebasket-navbar codebasket-navbar-global">
          {this.renderAddLibraryButton()}
          {instance.actions.map(this.renderNavButton)}
          {this.renderOptionsButton()}
          {this.renderInfoButton()}
          <ul className={'codebasket-options-list' + ' ' + optionsListClass}>{instance.options.map(this.renderOption)}</ul>
        </nav>
        <aside className={'codebasket-aside-content' + ' ' + asideClass}>
          {renderHTML(instance.info)}
        </aside>
        <aside className={'codebasket-aside-content' + ' ' + librariesListClass}>
          {this.renderLibrariesList(CodeBasket.libraries)}
        </aside>
        <Viewport viewportClasses={primaryViewportClasses} items={filter(items, function(item) { return item.pane !== 'secondary'; })} instance={instance} />
      </section>
    );
  }
});

module.exports = Content;