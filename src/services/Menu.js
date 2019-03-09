import nw from 'nw';

export default class Menu {
  static setUp(structure) {
    const menu = new nw.Menu({ type: 'menubar' });
    Object.keys(structure).forEach((menuItemName) => {
      const submenuItems = structure[menuItemName];
      menu.append(new nw.MenuItem({
        label: menuItemName,
        submenu: (() => {
          const subMenu = new nw.Menu();
          Object.keys(submenuItems).forEach((subMenuItemName) => {
            if (subMenuItemName.startsWith('separator') === true) {
              subMenu.append(new nw.MenuItem({ type: 'separator' }));
              return;
            }
            subMenu.append(new nw.MenuItem({
              ...submenuItems[subMenuItemName],
              label: subMenuItemName,
            }));
          });
          return subMenu;
        })(),
      }));
    });
    nw.Window.get().menu = menu;
  }

  static disable() {
    const { menu } = nw.Window.get();
    menu.items.forEach((menuItem) => {
      menuItem.submenu.items.forEach((subMenuItem) => {
        // eslint-disable-next-line no-param-reassign
        subMenuItem.enabled = false;
      });
    });
  }

  static enable() {
    const { menu } = nw.Window.get();
    menu.items.forEach((menuItem) => {
      menuItem.submenu.items.forEach((subMenuItem) => {
        // eslint-disable-next-line no-param-reassign
        subMenuItem.enabled = true;
      });
    });
  }
}
