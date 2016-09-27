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

    this.props.instance.emit('ready', { codeBasket: this.props.instance });
  },
  render: function() {
    var instance = this.props.instance,
        selectedInstanceItem = find(this.props.instance.items, function(item) {
          return item.type === 'file' && item.isActive;
        }),
        selectedItem = selectedInstanceItem && instance.findInSidebar(selectedInstanceItem.name);

    return (
      <section className="codebasket-main">
        <Sidebar isVisible={this.state.isSidebarVisible} selectedItem={selectedItem} actions={instance.sidebarActions} instance={instance} />
        <Content isFull={!this.state.isSidebarVisible} splitMode={this.state.splitMode} actions={instance.actions} instance={instance} />
        <Footer brand={instance.brand} permanentStatus={instance.permanentStatus} status={instance.status} />
      </section>
    );
  }
});

module.exports = CodeBasketView;