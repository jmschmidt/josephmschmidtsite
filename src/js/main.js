const Main = function() {
  
  const nav = new Navigation();
  const contactForm = new ContactForm();

  this.init = function() {
    new LazyLoad();
    nav.init();
    contactForm.init();
  }
};

window.addEventListener('load', function() {
	const site = new Main();
  site.init();
});