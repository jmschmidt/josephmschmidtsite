var ContactForm = function() {

  const self = this,
        form = document.getElementById('contactForm'),
        formStatus = form.querySelector('.statusText'),
        states = {
          loading: '--loading',
          success: '--success',
          failure: '--failure',
        }
        messages = {
          success : 'Awesome! Thank you for reaching out. I will be in touch with you soon!',
          failure : 'Oh man! Sorry, but there was an issue sending your message. You can try sending a message directly to joe@josephmschmidt.com'
        };
  
  // Set up the AJAX request
	const request = new XMLHttpRequest();
	request.open('POST', 'https://formcarry.com/s/rkDVX6i1m', true);
	request.setRequestHeader('accept', 'application/json');

  self.init = function() {
    self.addEventListeners();
  };

  self.addEventListeners = function() {
    form.addEventListener('submit', self.submitForm);
  };

  self.submitForm = function(evt) {
    evt.preventDefault();

    if (!form.classList.contains(states.loading)) {
      form.classList.toggle(states.loading);

      // Create a new FormData object
      // Pass in the form's key value pairs
      var formData = new FormData(form);

      // Send the formData
      request.send(formData);

      // Watch for changes to request.readyState and update the status accordingly
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          form.classList.toggle(states.loading);
          // 200 - 299 = successful
          if (request.status == 200 && request.status < 300) {
            formStatus.innerHTML = messages.success;
            form.classList.toggle(states.success);
            form.querySelectorAll('input').value = '';
            form.querySelector('textarea').value = '';
          } else {
            formStatus.innerHTML = messages.failure;
            form.classList.toggle(states.failure);
          }
        }
      }
    }
  };
};