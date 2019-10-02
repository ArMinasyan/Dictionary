

$(document).ready(function () {
    var question = [];
    
    $.ajax({
        url: "http://localhost:3000/admin_data",
        type: 'POST',
        dataType: 'json',
        data: 'true',
        success: function (result) {
            for (var index = 0; index < result.result.length; index++) {
                $('table').append(" <tbody><tr>" + " <td width='20%'><input type='text' class='input' id='uname" + result.result[index]._id + "' disabled value=" + result.result[index].username + " name='uname'></td>" +
                    " <td width='20%'><input type='text' class='input' id='pass" + result.result[index]._id + "' disabled value=" + result.result[index].password + " name='pass'></td>" +
                    " <td width='20%'><input type='text' class='input' id='name" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].name) + " name='name'></td>" +
                    " <td width='30%'><input type='text' class='input' id='sector" + result.result[index]._id + "' disabled value=" + JSON.stringify(result.result[index].sector) + " name='sector'></td>" +
                    " <td><span class='glyphicon glyphicon-edit' id=" + result.result[index]._id + "></span>" +
                    "  <span class='glyphicon glyphicon-ok' id=" + result.result[index]._id + "></span>" +
                    "  <span class='glyphicon glyphicon-remove' id=" + result.result[index]._id + "></span>" +
                    " </td>" + "</tr></tbody>")
            }
        }
    });

    $(document).on('click', '.glyphicon.glyphicon-edit', function (e) {
        $('.input').prop('disabled', 'disabled');
        $('input[id=uname' + e.target.id + ']').prop('disabled', '');
        $('input[id=pass' + e.target.id + ']').prop('disabled', '');
        $('input[id=name' + e.target.id + ']').prop('disabled', '');
        $('input[id=sector' + e.target.id + ']').prop('disabled', '');
    });

    $(document).on('click', '.glyphicon.glyphicon-ok', function (e) {
        question.push({
            type: 1,
            id: e.target.id,
            uname: $('input[id=uname' + e.target.id + ']').val(),
            pass: $('input[id=pass' + e.target.id + ']').val(),
            name: $('input[id=name' + e.target.id + ']').val(),
            sector: $('input[id=sector' + e.target.id + ']').val(),
        });
    });

    $(document).on('click', '.glyphicon.glyphicon-remove', function (e) {
        question.push({
            type: 2,
            id: e.target.id,
        });
    });


    $(document).on('click', '#save', function () {
        question.push({
            type: 3,
            uname: $('#uname').val(),
            pass: $('#pass').val(),
            name: $('#name').val(),
            sector: $('#sector').val(),
        });
    });

    $(document).on('click', '#save_send', function () {
        $.ajax({
            url: 'http://localhost:3000/add_user',
            method: 'post',
            type: 'json',
            data: { d1: question, len: question.length },
        });
    });

    $(document).on('click', '#logout', function () {
        $('form').submit();
    });

    


});