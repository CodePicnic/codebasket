'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    difference = require('lodash/array/difference'),
    find = require('lodash/collection/find'),
    throttle = require('lodash/function/throttle'),
    renderMixin = require('./mixins/render_mixin'),
    Browser = require('./browser'),
    CodeEditor = require('./code_editor'),
    Terminal = require('./terminal'),
    mediaQueryBreakpoint = 'screen and (max-height: 768px) and (max-width: 1024px)',
    Viewport;

Viewport = React.createClass({
  mixins: [ renderMixin ],
  getInitialState: function() {
    return { isExtraTabsListVisible: false, maxVisibleItems: 15 };
  },
  componentDidMount: function() {
    var self = this,
        instance = this.props.instance,
        editor = this.refs.editor && this.refs.editor.editor;

    this.extraTabsTogglerReference = {
      ref: 'extraTabsToggler',
      icon: 'icon-more toggle-extra-tabs',
      action:  this.toggleExtraTabs
    };

    if (editor) {
      // instance.editor = editor; // append more editors to a single instance
      instance.editors.push(editor);

      global.addEventListener('codebasket:ready', function() {
        var editorReadyEvent = global.document.createEvent('CustomEvent');
        editorReadyEvent.initCustomEvent('codebasket:editorready', true, true, {
          codeBasket: instance,
          editor: editor
        });

        global.dispatchEvent(editorReadyEvent);
      });
    }

    self.setState({ maxVisibleItems: self.getMaxVisibleItems() });

    window.addEventListener('resize', throttle(function() {
      self.setState({ maxVisibleItems: self.getMaxVisibleItems() });
    }, 350));

    // this.positioningExtraTabsList();
  },
  componentDidUpdate: function() {
    this.positioningExtraTabsList();
  },
  getMaxVisibleItems: function() {
    var addButtonWidth = this.props.instance.addButton ? 35 : 0,
        tabsContainerWidth = this.refs.navbar.clientWidth - addButtonWidth,
        tabWidth = 100;
        // tabWidth = 300;

    return Math.floor(tabsContainerWidth / tabWidth);
  },
  positioningExtraTabsList: function() {
    var extraTabsToggler = this.refs.extraTabsToggler,
        extraTabsList = this.refs.extraTabsList;

    if (extraTabsToggler && extraTabsList) {
      extraTabsList.style.left = (extraTabsToggler.offsetLeft - extraTabsList.clientWidth + extraTabsToggler.clientWidth) + 'px';
    }
  },
  calculateNavBarWidthExcess: function() {
    var instance = this.props.instance,
        visibleActions = filter(instance.actions, function(action) { return action.isVisible; });

    if (global.matchMedia && global.matchMedia(mediaQueryBreakpoint).matches) {
      return ((visibleActions.length + 2 + Number(!!instance.info)) * 48 );
    }
    else {
      return ((visibleActions.length + 2 + Number(!!instance.info)) * 33);
    }
  },
  onClickTab: function(item, index) {
    var instance = this.props.instance;

    instance.selectItem(item, index);

    this.setState({ isExtraTabsListVisible: false });

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
        visibleItems = filter(this.props.items, function(itemInList) { return itemInList.isVisible; });

    item.isVisible = false;

    if (instance.activeItem && visibleItems.indexOf(instance.activeItem) > -1 && instance.activeItem !== item) {
      instance.selectItem(instance.activeItem);
    }
    else if (instance.previousActiveItem && visibleItems.indexOf(instance.previousActiveItem) > -1 && instance.previousActiveItem != item) {
      instance.selectItem(instance.previousActiveItem);
    }
    else {
      if (visibleItems[index - 1]) {
        instance.selectItem(visibleItems[index - 1]);
      }
    }

    this.setState({ isExtraTabsListVisible: false });

    var closeItemEvent = global.document.createEvent('CustomEvent');
    closeItemEvent.initCustomEvent('codebasket:closeitem', true, true, {
      codeBasket: instance,
      item: item
    });

    global.dispatchEvent(closeItemEvent);
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
  renderExtraTabs: function renderExtraTabs(items) {
    var extraTabsClasses = this.state.isExtraTabsListVisible ? 'opened' : '';

    return (
      <ul className={'codebasket-options-list ' + extraTabsClasses} ref="extraTabsList">
        {items.map(function(item, index) {
          var onClickCloseTab = this.onClickCloseTab.bind(this, item, index),
              closeButton = item.isCloseable ? <i className="icon icon-close navbar-tab-close" onClick={onClickCloseTab}></i> : undefined,
              tabClasses = item.isActive ? 'active' : '';

          return (
            <li className={tabClasses} key={index}>
              <span className="navbar-tab-title" title={item.name} onClick={this.onClickTab.bind(this, item, index)}>{item.name}</span>
              {closeButton}
            </li>
          );
        }, this)}
      </ul>
    );
  },
  renderMobileNavBarItem: function renderMobileNavBarItem(item, index) {
    var closeButton = item.isCloseable ? <i className="icon icon-close navbar-tab-close" onClick={this.onClickCloseTab.bind(this, item, index)}></i> : undefined,
        itemClasses = 'navbar-tab-title' + (item.isCloseable ? '' : ' fixed');

    return (
      <li className='navbar-tab' key={index}>
        {closeButton}
        <span title={item.name} className={itemClasses} onClick={this.onClickTab.bind(this, item, index)}>{item.name}</span>
      </li>
    );
  },
  renderMobileNavBar: function renderMobileNavBar() {
    var instance = this.props.instance,
        visibleItems = filter(this.props.items, function(item) { return item.isVisible; }),
        activeItem = find(visibleItems, function(item) { return item.isActive; }),
        activeItemIndex = visibleItems.indexOf(activeItem),
        closeButton = (activeItem && activeItem.isCloseable) ? <i className="icon icon-close navbar-tab-close" onClick={this.onClickCloseTab.bind(this, activeItem, activeItemIndex)}></i> : undefined,
        activeItemClasses = 'navbar-tab-title' + ((activeItem && activeItem.isCloseable) ? '' : ' fixed'),
        extraTabsClasses = this.state.isExtraTabsListVisible ? 'opened' : '',
        navBarWidthExcess = this.calculateNavBarWidthExcess();

    return (
      <nav ref="navbar" className="codebasket-navbar touch" style={{ width: 'calc(100% - ' + navBarWidthExcess + 'px)' }}>
        <div className='navbar-placeholder'>
          {closeButton}
          <span className={activeItemClasses} onClick={this.toggleExtraTabs}>{ activeItem ? activeItem.name : 'Tabs'}</span>
          <span className='navbar-tab-toggler' onClick={this.toggleExtraTabs}></span>
        </div>
        <ul className={'navbar-touch ' + extraTabsClasses}>
          {visibleItems.map(this.renderMobileNavBarItem)}
        </ul>
      </nav>
    );
  },
  renderDesktopNavBar: function renderDesktopNavBar() {
    var instance = this.props.instance,
        visibleItems = filter(this.props.items, function(item) { return item.isVisible; }),
        itemsInNavbar = visibleItems.slice(0, this.state.maxVisibleItems),
        itemsOutOfNavbar = difference(visibleItems, itemsInNavbar),
        extraTabsToggler = itemsOutOfNavbar.length > 0 ? this.renderNavButton(this.extraTabsTogglerReference) : undefined,
        extraTabsList = itemsOutOfNavbar.length > 0 ? this.renderExtraTabs(itemsOutOfNavbar) : undefined,
        addButton = (instance.addButton ? this.renderNavButton(instance.addButton) : undefined),
        navBarWidthExcess = this.calculateNavBarWidthExcess();

    return (
      <nav ref="navbar" className="codebasket-navbar" style={{ width: 'calc(100% - ' + navBarWidthExcess + 'px)' }}>
        {itemsInNavbar.map(this.renderTab)}
        {extraTabsToggler}
        {addButton}
        {extraTabsList}
      </nav>
    );
  },
  renderNavBar: function renderNavBar() {
    if (global.matchMedia && global.matchMedia(mediaQueryBreakpoint).matches) {
      return this.renderMobileNavBar();
    }
    else {
      return this.renderDesktopNavBar();
    }
  },
  render: function viewportRender() {
    var instance = this.props.instance,
        activeItem = find(this.props.items, function(item) { return item.isActive; }),
        isActiveItemAFile = activeItem && (activeItem.type === 'file'),
        viewportEmptyClass = (this.props.items.length === 0 || !activeItem) ? 'empty' : '',
        codeEditorClasses = isActiveItemAFile ? 'active' : '';

    return (
      <article className={'codebasket-viewport ' + this.props.viewportClasses.trim() + ' ' + viewportEmptyClass}>
        {this.renderNavBar()}
        <div className={'codebasket-tabpage ' + codeEditorClasses}>
          <CodeEditor ref="editor" instance={instance} isActive={isActiveItemAFile} />
        </div>
        {this.props.items.map(this.renderTabPage)}
      </article>
    );
  }
});

module.exports = Viewport;