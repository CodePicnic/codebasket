'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    find = require('lodash/collection/find'),
    tinyscrollbar = require('../vendors/tinyscrollbar'),
    ToolBarButton = require('./toolbar_button'),
    CodeEditor = require('./code_editor'),
    Browser = require('./browser'),
    Terminal = require('./terminal'),
    Libraries = require('../libraries'),
    useScrollbarPlugin = true,// !global.navigator.userAgent.match(/macintosh/ig),
    TabsContainer;

TabsContainer = React.createClass({
  getInitialState: function() {
    return { isOptionsListVisible: false, isModalVisible: false };
  },
  componentDidMount: function() {
    var codeBasket = this.props.app,
        inSimpleMode = this.props.simple,
        container = this.refs['tabs-container'];

    this.scrollToActiveItem();
    container.addEventListener('move', this.applyScrollShadow);

    if (inSimpleMode) {
      return;
    }

    if (this.refs.editor) {
      var editor = this.refs.editor.editor;
      codeBasket.editor = editor;

      global.addEventListener('codebasket:ready', function() {
        var editorReadyEvent = global.document.createEvent('CustomEvent');
        editorReadyEvent.initCustomEvent('codebasket:editorready', true, true, {
          codeBasket: codeBasket,
          editor: editor
        });

        global.dispatchEvent(editorReadyEvent);
      });
    }
  },
  componentDidUpdate: function() {
    if (this.refs.editor) {
      this.props.app.editor = this.refs.editor.editor;
    }

    if (useScrollbarPlugin) {
      this.scrollToActiveItem();
      setTimeout(this.scrollToActiveItem, 710);
    }
  },
  applyScrollShadow: function() {
    var container = this.refs['tabs-container'];

    if (!container) {
      return;
    }

    var overview = container.querySelector('.console-tabs .overview'),
        viewport = container.querySelector('.console-tabs .viewport'),
        overviewParentWidth,
        overviewOffsetLeft,
        overviewOffsetWidth,
        delta;

    if (global.requestAnimationFrame || global.webkitRequestAnimationFrame) {
      (global.requestAnimationFrame || global.webkitRequestAnimationFrame)(function() {
        overviewParentWidth = overview.parentElement.offsetWidth;
        overviewOffsetWidth = overview.offsetWidth;
        overviewOffsetLeft = overview.offsetLeft;
        delta = (overviewParentWidth - overviewOffsetWidth);

        if (overviewOffsetLeft <= delta) {
          viewport.classList.remove('offset-right');
        }
        else {
          viewport.classList.add('offset-right');
        }

        if (overviewOffsetLeft === 0) {
          viewport.classList.remove('offset-left');
        }
        else {
          viewport.classList.add('offset-left');
        }
      });
    }
  },
  scrollToActiveItem: function() {
    var codeBasket = this.props.app,
        visibleItems = filter(this.props.items, function(item) { return item.isVisible; }),
        activeItem = find(visibleItems, function(item) { return item.isActive; }),
        container = this.refs['tabs-container'];

    if (!activeItem) {
      return;
    }

    if (!container) {
      return;
    }

    var overview = container.querySelector('.console-tabs .overview'),
        viewport = container.querySelector('.console-tabs .viewport'),
        viewportWidth = viewport.clientWidth,
        overviewWidth = overview.clientWidth,
        tabActive = container.querySelector('.console-tab.active');

    if (!tabActive) {
      return;
    }

    var activeItemWidth = tabActive.offsetWidth,
        activeItemOffsetLeft = tabActive.offsetLeft,
        scroll = (overviewWidth > viewportWidth) ? (activeItemWidth - (viewportWidth - activeItemOffsetLeft)) : (0);

        scroll = (scroll < 0 ? 0 : scroll);

    if (useScrollbarPlugin) {
      tinyscrollbar(container, { axis: 'x' }).update(scroll);
      this.applyScrollShadow();
    }
  },
  onClickTab: function(item, index, event) {
    event.preventDefault();

    var codeBasket = this.props.app;
    codeBasket.selectItem(item, index);

    if (item.type === 'file') {
      if (item.session && codeBasket.editor) {
        codeBasket.editor.focus();
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
  onDoubleClickTab: function(item, index, event) {
    event.preventDefault();
    event.stopPropagation();

    var codeBasket = this.props.app,
        oldName = item.name,
        newName = prompt('Enter the new name', item.name);

    if (newName && newName !== '') {
      codeBasket.renameItem(item, newName);

      var renameItemEvent = global.document.createEvent('CustomEvent');
      renameItemEvent.initCustomEvent('codebasket:renameitem', true, true, {
        codeBasket: codeBasket,
        item: item,
        oldName: oldName,
        newName: newName
      });

      global.dispatchEvent(renameItemEvent);
    }
  },
  closeTab: function(item, index, event) {
    event.preventDefault();
    event.stopPropagation();

    var codeBasket = this.props.app,
        visibleItems = filter(this.props.items, function(item) { return item.isVisible; });

    item.isVisible = false;

    if (visibleItems.length > 0 && visibleItems[index - 1]) {
      codeBasket.selectItem(visibleItems[index - 1]);
    }

    this.render();

    var closeItemEvent = global.document.createEvent('CustomEvent');
    closeItemEvent.initCustomEvent('codebasket:closeitem', true, true, {
      codeBasket: codeBasket,
      item: item
    });

    global.dispatchEvent(closeItemEvent);
  },
  closeOptionsList: function(callback, event) {
    this.setState({ isOptionsListVisible: false });

    if (callback) {
      callback(event);
    }
  },
  toggleOptions: function() {
    this.setState({ isOptionsListVisible: !this.state.isOptionsListVisible });
  },
  toggleModal: function() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  },
  toggleLibrary: function(library) {
    var codeBasket = this.props.app;

    codeBasket.toggleLibrary(library);

    this.setState({ libraries: codeBasket.libraries });
  },
  onChangeEditText: function(item, event) {
    item.name = event.target.value;
  },
  renderTab: function renderTab(item, index) {
    var closeButton,
        editText,
        onClick = this.onClickTab.bind(null, item, index),
        onDoubleClick = this.onDoubleClickTab.bind(null, item, index),
        typeClass = (' ' + (item.type || 'page')),
        closeableTabClass = (item.isCloseable ? ' closeable' : ''),
        activeTabClass = (item.isActive ? ' active' : ''),
        editModeTabClass = (item.isEditing ? ' edit-mode' : ''),
        changedTabClass = (item.hasChanged ? ' changed' : ''),
        tabClasses = 'console-tab' + typeClass + closeableTabClass + activeTabClass + editModeTabClass + changedTabClass;

    if (item.isCloseable) {
      closeButton = (
        <small className="console-tab-close" title="Close" onClick={this.closeTab.bind(null, item, index)}><i className="fa fa-times"></i></small>
      );
    }

    if (item.type === 'file') {
      editText = (
        <input ref="editText" type="text" className="console-tab-text" value={item.name} onChange={this.onChangeEditText.bind(null, item)} />
      );
    }

    return (
      <span className={tabClasses} onDoubleClick={(item.type === 'file') ? onDoubleClick : null} key={index}>
        {editText}
        <span className="console-tab-text" title={item.title} onClick={onClick}>{item.name.split('/').pop()}</span>
        {closeButton}
      </span>
    );
  },
  renderTabPage: function renderTabPage(item, index) {
    if (item.type === 'file') {}
    else if (item.type === 'browser') {
      return <Browser ref={'tabpage-' + item.id} item={item} key={index} />;
    }
    else if (item.type === 'terminal') {
      return <Terminal ref={'tabpage-' + item.id} item={item} key={index} />;
    }
    else {
      return (
        <iframe ref={'tabpage-' + item.id} className={'console-tabpage' + (item.isActive ? ' active' : '')} src={item.location} key={index}></iframe>
      );
    }
  },
  renderToolbarOption: function renderToolbarOption(toolbarOption, index) {
    return (
      <ToolBarButton onClick={toolbarOption.action} title={toolbarOption.title} className={toolbarOption.icon} key={index} />
    );
  },
  renderOption: function renderOption(option, index) {
    var optionIdentifier = option.id || option.title.toLowerCase().replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '-');

    if (option.action) {
      return (
        <span key={index} className={'console-option-' + optionIdentifier} onClick={this.closeOptionsList.bind(this, option.action)}>
          <i className={'fa ' + option.icon}></i> {option.title}
        </span>
      );
    }
    else {
      return (
        <a key={index} className={'console-option-' + optionIdentifier} target={option.target || null} href={option.href || null} onClick={this.closeOptionsList.bind(this, null)}>
          <i className={'fa ' + option.icon}></i> {option.title}
        </a>
      );
    }
  },
  renderLibrary: function renderLibrary(versions, libraryName) {
    var versions = map(versions, function(url, version) {
      return (
        <dd className="console-libraries-list-value" key={libraryName.toLowerCase() + '-' + version}>
          <label>
            <input type="checkbox" checked={codeBasket.hasLibrary(url)} onChange={this.toggleLibrary.bind(null, url)} />
            {libraryName + ' ' + version}
          </label>
        </dd>
      );
    }, this);

    return (
      <dl className="console-libraries-list" key={libraryName}>
        <dt className="console-libraries-list-title">{libraryName}</dt>
        {versions}
      </dl>
    );
  },
  renderAddTabButton: function renderAddTabButton() {
    return (
      <ToolBarButton onClick={this.props.app.uiOptions.addAction || this.toggleModal} id="add-tab" title="Add tab" className={'fa-plus' + (this.state.isModalVisible ? ' active' : '')} />
    );
  },
  renderOptionsButton: function renderAddTabButton() {
    return (
      <ToolBarButton onClick={this.toggleOptions} title="Options" className={'with-caret fa-cog' + (this.state.isOptionsListVisible ? ' active' : '')} />
    );
  },
  renderTabList: function renderTabList() {
    var visibleItems = filter(this.props.items, function(item) { return item.isVisible; });

    if (useScrollbarPlugin) {
      return (
        <article ref="tabs-container" className="console-tabs-left">
          <div className="scrollbar"><div className="track"><div className="thumb"><div className="end"></div></div></div></div>
          <div className="viewport">
            <div className="overview">
              {visibleItems.map(this.renderTab)}
            </div>
          </div>
        </article>
      );
    }
    else {
      return (
        <article ref="tabs-container" className="console-tabs-left scrollable">
          {visibleItems.map(this.renderTab)}
        </article>
      );
    }
  },
  renderTabStrip: function renderTabStrip() {
    var codeBasket = this.props.app,
        inSimpleMode = this.props.simple,
        visibleToolbarOptions = filter(codeBasket.toolbarOptions, function(item) {
          return item.isVisible;
        }),
        visibleOptions = filter(codeBasket.options, function(item) {
          return item.isVisible !== false;
        }),
        optionsList = map(visibleOptions, this.renderOption),
        activeItem = find(this.props.items, function(item) { return item.isActive; }),
        isActiveItemAFile = activeItem && (activeItem.type === 'file'),
        isFullScreen = this.props.parentView.state.isFullScreen,
        isSidebarVisible = isFullScreen || this.props.parentView.state.isSidebarVisible,
        addTab = (this.props.app.uiOptions.isAddTabVisible ? this.renderAddTabButton() : undefined),
        tabsList = this.renderTabList(),
        optionsButton = (optionsList.length > 0 ? this.renderOptionsButton() : undefined);

    if (inSimpleMode) {
      return (
        <nav className={'console-tabs' + (isFullScreen ? ' collapsed' : '')}>
          {tabsList}
        </nav>
      );
    }
    else {
      return (
        <nav className={'console-tabs' + (isFullScreen ? ' collapsed' : '')}>
          <ToolBarButton onClick={this.props.parentView.toggleSidebar} title="Toggle sidebar" className={'with-border ' + (isSidebarVisible ? 'fa-caret-left' : 'fa-caret-right')} id="toggle-sidebar" />
          {tabsList}
          {addTab}
          <article className="console-tabs-right">
            {map(visibleToolbarOptions, this.renderToolbarOption)}
            {optionsButton}
            <aside className={'console-options' + (this.state.isOptionsListVisible ? ' visible' : '')}>{optionsList}</aside>
          </article>
        </nav>
      );
    }
  },
  renderFloatingActionButton: function renderFloatingActionButton(action, index) {
    return (
      <ToolBarButton onClick={action.action} title={action.title} className={action.icon} key={index} />
    );
  },
  renderFloatingActionButtons: function renderFloatingActionButtons() {
    var activeItem = find(this.props.items, function(item) { return item.isActive; }),
        floatingActionButtonsForFiles = filter(this.props.app.floatingButtons, function(action) {
          return action.type === 'file';
        }),
        floatingActionButtonsForOthers = filter(this.props.app.floatingButtons, function(action) {
          return action.type !== 'file';
        }),
        isActiveItemAFile = activeItem && (activeItem.type === 'file'),
        isFullScreen = this.props.parentView.state.isFullScreen,
        floatingActionButton,
        otherFloatingActionButtons;

    if (activeItem) {
      if (isActiveItemAFile) {
        floatingActionButton = <ToolBarButton onClick={this.props.parentView.toggleFullScreen} title="Toggle full screen" className={isFullScreen ? 'fa-compress' : 'fa-expand'} />;
        otherFloatingActionButtons = floatingActionButtonsForFiles.map(this.renderFloatingActionButton);
      }
      else {
        floatingActionButton = <ToolBarButton onClick={this.props.app.moveItemToPane.bind(this.props.app, activeItem)} title={'Move to ' + (activeItem.pane === 'bottom' ? 'top' : 'bottom')} className={activeItem.pane === 'bottom' ? 'fa-arrow-up' : 'fa-arrow-down'} />;
        otherFloatingActionButtons = floatingActionButtonsForOthers.map(this.renderFloatingActionButton);
      }
    }

    return (
      <section className={'console-floating-actions' + (isFullScreen ? ' full-screen' : '')}>
        {floatingActionButton}
        {otherFloatingActionButtons}
      </section>
    );
  },
  render: function render() {
    var codeBasket = this.props.app,
        inSimpleMode = this.props.simple,
        librariesCollection = map(Libraries, this.renderLibrary, this),
        activeItem = find(this.props.items, function(item) { return item.isActive; }),
        isActiveItemAFile = activeItem && (activeItem.type === 'file');

    if (inSimpleMode) {
      return (
        <aside className="console-tabs-container">
          {this.renderTabStrip()}
          <section className={'console-tabpages' + (activeItem ? '' : ' empty')}>
            {this.props.items.map(this.renderTabPage)}
          </section>
          {this.renderFloatingActionButtons()}
        </aside>
      );
    }
    else {
      return (
        <aside className="console-tabs-container">
          {this.renderTabStrip()}
          <section className={'console-tabpages' + (activeItem ? '' : ' empty')}>
            <CodeEditor ref="editor" parentView={this} app={this.props.app} isActive={isActiveItemAFile} />
            {this.props.items.map(this.renderTabPage)}
          </section>
          <section className={'console-modal-overlay' + (this.state.isModalVisible ? ' visible' : '')}>
            <h2 className="console-modal-title">Libraries & Frameworks</h2>
            <article className="console-modal-content">{librariesCollection}</article>
            <ul className="console-container-modes-list"></ul>
          </section>
          {this.renderFloatingActionButtons()}
        </aside>
      );
    }
  }
});

module.exports = TabsContainer;