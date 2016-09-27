'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    difference = require('lodash/array/difference'),
    find = require('lodash/collection/find'),
    renderMixin = require('./mixins/render_mixin'),
    Browser = require('./browser'),
    CodeEditor = require('./code_editor'),
    Viewport;

Viewport = React.createClass({
  mixins: [renderMixin],
  getInitialState: function() {
    return { isExtraTabsListVisible: false };
  },
  componentDidMount: function() {
    var instance = this.props.instance,
        editor = this.refs.editor && this.refs.editor.editor;

    this.extraTabsTogglerReference = {
      ref: 'extraTabsToggler',
      icon: 'icon-arrow-down toggle-extra-tabs',
      action:  this.toggleExtraTabs
    };

    if (editor) {
      instance.editor = editor; // append more editors to a single instance
      instance.on('ready', function() {
        instance.emit('editorready', {
          codeBasket: instance,
          editor: editor
        });
      });
    }

    // this.positioningExtraTabsList();
  },
  componentDidUpdate: function() {
    this.positioningExtraTabsList();
  },
  positioningExtraTabsList: function() {
    var extraTabsToggler = this.refs.extraTabsToggler,
        extraTabsList = this.refs.extraTabsList;

    if (extraTabsToggler && extraTabsList) {
      extraTabsList.style.left = (extraTabsToggler.offsetLeft - extraTabsList.clientWidth + extraTabsToggler.clientWidth) + 'px';
    }
  },
  onClickTab: function(item, index) {
    var instance = this.props.instance;

    instance.selectItem(item, index);

    if (item.type === 'file') {
      if (item.session && instance.editor) {
        instance.editor.focus();
      }
    }
    else {
      if (item.tabPage && item.tabPage.refs.frame) {
        item.tabPage.refs.frame.contentWindow.focus();
      }
      else {
        if (this.refs['tabpage-' + item.id] && this.refs['tabpage-' + item.id].contentWindow) {
          this.refs['tabpage-' + item.id].contentWindow.focus();
        }
      }
    }
  },
  onClickCloseTab: function(item, index) {
    var instance = this.props.instance,
        visibleItems = filter(this.props.items, function(item) { return item.isVisible; });

    item.isVisible = false;

    if (visibleItems.length > 0 && visibleItems[index - 1]) {
      instance.selectItem(visibleItems[index - 1]);
    }

    // this.render();
    instance.emit('closeitem', {
      codeBasket: instance,
      item: item
    });
  },
  toggleExtraTabs: function() {
    this.setState({ isExtraTabsListVisible: !this.state.isExtraTabsListVisible });
  },
  renderTab: function(item, index) {
    var tabClasses = item.isActive ? 'active' : '',
        onClickCloseTab = this.onClickCloseTab.bind(this, item, index),
        closeButton = item.isCloseable ? <i className="icon icon-close navbar-tab-close" onClick={onClickCloseTab}></i> : undefined;

    return (
      <span className={'navbar-tab ' + tabClasses} key={index}>
        <span className="navbar-tab-title" onClick={this.onClickTab.bind(this, item, index)}>{item.name}</span>
        {closeButton}
      </span>
    );
  },
  renderTabPage: function(item, index) {
    var tabPageClasses = item.isActive ? 'active' : '',
        tabPageContent;

    if (item.type === 'file') {}
    else if (item.type === 'browser') {
      tabPageContent = <Browser ref={'tabpage-' + item.id} item={item} />
    }
    else if (item.type === 'terminal') {
      tabPageContent = <Terminal ref={'tabpage-' + item.id} item={item} />
    }
    else {
      tabPageContent = <iframe ref={'tabpage-' + item.id} src={item.location} frameBorder="0" allowFullScreen />
    }

    if (tabPageContent) {
      return (
        <div className={'codebasket-tabpage ' + tabPageClasses} key={index}>{tabPageContent}</div>
      );
    }
  },
  renderExtraTabs: function(items) {
    var extraTabsClasses = this.state.isExtraTabsListVisible ? 'opened' : '';

    return (
      <ul className={'codebasket-options-list ' + extraTabsClasses} ref="extraTabsList">
        {items.map(function(item, index) {
          var tabClasses = item.isActive ? 'active' : '';

          return <li className={tabClasses} key={index} onClick={this.onClickTab.bind(this, item, index)}>{item.name}</li>;
        }, this)}
      </ul>
    );
  },
  render: function viewportRender() {
    var instance = this.props.instance,
        itemsInNavbar = this.props.items.slice(0, 3),
        itemsOutOfNavbar = difference(this.props.items, itemsInNavbar),
        extraTabsToggler = itemsOutOfNavbar.length > 0 ? this.renderNavButton(this.extraTabsTogglerReference) : undefined,
        extraTabsList = itemsOutOfNavbar.length > 0 ? this.renderExtraTabs(itemsOutOfNavbar) : undefined,
        activeItem = find(this.props.items, function(item) { return item.isActive; }),
        isActiveItemAFile = activeItem && (activeItem.type === 'file'),
        viewportEmptyClass = (this.props.items.length === 0 || !activeItem) ? 'empty' : '',
        codeEditorClasses = isActiveItemAFile ? 'active' : '';

    return (
      <article className={'codebasket-viewport ' + this.props.viewportClasses.trim() + ' ' + viewportEmptyClass}>
        <nav className="codebasket-navbar" style={{ width: 'calc(100% - ' + ((instance.actions.length + 1) * 33) + 'px)' }}>
          {itemsInNavbar.map(this.renderTab)}
          {extraTabsToggler}
          {extraTabsList}
        </nav>
        <div className={'codebasket-tabpage ' + codeEditorClasses}>
          <CodeEditor ref="editor" instance={instance} isActive={isActiveItemAFile} />
        </div>
        {this.props.items.map(this.renderTabPage)}
      </article>
    );
  }
});

module.exports = Viewport;