(function ($) {
    // USE STRICT
    "use strict";

    $(".form-radio .radio-item").click(function(){
        //Spot switcher:
        $(this).parent().find(".radio-item").removeClass("active");
        $(this).addClass("active");
    });
  
    $('#time').parent().append('<ul class="list-item" id="newtime" name="time"></ul>');
    $('#time option').each(function(){
        $('#newtime').append('<li value="' + $(this).val() + '">'+$(this).text()+'</li>');
    });
    $('#time').remove();
    $('#newtime').attr('id', 'time');
    $('#time li').first().addClass('init');
    $("#time").on("click", ".init", function() {
        $(this).closest("#time").children('li:not(.init)').toggle();
    });

    $('#food').parent().append('<ul class="list-item" id="newfood" name="food"></ul>');
    $('#food option').each(function(){
        $('#newfood').append('<li value="' + $(this).val() + '">'+$(this).text()+'</li>');
    });
    $('#food').remove();
    $('#newfood').attr('id', 'food');
    $('#food li').first().addClass('init');
    $("#food").on("click", ".init", function() {
        $(this).closest("#food").children('li:not(.init)').toggle();
    });
    
    var allOptions = $("#time").children('li:not(.init)');
    $("#time").on("click", "li:not(.init)", function() {
        allOptions.removeClass('selected');
        $(this).addClass('selected');
        $("#time").children('.init').html($(this).html());
        allOptions.toggle();
    });

    var FoodOptions = $("#food").children('li:not(.init)');
    $("#food").on("click", "li:not(.init)", function() {
        FoodOptions.removeClass('selected');
        $(this).addClass('selected');
        $("#food").children('.init').html($(this).html());
        FoodOptions.toggle();
    });
})(jQuery);
/*
const seats = document.querySelectorAll('.seat');

seats.forEach(seat => {
  seat.addEventListener('click', () => {
    seat.classList.toggle('selected');
    if (seat.classList.contains('selected')) {
      seat.style.backgroundColor = 'red';
    } else {
      seat.style.backgroundColor = '';
    }
  });
});
const seats2 = document.querySelectorAll('.seat2');

seats2.forEach(seat => {
  seat.addEventListener('click', () => {
    seat.classList.toggle('selected');
    if (seat.classList.contains('selected')) {
      seat.style.backgroundColor = 'red';
    } else {
      seat.style.backgroundColor = '';
    }
  });
});

const seatNumber = seat.getAttribute('data-seat');
seat.innerHTML = seatNumber;
*/

const seats = document.querySelectorAll('.seat, .seat2');
let selectedSeat = null;

seats.forEach(seat => {
  seat.addEventListener('click', () => {
    if (!selectedSeat) {
      seat.classList.add('selected');
      selectedSeat = seat;
      seat.style.backgroundColor = 'red';
    } else if (selectedSeat === seat) {
      seat.classList.remove('selected');
      selectedSeat = null;
      seat.style.backgroundColor = '';
    }
  });
});


