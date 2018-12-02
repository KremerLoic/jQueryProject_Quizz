var nbQuestions = '';
//var resultat = {1:{numero: 1, correct: 2, reponse: 2}, 2:{numero: 2, correct: 3, reponse: 1}, 3:{numero: 3, correct: 2, reponse: 3}, 4:{numero: 4, correct: 1, reponse: 2}, 5:{numero: 5, correct: 3, reponse: 1}};
var resultat = {};
var verif = false;
var nbCorrect = 0;
var reload = false;
var error = [];


$('#start').on('click', function () {
    var numQuestion = 1;

    //on affiche/cache les boutons
    $('#start').remove();
    $('#quizz').show();
    $('#exit').hide();
    $('#confirm').hide();

    //on récupère la question
    quizz.getQuestion(numQuestion, function(data){
        //on récupère les infos de la question et on les met dans les resultats
        quizz.recupInfos(numQuestion, data);
        //on affiche la question
        quizz.showQuestion(data, numQuestion, nbQuestions);
    });

});



$('#next').on('click',function(){
    //on récupère le numero de la question
    var numQuestion = parseInt($('#next').attr('data-num'));

    //si on a pas fait le tour des questions
    if(nbQuestions == ''){
        //on verifie la question suivante
        quizz.getQuestion(numQuestion+1, function(data){
            //si on est a la dernière question
            if(data.length === 0){
                nbQuestions = numQuestion;
                $('#confirm').show();
                $('#confirm').attr('data-num', numQuestion+1);

            }
        });
    }

    //si on a répondu a toutes les questions
    if (verif === true) {
        //on vérifie les bonnes et mauvais réponses
        quizz.checkReponse(numQuestion);
        //si on est à la dernière question on affiche le bouton "fin"
        if(numQuestion === nbQuestions){
            $('#exit').show();
        }
    }

    //on récupère la question
    quizz.getQuestion(numQuestion, function(data){
        //on récupère les infos de la question et on les met dans les resultats
        quizz.recupInfos(numQuestion, data);
        //on recupere la reponse et on la met dans les résultats
        quizz.recupReponse(numQuestion);
        //on affiche la question
        quizz.showQuestion(data, numQuestion, nbQuestions, error);
    });
});



$('#previous').on('click',function(){
    //on récupère le numero de la question
    var numQuestion = parseInt($('#previous').attr('data-num'));

    //si on a répondu a toutes les questions
    if (verif === true) {
        //on vérifie les bonnes et mauvais réponses
        quizz.checkReponse(numQuestion);
    }

    //on récupère la question
    quizz.getQuestion(numQuestion, function(data){
        //on recupere la reponse et on la met dans les résultats
        quizz.recupReponse(numQuestion+2);
        //on affiche la question
        quizz.showQuestion(data, numQuestion, nbQuestions, error);
    });
});



$('#confirm').on('click', function(){
    var i = 0;
    var numQuestion;
    error = [];

    if($('#next').attr('disabled') === 'disabled'){
        numQuestion = parseInt($('#next').attr('data-num')) +1;
    } else {
        numQuestion = parseInt($('#next').attr('data-num'));
    }
    //on recupere la reponse et on la met dans les résultats
    quizz.recupReponse(numQuestion);


    //si on a bien parcouru l'ensemble des questions
    if (nbQuestions != '') {

        //on crée un tableau avec les réponses non répondues
        for (i = 1; i <= nbQuestions; i++) {
            if (isNaN(resultat[i].reponse)) {
                error.push(resultat[i].numero);
            }
        }

        //on affiche la question
        if(error[0] !== undefined) {
            //on récupère la question
            quizz.getQuestion(error[0], function (data) {
                //on affiche la question
                quizz.showQuestion(data, error[0], nbQuestions, error);
            });
        }

        //si on a bien répondu à tout (donc que error est vide)
        if(error.length === 0){
            numQuestion = 1;
            $('#confirm').hide();
            $('#previous').show();
            $('#next').show();

            //on récupère la question
            quizz.getQuestion(numQuestion, function(data) {
                //on vérifie les bonnes et mauvais réponses
                quizz.checkReponse(numQuestion);
                //on affiche la question
                quizz.showQuestion(data, numQuestion, nbQuestions);
            });

            //variable qui permet de voir qu'on a déjà tout répondu
            verif = true;
        }
    }

});

$('#exit').on('click', function(){
    //on cache les boutons
    $('#questions').hide();
    $('#buttons').hide();

    //on affiche les résultats
    if (nbCorrect > 2) {
        $('#message').html('<i class="far fa-thumbs-up fa-7x"></i><p>Vous avez ' + nbCorrect + ' réponses correctes</p>');
    } else {
        $('#message').html('<i class="far fa-thumbs-down fa-7x"></i><p>Vous n\'avez que ' + nbCorrect + ' réponses correctes</p>');
    }
});