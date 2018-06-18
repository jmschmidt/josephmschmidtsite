var Navigation = function() {

  const self = this,
        navCheckBox = document.querySelector('.navCheckBox'),
        navItems = document.querySelectorAll('.navItem');

  self.init = function() {
    self.addEventListeners();  
  };

  self.addEventListeners = function() {
    // Add click events to all nav items to toggle nav menu
    for (let item of navItems) {
      item.addEventListener("click", self.toggleNav);
    }
  };

  // Toggle Nav Menu Checkbox which controls the display of the menu drawer.
  // If its checked the menu is displayed
  self.toggleNav = function() {
    navCheckBox.checked = !navCheckBox.checked;
  };
};