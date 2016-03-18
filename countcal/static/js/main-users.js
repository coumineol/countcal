var globalEditId = 0;

$(document).ready(function() {

    $('.delete_user').on('click', function() {

        var idOfUser = $(this).attr('id').substring(7);
        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        $.ajax({
            url: "/countcal/users/"+idOfUser+"/delete/",
            type: "POST",
            data: { id : idOfUser },
            success : function(json) {
                $('#delete_'+idOfUser).parent().hide();
                console.log('Deleted.');
            },
            error : function(xhr,errmsg,err) {
                console.log('Not deleted.');
            }
        });

    });


    $('#add_user').on('click', function() {

        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        $.ajax({
            url: "/countcal/users/create_by_exterminator/",
            type: "POST",
            data: { username : $('#username_new_item').val(),
                    password : $('#password_new_item').val() },
            success : function(json) {
                console.log('Added.');
                console.log(json);
                $('#user_list').append('<li><span id="'+json['id']+'">'+json['username']+'</span> - <a id="delete_'+json['id']+'" class="delete_user">Delete </a><a id="edit_'+json['id']+'" class="edit_user">Edit</a></li>');
                console.log(json['id']);
                console.log(json['username']);
                var id_new_item = json['id'];
                var id_new_item_delete = '#delete_'+json['id'].toString();
                var id_new_item_edit = '#edit_'+json['id'].toString();

                $('#user_list').on('click', id_new_item_delete, function() {

                    console.log('Clicked.');
                    var csrftoken = getCookie('csrftoken');

                    $.ajaxSetup({
                        beforeSend: function(xhr, settings) {
                            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                                xhr.setRequestHeader("X-CSRFToken", csrftoken);
                            }
                        }
                    });

                    $.ajax({
                        url: "/countcal/users/"+id_new_item+"/delete/",
                        type: "POST",
                        data: { id : id_new_item },
                        success : function(json2) {
                            $('#meal_'+id_new_item).hide();
                            console.log('Deleted.');
                        },
                        error : function(xhr,errmsg,err) {
                            console.log('Not deleted.');
                        }
                    });

                });

                $('#user_list').on('click', id_new_item_edit, function() {
                    var positionOfDash = id_new_item_edit.indexOf("_");
                    var idToBeEditedNumberOnly = id_new_item_edit.substring(positionOfDash + 1);
                    var mealCalId = "#meal_cal_id_"+idToBeEditedNumberOnly;
                    var mealDateId = "#meal_date_id_"+idToBeEditedNumberOnly;
                    var mealCommentId = "#meal_comment_id_"+idToBeEditedNumberOnly;
                    $('#to_be_edited').html(idToBeEditedNumberOnly);

                    var calString = $(mealCalId).html();
                    var lenOfCalString = calString.length;
                    var calOfThisMeal = parseInt(calString.substring(0, lenOfCalString-4));
                    $('#cal_edit_item').val(calOfThisMeal);

                    $('#date_edit_item').val($(mealDateId).html());
                    $('#comment_edit_item').val($(mealCommentId).html());
                    globalEditId = idToBeEditedNumberOnly;
                });

            },

            error : function(xhr,errmsg,err) {
                console.log(errmsg);
            }
        });

    });


    $('.edit_user').on('click', function() {
        console.log('Clicked.');
        var idToBeEdited = $(this).attr('id');
        console.log(idToBeEdited);
        var positionOfDash = idToBeEdited.indexOf("_");
        var idToBeEditedNumberOnly = idToBeEdited.substring(positionOfDash + 1);
        var userUsernameId = "#username_"+idToBeEditedNumberOnly;
        console.log(idToBeEditedNumberOnly);
        thisUsername = $('#username_'+idToBeEditedNumberOnly).text();
        $('#to_be_edited').html(thisUsername);
        globalEditId = idToBeEditedNumberOnly;
    });


    $('#edit_create_container').on('click', '#edit_this_item', function() {
        console.log('Clicked.');
        var updatedUsername2 = $('#username_edit_item').val();
        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        $.ajax({
            url: "/countcal/users/"+globalEditId+"/update/",
            type: "POST",
            data: { username: updatedUsername2 },
            success : function(json3) {
                console.log('Edited.');
                $('#username_'+globalEditId).html(updatedUsername2);
            },
            error : function(xhr,errmsg,err) {
                console.log(errmsg);
            }
        });

    });


});


function getCookie(name) {

    var cookieValue = null;

    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }

    return cookieValue;

}


function csrfSafeMethod(method) {

    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));

}