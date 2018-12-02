var questionnaire = {
    numQuestion : 0,
    nbQuestion : 999,
    limitManquant : [0,999],
    reponses : [],
    bonnesReponse : [],
    verifManquant: 'aucun',
    correction : false,
    nbCorrect : 0
}

function getQuestion(quizz){
    $.ajax({
        url: 'quizz.php',
        type: 'GET',
        dataType: 'json',
        data: {question: quizz.numQuestion},
        success: function(data){
            var i = 1;

            $('#questions h2').html(data.question);
            for (prop of data.propositions) {
                $('#proposition' + i).text(prop);
                $('#rep' + i).prop('checked', false);
                i++;
            }

            $('#rep' + quizz.reponses[quizz.numQuestion - 1]).prop('checked', true);
        },
        error: function(){
            console.log('error getQuestion');
        }
    })
}

function lastQuestion(quizz){
    $.ajax({
        url: 'quizz.php',
        type: 'GET',
        dataType: 'json',
        data: {question: quizz.numQuestion + 1},
        success: function(data){
            if(data.question === undefined){
                quizz.nbQuestion = quizz.numQuestion;
            }
        },
        async: false
    })
}

function lastCorrection(quizz){
    for(var i = quizz.nbQuestion; i > 0; i--){
        if(quizz.reponses[i - 1] === undefined){
            quizz.limitManquant[1] = i;
            i = 0;
        }
    }

    for(var i = 0; i < quizz.nbQuestion; i++){
        if(quizz.reponses[i] === undefined){
            quizz.limitManquant[0] = i + 1;
            i = quizz.nbQuestion;
        }
    }
    console.log(quizz);
}

function getCorrection(quizz){
    $.ajax({
        url: 'quizz.php',
        type: 'GET',
        dataType: 'json',
        data: {question: quizz.numQuestion},
        success: function(data){
            $('form p').each(function () {
                $(this).removeClass();
            });

            var i = 1;

            $('#questions h2').html(data.question);
            for (prop of data.propositions) {
                $('#proposition' + i).text(prop);
                $('#rep' + i).prop('checked', false);
                i++;
            }

            $('#rep' + quizz.reponses[quizz.numQuestion - 1]).prop('checked', true);

            if(parseInt(quizz.reponses[quizz.numQuestion - 1]) === parseInt(data.correct)){
                $('#p_' + data.correct).addClass('correct');
                if(quizz.reponses[quizz.numQuestion - 1] !== 0){
                    quizz.reponses[quizz.numQuestion - 1] = 0;
                    quizz.nbCorrect++;
                }
            } else {
                $('#p_' + quizz.reponses[quizz.numQuestion - 1]).addClass('error');
                $('#p_' + data.correct).addClass('correct');
            }
        },
        error: function(){
            console.log('error getQuestion');
        }
    })
}

function checkLimit(quizz){
    lastQuestion(quizz);
    switch(true){
        case (quizz.numQuestion===1 || (parseInt(quizz.numQuestion) === parseInt(quizz.limitManquant[0]) && quizz.verifManquant === true)):
            $('#previous').prop('disabled', true).addClass('disabled');
            $('#next').prop('disabled', false).removeClass('disabled');
            $('#confirm').prop('disabled', true).removeClass('disabled');
            break;
        case(quizz.numQuestion === quizz.nbQuestion || (quizz.numQuestion === quizz.limitManquant[1] && quizz.verifManquant === true)):
            $('#previous').prop('disabled', false).removeClass('disabled');
            $('#next').prop('disabled', true).addClass('disabled');
            $('#confirm').attr("disabled", false).removeClass("disabled");
            if(quizz.correction === true){
                $('#previous').prop('disabled', false).removeClass('disabled');
                $('#exit').prop('disabled', false).removeClass('disabled');
            }
            break;
        default:
            $('#previous').prop('disabled', false).removeClass('disabled');
            $('#next').prop('disabled', false).removeClass('disabled');
    }
}

function update(quizz){
    checkLimit(quizz);
    if(quizz.correction === true){
        getCorrection(quizz);
    } else {
        getQuestion(quizz);
    }
}

$(':radio').on('click', {QUEST: questionnaire}, function(e){
   var checkReponse = $(':checked').val();
   e.data.QUEST.reponses[e.data.QUEST.numQuestion-1] = checkReponse;
});

$('#start').on('click', {QUEST: questionnaire}, function(e){
    $('#start').hide();
    $('#exit').hide();
    $('#quizz').show();
    e.data.QUEST.numQuestion = 1;
    update(e.data.QUEST);
});

$('#next').on('click', {QUEST: questionnaire}, function(e){
   if( e.data.QUEST.verifManquant === true && e.data.QUEST.correction === false) {
       for(var i = e.data.QUEST.numQuestion; i < e.data.QUEST.nbQuestion; i++){
           if(e.data.QUEST.reponses[i] === undefined){
               e.data.QUEST.numQuestion = i + 1;
               i = e.data.QUEST.nbQuestion;
           }
       }
   } else {
       e.data.QUEST.numQuestion++;
   }

   update(e.data.QUEST);
});

$('#previous').on('click', {QUEST: questionnaire}, function(e){
    if( e.data.QUEST.verifManquant === true && e.data.QUEST.correction === false) {
        for(var i = e.data.QUEST.numQuestion-1; i > 0; i--){
            if(e.data.QUEST.reponses[i] === undefined){
                e.data.QUEST.numQuestion = i - 1;
                i = 0;
            }
        }
    } else {
        e.data.QUEST.numQuestion--;
    }

    update(e.data.QUEST);
});

$('#confirm').on('click', {QUEST: questionnaire}, function(e){
    var i = 0;

    lastCorrection(e.data.QUEST);

    for(i = 0; i < e.data.QUEST.nbQuestion; i++){
        if(e.data.QUEST.reponses[i] === undefined){
            e.data.QUEST.numQuestion = i+1;
            $('#message').text('Merci de répondre à la question');
            e.data.QUEST.verifManquant = true;
            update(e.data.QUEST);
            return;
        }
    }

    //une fois que tout est rempli
    $('quizz').removeClass('error');
    $('#confirm').hide();
    $('#message').hide();
    $('#exit').show().prop('disabled', true);
    $('#next').prop('disabled', false).removeClass('disabled');

    e.data.QUEST.verifManquant = false;
    e.data.QUEST.correction = true;
    e.data.QUEST.numQuestion = 1;

    getCorrection(e.data.QUEST);
});

$('#exit').on('click', {QUEST: questionnaire}, function(e){
    //on cache les boutons
    $('#questions').hide();
    $('#buttons').hide();

    $('#message').show().html('<h2>Vous avez ' + e.data.QUEST.nbCorrect + ' réponses correctes</h2>');
});