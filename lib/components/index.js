'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    find = require('lodash/collection/find'),
    Sidebar = require('./sidebar'),
    Content = require('./content'),
    Footer = require('./footer'),
    CodeBasketView;

CodeBasketView = React.createClass({
  getInitialState: function() {
    return this.props.instance.uiOptions;
  },
  componentDidMount: function() {
    this.props.instance.view = this.props.instance.view || this;
    this.tabsContainer = this.refs.tabsContainer;

    var readyEvent = global.document.createEvent('CustomEvent');
    readyEvent.initCustomEvent('codebasket:ready', true, true, {
      codeBasket: this.props.instance
    });

    global.dispatchEvent(readyEvent);
  },
  render: function() {
    var instance = this.props.instance,
        selectedInstanceItem = find(this.props.instance.items, function(item) {
          return item.type === 'file' && item.isActive;
        }),
        selectedItem = selectedInstanceItem && instance.findInSidebar(selectedInstanceItem.name);

    return (
      <section className="codebasket-main">
        <Sidebar isVisible={this.state.isSidebarVisible} isLoading={this.state.isSidebarLoading} selectedItem={selectedItem} actions={instance.sidebarActions} instance={instance} />
        <Content isFull={!this.state.isSidebarVisible} splitMode={this.state.splitMode} actions={instance.actions} instance={instance} />
        <Footer brand={instance.brand} permanentStatus={instance.permanentStatus} status={instance.status} users={instance.users} isProgressBarVisible={this.state.isProgressBarVisible} />
      </section>
    );
  }
});

module.exports = CodeBasketView;