jQuery(document).ready(function( $ ) {

  // Header fixed and Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
      $('#header').addClass('header-fixed');
    } else {
      $('.back-to-top').fadeOut('slow');
      $('#header').removeClass('header-fixed');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs
  new WOW().init();

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {opacity:'show'},
    speed: 400
  });

  // Mobile Navigation
  if( $('#nav-menu-container').length ) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({ id: 'mobile-nav'});
    $mobile_nav.find('> ul').attr({ 'class' : '', 'id' : '' });
    $('body').append( $mobile_nav );
    $('body').prepend( '<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>' );
    $('body').append( '<div id="mobile-body-overly"></div>' );
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e){
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e){
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function (e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
       if ( $('body').hasClass('mobile-nav-active') ) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ( $("#mobile-nav, #mobile-nav-toggle").length ) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smoth scroll on page hash links
  $('a[href*="#"]:not([href="#"])').on('click', function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if( $('#header').length ) {
          top_space = $('#header').outerHeight();

          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ( $(this).parents('.nav-menu').length ) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ( $('body').hasClass('mobile-nav-active') ) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Porfolio filter
  $("#portfolio-flters li").click ( function() {
    $("#portfolio-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');

    var selectedFilter = $(this).data("filter");
    $("#portfolio-wrapper").fadeTo(100, 0);

    $(".portfolio-item").fadeOut().css('transform', 'scale(0)');

    setTimeout(function() {
      $(selectedFilter).fadeIn(100).css('transform', 'scale(1)');
      $("#portfolio-wrapper").fadeTo(300, 1);
    }, 300);
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });


  //Google Map
  var get_latitude = $('#google-map').data('latitude');
  var get_longitude = $('#google-map').data('longitude');

  function initialize_google_map() {
    var myLatlng = new google.maps.LatLng(get_latitude, get_longitude);
    var mapOptions = {
      zoom: 14,
      scrollwheel: false,
      center: myLatlng
    };
    var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize_google_map);

  $('#messages-close, #messages-ok').on('click', function () {
      $('#messages').hide();
  });


// custom code for subscribation
  $('#join-button').on('click', function () {
      $('#registration-container').addClass('opened');
      $('html').addClass('popup-opened');
  });

  $('#registration-container').on('click', function () {
      $(this).removeClass('opened');
      $('html').removeClass('popup-opened');
  });

  $('.registration').on('click', function (event) {
      event.stopPropagation();
  });

  $('.btn-riota').on('click', function (event) {
      let nextGroup = $(this).parent().parent().next('div.form-group');
      let nextInput  = nextGroup.find('input');
      let thisInput = $(this).parent().parent().find('input');
      event.preventDefault();
      if(thisInput.valid()){
          $('.registration').scrollTo(nextGroup,1000);
          nextInput.focus();
          nextGroup.addClass('show');
      }
  });

  $('.form-text, .form-radio').on('keydown', function (event) {
    let nextGroup = $(this).parent().parent().parent().next('div.form-group');
    let nextInput  = nextGroup.find('input');
    if(event.keyCode === 13 && $(this).valid()){
      event.preventDefault();
      $('.registration').scrollTo(nextGroup,1000);
      nextInput.focus();
      nextGroup.addClass('show');
    }
  });

  $('.form-text').on('keyup', function (event) {
      event.preventDefault();
      let okButton = $(this).parent().parent().find('button');
      if($(this).val().length > 0){
          okButton.prop('disabled', false);
      } else {
          okButton.prop('disabled', true);
      }
  });

    $('.form-text').on('change', function (event) {
        event.preventDefault();
        let okButton = $(this).parent().parent().find('button');
        if($(this).val().length > 0){
            okButton.prop('disabled', false);
        } else {
            okButton.prop('disabled', true);
        }
    });

  $('.form-radio').on('click', function () {
      let okButton = $(this).parent().parent().find('button');
      okButton.prop('disabled', false);
  });

  $('.telegram-button').on('click', function () {
      let yesRadio = $('#yes-telegram');
      if (yesRadio.prop('checked')) {
          $('.registration').scrollTo($('#registration-button'),0);
          $('.re-telegram').removeClass('show');
      } else {
          $('.registration').scrollTo($('.re-telegram'),1000);
          $('.re-telegram').addClass('show');
      }
  });

  $('#back-to-telegram').on('click', function (event) {
      event.preventDefault();
      $('.registration').scrollTo($('#telegram-form-group'),1000);
  });

  $('.registration-form').validate();
});
