jQuery(document).ready(function() {
  var update_texts = function() {
    $('body').i18n();
  };

  $('.lang-switch').click(function(e) {
    e.preventDefault();
    $.i18n().locale = $(this).data('locale');
    update_texts();
  });

  $.i18n().load({
    'en': {
      'intro-subheading': 'A Basic Income on the Blockchain',
      'whitepaper-link': 'Read the Whitepaper'
    },
    'de': {
      'intro-subheading': 'Ein Grundeinkommen auf der Blockchain',
      'whitepaper-link': 'Zum White Paper'
    }
  });

  update_texts();
});