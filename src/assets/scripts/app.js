$(document).ready(function() {

  var currentSVGElement;

  $('.loading').remove();

  $('.button.confirm').on('click', function() {
    if (!$(this).hasClass('disabled')){
      var step = $(this).parents('.step');

      step.css('left', '-100%');
      step.next('.step').show();

      setTimeout(function() {
        step.removeClass('active');
        step.next('.step').addClass('active').removeAttr('style');
      }, 1000);
    }
  });

  $('.gallery a').on('click', function() {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    $(this).parents('.step').find($('.button.confirm')).removeClass('disabled');
  });

  $('.patch').on('click', 'path, g', function() {
    currentSVGElement = $(this).attr('id');
  });

  $('.color-palette.shape').on('click', '.color', function() {
    if (currentSVGElement) {
      document.getElementById(currentSVGElement).setAttribute('style', 'fill:' + $(this).css('background-color'));
    }
  });

  $('.color-palette.background').on('click', '.color', function() {
    $('.patch-background').css('background-color', $(this).css('background-color'));
  });

  $('.color-palette.skin').on('click', '.color', function() {
    $('.canvas .main').css('background-color', $(this).css('background-color'));
  });

});
