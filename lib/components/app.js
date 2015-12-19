'use strict';

var React = require('react'),
    TabsContainer = require('./tabs_container'),
    ToolBarButton = require('./toolbar_button'),
    App;

App = React.createClass({
  getInitialState: function() {
    return { isSidebarVisible: true, isProgressBarVisible: false };
  },
  toggleSidebar: function() {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  },
  render: function() {
    var codeBasket = this.props.codeBasket;

    return (
      <main className="console-container with-location-bar with-sidebar with-footer">
        <section className="console-wrapper">
          <aside className={'console-sidebar-container' + (this.state.isSidebarVisible ? ' visible' : '')}>
            <nav className="console-sidebar-actions">
              <ToolBarButton onClick={this.addFile} title="Add file" className="with-plus fa-file" />
              <ToolBarButton onClick={this.addFolder} title="Add folder" className="with-plus fa-folder" />
              <ToolBarButton onClick={this.reload} title="Reload files" className="fa-refresh" />
            </nav>
            <dl className="console-sidebar sidebar-empty"></dl>
          </aside>
          <TabsContainer items={codeBasket.items} app={codeBasket} parentView={this} />
        </section>
        <footer className="console-footer">
          <a className="console-brand" href="http://codepicnic.com?utm_medium=embed&amp;utm_source=codepicnic.com&amp;utm_campaign=console" target="_blank">
            <img className="console-brand-image" src="https://s3.amazonaws.com/production.pym.herokuapp/brands/logos/000/000/006/small/codepicnic_logo.png?1424137485" />
          </a>
          <span className="console-footer-permanent-status"></span>
          <span className="console-footer-status"></span>
          <progress className={'console-footer-progress' + (this.state.isProgressBarVisible ? ' visible' : '')} max="100"></progress>
        </footer>
        <section className="console-modal-overlay console-container-add">
          <h2 className="console-modal-title">Select new file type</h2>
          <ul className="console-container-modes-list"></ul>
          <ul className="console-container-libraries-list"></ul>
        </section>
      </main>
    );
  }
});

module.exports = App;