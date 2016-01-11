'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    find = require('lodash/collection/find'),
    tinyscrollbar = require('../vendors/tinyscrollbar'),
    ToolBarButton = require('./toolbar_button'),
    CodeEditor = require('./code_editor'),
    Browser = require('./browser'),
    Libraries = require('../libraries'),
    TabsContainer;

TabsContainer = React.createClass({
  getInitialState: function() {
    return { isOptionsListVisible: false, isModalVisible: false };
  },
  componentDidMount: function() {
    var codeBasket = this.props.app;

    tinyscrollbar(this.refs['tabs-container'], { axis: 'x' });

    codeBasket.editor = this.refs.editor.editor;

    var editorReadyEvent = new global.CustomEvent('codebasket:editorready', {
      detail: {
        codeBasket: codeBasket
      }
    });

    global.dispatchEvent(editorReadyEvent);
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
      this.refs['tabpage-' + index].focus();
    }

    var tabSelectedEvent = new global.CustomEvent('codebasket:tabselected', {
      detail: {
        codeBasket: codeBasket,
        tab: item,
        tabIndex: index
      }
    });

    global.dispatchEvent(tabSelectedEvent);
  },
  onDoubleClickTab: function(item, index, event) {
    event.preventDefault();

    var codeBasket = this.props.app,
        newName = prompt('Enter the new name', item.name);

    if (newName && newName !== '') {
      codeBasket.renameItem(item, newName);
    }
  },
  closeTab: function(item, index) {
    var codeBasket = this.props.app,
        visibleItems = filter(this.props.items, function(item) { return item.isVisible; });

    item.isVisible = false;

    if (visibleItems.length > 0 && visibleItems[index - 1]) {
      codeBasket.selectItem(visibleItems[index - 1]);
    }
    else {
      this.render();
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
  renderTab: function(item, index) {
    var closeButton,
        editText,
        onClick = this.onClickTab.bind(null, item, index),
        onDoubleClick = this.onDoubleClickTab.bind(null, item, index),
        closeableTabClass = (item.isCloseable ? ' closeable' : ''),
        activeTabClass = (item.isActive ? ' active' : ''),
        editModeTabClass = (item.isEditing ? ' edit-mode' : ''),
        changedTabClass = (item.hasChanged ? ' changed' : ''),
        tabClasses = 'console-tab' + closeableTabClass + activeTabClass + editModeTabClass + changedTabClass;

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
      <a href="#" className={tabClasses} onClick={onClick} onDoubleClick={onDoubleClick} key={index}>
        {editText}
        <span className="console-tab-text" title={item.title}>{item.name.split('/').pop()}</span>
        {closeButton}
      </a>
    );
  },
  renderTabPage: function(item, index) {
    if (item.type === 'file') {}
    else if (item.type === 'browser') {
      return (
        <Browser item={item} key={index} />
      );
    }
    else if (item.type === 'terminal') {
      return (
        <iframe ref={'terminal-' + index} className={'console-tabpage' + (item.isActive ? ' active' : '')} data-identifier={item.id} title="Press enter to submit commands" src={item.location + '?id=' + item.id + '&console_id=' + item.consoleId} key={index}></iframe>
      );
    }
    else {
      return (
        <iframe ref={'tabpage-' + index} className={'console-tabpage' + (item.isActive ? ' active' : '')} src={item.location} key={index}></iframe>
      );
    }
   },
  render: function() {
    var visibleItems = filter(this.props.items, function(item) { return item.isVisible; }),
        activeItem = find(this.props.items, function(item) { return item.isActive; }),
        isActiveItemAFile = activeItem && (activeItem.type === 'file');

    var codeBasket = this.props.app;
    var isSidebarVisible = this.props.parentView.state.isSidebarVisible,
        toolbarOptions = codeBasket.toolbarOptions.map(function(toolbarOption, index) {
          return (
            <ToolBarButton onClick={toolbarOption.action} title={toolbarOption.title} className={toolbarOption.icon} key={index} />
          );
        }),
        optionsButton,
        optionsList = codeBasket.options.map(function(optionItem, index) {
          var optionIdentifier = optionItem.title.toLowerCase().replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '-');

          return (
            <a key={index} className={'console-option-' + optionIdentifier} target={optionItem.target} href={optionItem.href} onClick={optionItem.action}>
              <i className={'fa ' + optionItem.icon}></i> {optionItem.title}
            </a>
          );
        });

    var librariesCollection = map(Libraries, function(versions, libraryName) {
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
    }, this);

    if (optionsList.length > 0) {
      optionsButton = <ToolBarButton onClick={this.toggleOptions} title="Options" className={'with-caret fa-cog' + (this.state.isOptionsListVisible ? ' active' : '')} />;
    }

    return (
      <aside className="console-tabs-container">
        <nav className="console-tabs">
          <ToolBarButton onClick={this.props.parentView.toggleSidebar} title="Toggle sidebar" className={'with-border ' + (isSidebarVisible ? 'fa-caret-left' : 'fa-caret-right')} />
          <article ref="tabs-container" className="console-tabs-left">
            <div className="scrollbar"><div className="track"><div className="thumb"><div className="end"></div></div></div></div>
            <div className="viewport">
              <div className="overview">
                {visibleItems.map(this.renderTab)}
              </div>
            </div>
          </article>
          <ToolBarButton onClick={this.toggleModal} id="add-tab" title="Add tab" className="fa-plus" />
          <article className="console-tabs-right">
            <label htmlFor="live" className="hidden">
              <input type="checkbox" id="live" />
              Live preview?
            </label>
            {toolbarOptions}
            {optionsButton}
            <aside className={'console-options' + (this.state.isOptionsListVisible ? ' visible' : '')}>{optionsList}</aside>
          </article>
        </nav>
        <section className="console-tabpages">
          <CodeEditor ref="editor" parentView={this.props.parentView} app={this.props.app} isActive={isActiveItemAFile} />
          {this.props.items.map(this.renderTabPage)}
        </section>
        <section className={'console-modal-overlay' + (this.state.isModalVisible ? ' visible' : '')}>
          <h2 className="console-modal-title">Libraries & Frameworks</h2>
          <article className="console-modal-content">{librariesCollection}</article>
          <ul className="console-container-modes-list"></ul>
        </section>
      </aside>
    );
  }
});

module.exports = TabsContainer;