var IndexController = (function () {
    var letters =  {
        letters: [
            { letter: 'a' },
            { letter: 'b' },
            { letter: 'c' },
            { letter: 'd' },
            { letter: 'e' },
            { letter: 'f' },
            { letter: 'g' },
            { letter: 'h' },
            { letter: 'i' },
            { letter: 'j' },
            { letter: 'k' },
            { letter: 'l' },
            { letter: 'm' },
            { letter: 'n' },
            { letter: 'o' },
            { letter: 'p' },
            { letter: 'q' },
            { letter: 'r' },
            { letter: 's' },
            { letter: 't' },
            { letter: 'u' },
            { letter: 'v' },
            { letter: 'w' },
            { letter: 'x' },
            { letter: 'y' },
            { letter: 'z' }
        ]
    };
    var difficulty = "";
    var word = "";
    var tries = 100;
    var audioLaughtEnd = null;
    var audioBackground = null;

    function IndexController() {
        gameInitialize();
        events();
    }

    function gameInitialize() {
        audioBackground = playSong("/Assets/orage_tonnerre_04.mp3", true, true)
    }

    function randomWordsByDifficulty(difficulty) {
        $.get("/data/words.json", function (data) {
            var lengthDifficulty = data[difficulty].length - 1;
            var rnd = Math.ceil(Math.random() * lengthDifficulty);
            word = data[difficulty][rnd].mot;
            renderWordInHTML(word);
        })
    }

    function renderWordInHTML(word) {

        var templateKey = $("#findLetterTemplate").html();
        var render = Mustache.render(templateKey, null);

        for (var i = 0; i < word.length; i++) {
            setTimeout(function (cpt) {
                $(".secret-word").append(render);
            }, 300 * i, i)
        }
    }

    function renderKeyboardHTML(word) {
        var templateKey = $("#btnLetter").html();
        var render = Mustache.render(templateKey, letters);
        $(".keyboard div.row").html(render);
    }

    function events() {

        $("div.step1").on("click", "button", function (evt) {
            $(evt.delegateTarget).removeClass("fadeIn").addClass("fadeOut");
            difficulty = $(this).val();

            setTimeout(function () {
                $(evt.delegateTarget).hide();
                loadStep2();
            }, 1000)
        });

        $("div.keyboard").on("click", "button", function (evt) {

            var audio = playSong("/Assets/gargouilli-1.mp3", false, true);
            findLetterInWord($(this).val());

            $(audio).on("playing", onPlaying);
            $(audio).on("ended", onEnded);
        });

        $("div.keyboard").on("mouseover", "button", function (evt) {
            $(this).addClass("rubberBand");
            setTimeout(() => {
                $(this).removeClass("rubberBand");
            }, 1000)
        });

        function onPlaying() {
            $("div.keyboard button").prop("disabled", true);
        }

        function onEnded() {
            $("div.keyboard button").prop("disabled", false)
        }

        $("#endGameModal").on("hide.bs.modal", function () {
            audioLaughtEnd.pause();
        });
    }

    function loadStep2() {
        randomWordsByDifficulty(difficulty);
        renderKeyboardHTML();
    }

    function findLetterInWord(letter) {
        var lengthChars = (word.match(new RegExp(letter, "g")) || []).length;
        console.log(lengthChars)

        if (lengthChars > 0) {

            for (var i = 0; i < word.length; i++) {
                if (letter === word[i])
                    $(".secret-word label:eq(" + i + ")").text(letter)
            }
        }
        else {
            errorLetter();
        }

    }

    function errorLetter() {
        if (tries > 0) {
            tries -= 10;
            $(".progress-bar").html(tries / 10).css("width", tries);
        }

        switch (true) {
            case tries === 0:
                endGame();
                break;
            case tries <= 40:
                stressMode();
                break;
        }
        
    }

    function endGame() {
        audioLaughtEnd = playSong("/Assets/sf_rire_creature_04.mp3", true, true);
        $("h1").addClass("hinge").css("color" , "#610B21");

        $("#endGameModal").modal("show");
    }

    function playSong(path, loop, autoplay) {
        var audio = new Audio(path);
        audio.loop = loop;
        audio.autoplay = autoplay;
        return audio;
    }

    function stressMode() {
        audioBackground.pause();
        $("section").addClass("stress");
        $(".keyboard").addClass("pulse");
        playSong("/Assets/SF-coeur-echograph24.mp3", true, true);
    }

    return IndexController;
})();


$(document).ready(function () {
    var indexCtrl = new IndexController();
});