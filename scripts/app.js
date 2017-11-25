$(document).ready(function() {

  var currentSVG;
  var currentSVGElement;

  $('.loading').remove();

  $('.start-button').on('click', function() {
    var step = $(this).parents('.step');

    step.css('left', '-100%');
    step.next('.step').show();

    setTimeout(function() {
      step.removeClass('active');
      step.next('.step').addClass('active').removeAttr('style');
    }, 1000);
  });

  $('.patch').on('click', 'path, g', function() {
    currentSVGElement = $(this).attr('id');
    console.log(currentSVGElement);
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
    $('.canvas-main').css('background-color', $(this).css('background-color'));
  });

});
