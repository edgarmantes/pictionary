var pictionary = function() {
    var socket = io();
    var canvas, context;

    var drawing = false;
    var guessBox;
    var idOfUsers = null;
    var idOfPerson = null;
    var wordToDraw = null;

    var WORDS = [
        "word", "letter", "number", "person", "pen", "class", "people",
        "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
        "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
        "land", "home", "hand", "house", "picture", "animal", "mother", "father",
        "brother", "sister", "world", "head", "page", "country", "question",
        "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
        "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
        "west", "child", "children", "example", "paper", "music", "river", "car",
        "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
        "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
        "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
        "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
        "space"
    ];

    var $input = $('#answer');
    var $word = $('#word');
    var $wordList = $('#wordList');
    var $guess = $('#guess');
    var $guesses = $('#guesses');
    guessBox = $('#guess input');

    var listingUsers = function(users){
        idOfUsers = users;
    };

    var id = function(id){
        idOfPerson = id;
        designate();
    };

    var designate = function(){
        if (idOfPerson === idOfUsers[0]){
            $guess.css( "display", "none" );
            wordToDraw = randomWord().toUpperCase().bold();
            $word.append(wordToDraw);
        } else {
            $wordList.css( "display", "none" )
        }

    };

    // random word picker
    var randomWord = function(){
        return WORDS[Math.floor(Math.random()*WORDS.length)];
    };  

    var guesses = function(guesses){
        $guesses.append('<div>').html(guesses);
    };

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }

        console.log(guessBox.val());
        guessBox.val('');

        socket.emit('guess', guessBox)
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    canvas.on('mousedown', function(event){
        if (idOfPerson === idOfUsers[0]){
            drawing = true;

        }
    });

    canvas.on('mouseup', function(event){
        drawing = false;
    });

    canvas.on('mousemove', function(event) {
        if (drawing === true){
            var offset = canvas.offset();
            var position = {x: event.pageX - offset.left,
                            y: event.pageY - offset.top};
            draw(position);
            socket.emit('draw', position)
        }
    });

    $input.on('keydown', function(event){
        var answered = $input.val();
        guesses(answered);
        socket.emit('answered', answered);
    });

    guessBox.on('keydown', onKeyDown);

    socket.on('draw', draw);
    socket.on('listOfUsers', listingUsers)
    socket.on('personsId', id)
    socket.on('answered', guesses);
};

$(document).ready(function() {
    pictionary();
});