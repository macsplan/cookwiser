Template.contact.rendered = function (){
  $(document).ready(function(){
    // -- start

    // form validation
    $("input,textarea").jqBootstrapValidation({
      preventSubmit: true,
      submitError: function($form, event, errors) {
      },
      filter: function() {
        return $(this).is(":visible");
      },
    });

    // -- end
  });
};

// validate email
validateEmail = function(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
};

Template.contact.events({
  'submit #contact-form': function(e) {
    e.preventDefault();

    var form = $('#contact-form');
    var formMessage = $('#contact-message');
    var formMessageContent = $('#contact-message-content');

    var contactName = e.target.name.value;

    var contact = ({
      from: e.target.email.value,
      subject: contactName + ' - from phildec.com',
      text: e.target.message.value
    });

    e.target.reset();

    if (validateEmail(contact.from)) {
      // Make sure that the formMessages div has the 'success' class.
      $(formMessage).removeClass('error');
      $(formMessage).addClass('success');

      // Set the message text.
      $(formMessageContent).text("Success!, we'll be with you shortly.");

      $(form).remove();
      $(formMessage).show();

      // Clear the form.
      $('#name').val('');
      $('#email').val('');
      $('#message').val('');

      var result = Meteor.call('sendEmail',
        contact.from,
        contact.subject,
        contact.text
      );
    } else {
      // Make sure that the formMessages div has the 'error' class.
      $(formMessage).removeClass('success');
      $(formMessage).addClass('error');

      // Set the message text.
      if (data.responseText !== '') {
        $(formMessage).text(data.responseText);
      } else {
        $(formMessage).text('Sorry, I didnt quite get that. Can you check Your Email address?');
      }
    }
  }
});
