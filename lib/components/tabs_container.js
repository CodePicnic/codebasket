'use strict';

var React = require('react'),
    ToolBarButton = require('./toolbar_button'),
    CodeEditor = require('./code_editor'),
    Browser = require('./browser'),
    find = require('lodash/collection/find'),
    TabsContainer;

TabsContainer = React.createClass({
  getInitialState: function() {
    return { isOptionsListVisible: false };
  },
  componentDidMount: function() {
    // console.log(this.refs.editor.getDOMNode());
  },
  onTabClick: function(item, index, event) {
    event.preventDefault();

    var codeBasket = this.props.app;

    codeBasket.selectItem(item);

    var tabSelectedEvent = new global.CustomEvent('codebasket:tabselected', {
      detail: {
        codeBasket: codeBasket,
        tab: item,
        tabIndex: index
      }
    });

    global.dispatchEvent(tabSelectedEvent);
  },
  toggleOptions: function() {
    this.setState({ isOptionsListVisible: !this.state.isOptionsListVisible });
  },
  renderTab: function(item, index) {
    var closeButton;

    if (item.isCloseable) {
      closeButton = (
        <small className="console-tab-close" title="Close"><i className="fa fa-times"></i></small>
      );
    }

    return (
      <a href="#" className={'console-tab' + (item.isCloseable ? ' closeable' : '') + (item.isActive ? ' active' : '')} onClick={this.onTabClick.bind(null, item, index)} key={index}>
        <span className="console-tab-text" title={item.title}>{item.name}</span>
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
        <iframe className={'console-tabpage' + (item.isActive ? ' active' : '')} data-identifier={item.id} title="Press enter to submit commands" src={item.location + '?id=' + item.id + '&console_id=' + item.consoleId} key={index}></iframe>
      );
    }
    else {
      return (
        <iframe className={'console-tabpage' + (item.isActive ? ' active' : '')} src={item.location} key={index}></iframe>
      );
    }
   },
  render: function() {
    var visibleItems = this.props.items.filter(function(item) { return item.isVisible; }),
        activeItem = find(this.props.items, function(item) { return item.isActive; }),
        isActiveItemAFile = activeItem && (activeItem.type === 'file');

    // var codeBasket = this.props.codeBasket;
    var isSidebarVisible = this.props.parentView.state.isSidebarVisible,
        toolbarOptions = this.props.app.toolbarOptions.map(function(toolbarOption, index) {
          return (
            <ToolBarButton onClick={toolbarOption.action} title={toolbarOption.title} className={toolbarOption.icon} key={index} />
          );
        }),
        optionsList = this.props.app.options.map(function(optionItem, index) {
          return (
            <li key={index}>
              <a target={optionItem.target} href={optionItem.href}>
                <i className={'fa ' + optionItem.icon}></i> {optionItem.title}
              </a>
            </li>
          );
        });

    return (
      <aside className="console-tabs-container">
        <nav className="console-tabs">
          <ToolBarButton onClick={this.props.parentView.toggleSidebar} title="Toggle sidebar" className={'with-border ' + (isSidebarVisible ? 'fa-caret-left' : 'fa-caret-right')} />
          <article className="console-tabs-left">
            {visibleItems.map(this.renderTab)}
          </article>
          <ToolBarButton onClick={this.addTab} id="add-tab" title="Add tab" className="fa-plus" />
          <article className="console-tabs-right">
            <label htmlFor="live" className="hidden">
              <input type="checkbox" id="live" />
              Live preview?
            </label>
            {toolbarOptions}
            <ToolBarButton onClick={this.toggleOptions} title="Options" className={'with-caret fa-cog' + (this.state.isOptionsListVisible ? ' active' : '')} />
            <ul className={'console-options' + (this.state.isOptionsListVisible ? ' visible' : '')}>{optionsList}</ul>
          </article>
        </nav>
        <section className="console-tabpages">
          <CodeEditor ref="editor" parentView={this.props.parentView} app={this.props.app} isActive={isActiveItemAFile} />
          {this.props.items.map(this.renderTabPage)}
        </section>
      </aside>
    );
  }
});

module.exports = TabsContainer;