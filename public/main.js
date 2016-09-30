var socket = io();

var pictionary = function () {
    var canvas, context;

    var drawing = false;

    var username = prompt('What is your nickname?');

    var onKeyDown = function (event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        var guess = guessBox.val();
        socket.emit('onKeyDown', { username: username, guess: guess });
        guessBox.val('');
    };

    var guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    // $('#guess input').on('keydown', function (event) {
    //     if (event.keyCode != 13) { // Enter
    //         return;
    //     }
    //     var guess = $(this).val();
    //     socket.emit('onKeyDown', guess);
    //    $(this).val('');
    // });


    socket.on('onKeyDown', function (guess) {
        $('#guesses').append('<div>' + guess.username + ":" + " " + guess.guess + '</div>');
    });


    var draw = function (position) {
        context.beginPath();
        context.arc(position.x, position.y,
            6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousemove', function (event) {
        if (drawing === true) {
            var offset = canvas.offset();
            var position = {
                x: event.pageX - offset.left,
                y: event.pageY - offset.top
            };
            draw(position);
            socket.emit('draw', position);

        }
    });
    socket.on('draw', draw);
    canvas.on('mousedown', function (event) {
        drawing = true;
    });
    canvas.on('mouseup', function (event) {
        drawing = false;
    });

    var reset = function() {
        context.clearRect(0,0, canvas[0].width, canvas[0].height); 
        context.beginPath();
        $('#guesses').children().empty();
        return;
    };


    $('#reset').on("click", function(){
        socket.emit('reset');
        reset();
    });

    socket.on('reset', reset);

};

$(document).ready(function () {
    pictionary();

});