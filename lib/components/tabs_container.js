'use strict';

var React = require('react'),
    ToolBarButton = require('./toolbar_button'),
    CodeEditor = require('./code_editor'),
    map = require('lodash/collection/map'),
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
    this.props.app.selectItem(item);
  },
  toggleOptions: function() {
    this.setState({ isOptionsListVisible: !this.state.isOptionsListVisible });
  },
 renderTab: function(item, index) {
   // // if (item.type === 'file') {
   // if (false) {
   //
   // }
   // else {
   //   // return <Tab item={item} />
   //   return (
   //     <a href="#" className="{'console-tab' + item.isActive ? ' active' : ''}" onClick={this.onTabClick}>
   //       <span className="console-tab-text" title={item.title}>{item.title}</span>
   //       <small className="console-tab-remove" title="Close">✖</small>
   //     </a>
   //   );
   // }
   return (
     <a href="#" className={'console-tab' + (item.isActive ? ' active' : '')} onClick={this.onTabClick.bind(null, item, index)} data-mode={item.language} key={index}>
       <span className="console-tab-text" title={item.title}>{item.name}</span>
       <small className="console-tab-close" title="Close">✖</small>
     </a>
   );
 },
  renderTabPage: function(item, index) {
    if (item.type === 'file') {}
    else if (item.type === 'browser') {
      return (
        <div className={'console-tabpage console-browser-container' + (item.isActive ? ' active' : '')} key={index}>
          <div className="console-browser-location-bar-container">
            <nav className="console-browser-location-buttons-container">
              <a href="#" className="console-container-reload-result"><i className="fa fa-repeat"></i></a>
            </nav>
            <input className="console-browser-location-bar" type="url" />
          </div>
          <iframe className="console-browser" src="/blank"></iframe>
          <ToolBarButton onClick={this.clearLog} title="Clear" className="fa-ban" />
          <ul className="console-container-log"></ul>
        </div>
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
    // var codeBasket = this.props.codeBasket;
    var isSidebarVisible = this.props.parentView.state.isSidebarVisible,
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
            {this.props.items.map(this.renderTab)}
          </article>
          <ToolBarButton onClick={this.addTab} id="add-tab" title="Add tab" className="fa-plus" />
          <article className="console-tabs-right">
            <label htmlFor="live" id="console-live">
              <input type="checkbox" id="live" />
              Live preview?
            </label>
            <ToolBarButton onClick={this.run} title="Run" className="fa-play" />
            <ToolBarButton onClick={this.showBrowser} title="Browser" className="fa-globe" />
            <ToolBarButton onClick={this.toggleOptions} title="Options" className={'with-caret fa-cog' + (this.state.isOptionsListVisible ? ' active' : '')} />
            <ul className={'console-options' + (this.state.isOptionsListVisible ? ' visible' : '')}>{optionsList}</ul>
          </article>
        </nav>
        <section className="console-tabpages">
          <CodeEditor ref="editor" />
          {this.props.items.map(this.renderTabPage)}
        </section>
      </aside>
    );
  }
});

module.exports = TabsContainer;