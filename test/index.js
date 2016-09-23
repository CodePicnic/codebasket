var codeBasket;

describe('Creating a CodeBasket', function() {
  function onReady() {
    console.log('codebasket:ready');
  }

  function onTabSelected() {
    console.log('codebasket:tabselected');
  }

  var spies = { onReady: onReady, onTabSelected: onTabSelected };
  var options = [{
        title: 'Edit',
        icon: 'fa-pencil',
        href: '#'
      },
      {
        title: 'Fork',
        icon: 'icon-option-fork'
      },
      {
        title: 'Share',
        icon: 'icon-share'
      }],
      sidebarActions = [{
        title: 'Add file',
        icon: 'icon-new-file',
        action: function() {}
      },{
        title: 'Add folder',
        icon: 'icon-new-folder',
        action: function() {}
      },{
        title: 'Reload',
        icon: 'icon-refresh',
        action: function() {}
      }],
      actions = [{
        title: 'Run',
        icon: 'icon-play',
        href: '#'
      },{
        title: 'Browser',
        icon: 'icon-browser',
        href: '#',
        action: function() {
          var browser = _.find(codeBasket.items, function(item) { return item.type === 'browser' });

          codeBasket.selectItem(browser);
        },
        isVisible: true
      }],
      sidebarItems = {
        "index.js": {
          name: "index.js",
          path: "index.js",
          type: "text/plain",
          size: 2049
        },
        "index.scss": {
          name: "index.scss",
          path: "index.scss",
          type: "text/plain",
          size: 1024
        },
        "index.css": {
          name: "index.css",
          path: "index.css",
          type: "text/plain",
          size: 1024
        },
        "index.html": {
          name: "index.html",
          path: "index.html",
          type: "text/plain",
          size: 1024
        }
      },
      items = [{
        location: 'http://codepen.io/philipwalton/embed/LEbQON/?height=268&theme-id=0&default-tab=result',
        title: 'CodePen',
        name: 'CodePen',
        isActive: true,
        pane: 'secondary'
      },
      {
        location: 'https://www.youtube.com/embed/3qI-XExjyC4',
        title: 'YouTube',
        name: 'YouTube',
        pane: 'main'
      },
      {
        type: 'file',
        language: 'js',
        name: 'index.js',
        title: 'index.js',
        content: 'var content = {};'
      },
      {
        type: 'file',
        language: 'sass',
        name: 'index.scss',
        title: 'index.scss',
        content: '$grey200: #dadada;\nbody { background-color: $grey200; }'
      },
      {
        type: 'file',
        language: 'html',
        name: 'index.html',
        title: 'index.html',
        content: '<p></p>'
      },
      {
        type: 'file',
        language: 'css',
        name: 'index.css',
        title: 'index.css',
        content: 'body { background-color: #dadada; }'
      },
      {
        type: 'browser',
        location: 'https://www.youtube.com/embed/3qI-XExjyC4',
        title: 'YouTube',
        name: 'YouTube',
        isCloseable: true,
        isVisible: false
      }],
      brand = {
        href: 'https://codepicnic.com',
        image: 'codepicnic_logo.png'
      };

  expect.spyOn(spies, 'onReady').andCallThrough();
  expect.spyOn(spies, 'onTabSelected').andCallThrough();

  it('should throw an error if element is not defined', function() {
    expect(function() {
      CodeBasket.create({});
    }).toThrow('You need to set a container element');
  });

  it('should create a UI', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      brand: brand
    });

    codeBasket.on('ready', spies.onReady);

    codeBasket.render();

    expect(codeBasket).toExist();
  });

  it('should create an options list', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      options: options,
      brand: brand
    });

    codeBasket.render();

    expect(codeBasket.element.querySelectorAll('.codebasket-options-list > *').length).toEqual(options.length);
  });

  it('should create tabs', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      items: items,
      actions: actions,
      options: options,
      brand: brand
    });

    codeBasket.render();

    expect(codeBasket.element.querySelectorAll('.codebasket-navbar .navbar-tab').length).toEqual(codeBasket.items.filter(function(item) { return item.isVisible === true }).length);
  });

  it('should create a sidebar buttons list', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      items: items,
      sidebarActions: sidebarActions,
      sidebarItems: sidebarItems,
      actions: actions,
      options: options,
      brand: brand
    });

    codeBasket.render();

    expect(codeBasket.element.querySelectorAll('.codebasket-sidebar > .codebasket-navbar > *').length).toEqual(sidebarActions.length);
  });

  it ('should support custom events', function() {
    codeBasket = CodeBasket.create({
      element: '#codebasket-test',
      items: items,
      sidebarActions: sidebarActions,
      sidebarItems: sidebarItems,
      actions: actions,
      options: options,
      brand: brand,
      permanentStatus: 'Register now to save your changes'
    });

    codeBasket.users = [
      {
        color: 'red',
        name: 'User 2'
      }
    ];

    codeBasket.currentUser = {
      color: 'blue',
      name: 'User'
    };

    codeBasket.on('tabselected', spies.onTabSelected);

    codeBasket.render();

    expect(spies.onReady).toHaveBeenCalled();

    var secondTab = codeBasket.element.querySelector('.navbar-tab:nth-child(2) span.navbar-tab-title'),
        clickEvent = document.createEvent('MouseEvent');

    clickEvent.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);

    secondTab.dispatchEvent(clickEvent);
    expect(spies.onTabSelected).toHaveBeenCalled();
  });
});