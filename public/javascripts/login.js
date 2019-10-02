

$(document).ready(function () {
    var question = [];

    $.ajax({
        url: "http://localhost:3000/get_question",
        type: 'post',
        dataType: 'json',
        data: 'true',
        success: function (result) {
            for (var index = 0; index < result.result.length; index++) {
                $('table').append(" <tbody><tr>" + " <td><input type='text' id='armenian" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].armenian) + " name='armenian'>" +
                    " <input type='text' id='russian" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].russian) + " name='russian'>" +
                    " <input type='text' id='english" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].english) + " name='english'>" +
                    " <span class='glyphicon glyphicon-edit' id=" + result.result[index]._id + "></span>" +
                    " <span class='glyphicon glyphicon-ok' id=" + result.result[index]._id + "></span>" +
                    " <span class='glyphicon glyphicon-remove' id=" + result.result[index]._id + "></span><br>" +
                    " <input type='text' id='explanation_am" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].explanation_am) + " name='explanation' style='width:99%;'><br>" +
                    " <input type='text' id='explanation_ru" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].explanation_ru) + " name='explanation' style='width:99%;'><br>" +
                    " <input type='text' id='explanation_en" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].explanation_en) + " name='explanation' style='width:99%;'></td>" +
                    " </td>" + "</tr></tbody>")
            }
        }
    });

    $(document).on('click', '.glyphicon.glyphicon-edit', function (e) {
        $('.input').prop('disabled', 'disabled');
        $('input[id=armenian' + e.target.id + ']').prop('disabled', '');
        $('input[id=russian' + e.target.id + ']').prop('disabled', '');
        $('input[id=english' + e.target.id + ']').prop('disabled', '');
        $('input[id=explanation_am' + e.target.id + ']').prop('disabled', '');
        $('input[id=explanation_ru' + e.target.id + ']').prop('disabled', '');
        $('input[id=explanation_en' + e.target.id + ']').prop('disabled', '');
    });

    $(document).on('click', '.glyphicon.glyphicon-ok', function (e) {
        question.push({
            type: 1,
            id: e.target.id,
            armenian: $('input[id=armenian' + e.target.id + ']').val(),
            russian: $('input[id=russian' + e.target.id + ']').val(),
            english: $('input[id=english' + e.target.id + ']').val(),
            explanation_am: $('input[id=explanation_am' + e.target.id + ']').val(),
            explanation_ru: $('input[id=explanation_ru' + e.target.id + ']').val(),
            explanation_en: $('input[id=explanation_en' + e.target.id + ']').val(),
        });
    });

    $(document).on('click', '.glyphicon.glyphicon-remove', function (e) {
        question.push({
            type: 2,
            id: e.target.id,
        });
    });


    $(document).on('click', '#savequestion', function () {
        question.push({
            type: 3,
            armenian: $('#armenian').val(),
            russian: $('#russian').val(),
            english: $('#english').val(),
            explanation_am: $('#explanation_arm').val(),
            explanation_ru: $('#explanation_rus').val(),
            explanation_en: $('#explanation_eng').val(),
        });
    });

    $(document).on('click', '#save_send', function () {
        $.ajax({
            url: 'http://localhost:3000/example',
            method: 'post',
            type: 'json',
            data: { d1: question, len: question.length },
        });
    });

    $(document).on('click', '#logout', function () {
        $('form').submit();
    });




});