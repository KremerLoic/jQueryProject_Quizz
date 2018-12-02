var quizz = {
    /**
     *
     * @param numQuestion
     * @param callback
     * renvoie la question et nous permet de l'utiliser grace à la fonction de callback
     */
    getQuestion : function(numQuestion, callback){
        $.ajax({
            async: false,
            url: 'quizz.php',
            type: 'GET',
            dataType: 'json',
            data: {question: numQuestion},
            success: function (data) {
                callback.call(this, data);
            },
            error: function () {
                console.log('erreur getQuestion');
            }
        })
    },
    /**
     *
     * @param data
     * @param numQuestion
     * affiche la question et les réponses, configure les boutons 'suivante' et 'précédente",
     * si on a déjà répondu à la question => checked la réponse
     */
    showQuestion: function(data, numQuestion, nbQuestion, error = 0){
        var i = 1;

        //remise à zéro des propriétés checked
        $('input').prop('checked', false);

        //affichage des questions
        $('h2').text(data.question);
        for (prop of data.propositions) {
            $('#proposition' + i).text(prop);
            i++;
        }

        quizz.configButtons(numQuestion, error);

        //si on a déjà répondu à la question => checked la réponse
        $('#rep' + resultat[numQuestion].reponse).prop('checked', true);
    },
    configButtons : function(numQuestion, error){
        var nextQuestion = 0;
        var prevQuestion = 0;

        //au premier tour
        if(error === 0 || error.length === 0){
            nextQuestion = parseInt(numQuestion) + 1;
            prevQuestion = parseInt(numQuestion) - 1;
        } else {
            //sinon au deuxieme tour
            reload = true;


            //TODO griser précédente et suivante
            //on grise "suivante" ou "précédente" si on est à la première ou dernière question
            if(numQuestion === error[0]){
                $('#previous').attr('disabled', 'disabled');
                $('#next').show();
                $('#previous').hide();
            } else if(numQuestion === error[(error.length)-1]){
                $('#next').attr('disabled', 'disabled');
                $('#previous').show();
                $('#next').hide();
            } else {
                $('#next').show();
                $('#previous').show();
            }

            if(isNaN(parseInt(error[error.indexOf(numQuestion) + 1]))){
                nextQuestion = parseInt(error[error.indexOf(numQuestion)]);
            }else {
                nextQuestion = parseInt(error[error.indexOf(numQuestion) + 1]);
            }
            prevQuestion = parseInt(error[error.indexOf(numQuestion) - 1]);
        }

        //si on est à la dernière question
        if(numQuestion === nbQuestions){
            $('#next').attr('disabled', 'disabled');
        } else {
            $('#next').prop('disabled', false);
            $('#next').attr('data-num', nextQuestion);
        }

        //si on est à la première question
        if(numQuestion === 1){
            $('#previous').attr('disabled', 'disabled');
        } else {
            $('#previous').prop('disabled', false);
            $('#previous').attr('data-num', prevQuestion);
        }
    },
    /**
     *
     * @param numQuestion
     * @param data
     * crée un objet infos qui contient le numéro de la question, la réponse correcte et la réponse donnée
     * => met cet objet dans l'objet résultat
     */
    recupInfos: function(numQuestion, data){
        var infos = {};
        infos.numero = parseInt(numQuestion);
        infos.correct = parseInt(data.correct);
        if(typeof resultat[numQuestion] !== 'undefined'){
            infos.reponse = parseInt(resultat[numQuestion].reponse);
        }
        resultat[numQuestion] = infos;
    },
    /**
     *
     * @param numQuestion
     * met la réponse qu'on a checked dans le tableau résultat
     */
    recupReponse: function(numQuestion){
        var tempNum = numQuestion;
        //si c'est la première question on incrémente parce resultat[numQuestion-1]
        if(numQuestion == 1){
            numQuestion++;
        }

        //si on est au deuxième tour
        if(reload === true){
            console.log(error);
            numQuestion = error[error.indexOf(numQuestion) - 1] + 1;
            if(isNaN(numQuestion)){
                numQuestion = tempNum + 1;
                if(numQuestion === nbQuestions + 2){
                    numQuestion = tempNum;
                }
            }
        }

        resultat[numQuestion-1].reponse = parseInt($('input:checked').val());
    },
    /**
     *
     * @param numQuestion
     * vérifie les bonnes et mauvaises réponses et change la classe en fonction du résultat
     */
    checkReponse: function(numQuestion){

        $('form p').each(function () {
            $(this).removeClass();
        });

        if (resultat[numQuestion].reponse === resultat[numQuestion].correct) {
            $('#p_' + resultat[numQuestion].correct).addClass('correct');
            nbCorrect++;
        } else {
            $('#p_' + resultat[numQuestion].correct).addClass('correct');
            $('#p_' + resultat[numQuestion].reponse).addClass('error');
        }
    }
};
