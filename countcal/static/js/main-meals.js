var globalEditId = 0;
var rawDateInFilter1 = '0';
var rawDateInFilter2 = '0';
var rawTimeInFilter1 = '0';
var rawTimeInFilter2 = '0';

$( document ).ready(function() {


    $('#now').html(moment(new Date()).format('YYYY-MM-DD'));


    $('.delete_meal').on('click', function() {
        console.log('Clicked.')
        var idOfButton = $(this).attr('id');
        var positionOfDash = idOfButton.indexOf("-");
        var idOfMeal = idOfButton.substring(positionOfDash + 1);
        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        $.ajax({
            url: "/countcal/meals/"+idOfMeal+"/delete/",
            type: "POST",
            data: { id : idOfMeal },
            success : function(json) {
                $('#meal-'+idOfMeal).hide();
                console.log('Deleted.');
            },
            error : function(xhr,errmsg,err) {
                console.log('Not deleted.');
            }
        });

    });


    $('#add_meal').on('click', function() {

        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        $.ajax({
            url: "/countcal/meals/create/",
            type: "POST",
            data: { cal: $('#cal_new_item').val(),
                    date : $('#date_new_item').val(),
                    comment : $('#comment_new_item').val() },
            success : function(json) {
                console.log('Added.');
                console.log(json);
                $('#meal_list').append('<li id="meal-'+json['id']+'" class="meal"><ul><li>'+json['id']+'</li><li id="meal_cal_id_'+json['id']+'" class="meal-cal">'+json['cal']+' cal.</li><li class="item_containing_datetime"><time id="meal_date_id_'+json['id']+'" class="meal-date" datetime="'+$('#date_new_item').val()+'">'+$('#date_new_item').val()+'</time></li><li id="meal_comment_id_'+json['id']+'" class="meal-comment">'+json['comment']+'</li></ul><div class="editdelete"><a id="edit-'+json['id']+'" class="edit_meal">Edit</a><br><a id="delete-'+json['id']+'" class="delete_meal">Delete</a></div></li>');
                canIEatMore();
                var id_new_item = json['id'];
                var id_new_item_delete = '#delete-'+json['id'].toString();
                var id_new_item_edit = '#edit-'+json['id'].toString();
                $('#meal_list').on('click', id_new_item_delete, function() {

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
                        url: "/countcal/meals/"+id_new_item+"/delete/",
                        type: "POST",
                        data: { id : id_new_item },
                        success : function(json2) {
                            $('#meal-'+id_new_item).hide();
                            console.log('Deleted.');
                            canIEatMore();
                        },
                        error : function(xhr,errmsg,err) {
                            console.log('Not deleted.');
                        }
                    });

                });

                $('#meal_list').on('click', id_new_item_edit, function() {
                    var positionOfDash = id_new_item_edit.indexOf("-");
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
                console.log('Error.');
                console.log(errmsg);
            }
        });

    });


    $('.edit_meal').on('click', function() {
        console.log('Clicked.');
        var idToBeEdited = $(this).attr('id');
        console.log(idToBeEdited);
        var positionOfDash = idToBeEdited.indexOf("-");
        var idToBeEditedNumberOnly = idToBeEdited.substring(positionOfDash + 1);
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


    $('#edit_create_container').on('click', '#edit_this_item', function() {
        console.log('Clicked.');
        var updatedCal2 = $('#cal_edit_item').val();
        var updatedDate2 = $('#date_edit_item').val();
        var updatedComment2 = $('#comment_edit_item').val();
        var csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        $.ajax({
            url: "/countcal/meals/"+globalEditId+"/update/",
            type: "POST",
            data: { cal: updatedCal2,
                    date : updatedDate2,
                    comment: updatedComment2 },
            success : function(json3) {
                console.log('Edited.');
                console.log(json3);
                $('#meal_cal_id_'+globalEditId).html(updatedCal2+" cal.");
                $('#meal_date_id_'+globalEditId).html(updatedDate2);
                $('#meal_comment_id_'+globalEditId).html(updatedComment2);
                canIEatMore();
            },
            error : function(xhr,errmsg,err) {
                console.log(errmsg);
            }
        });

    });


    $('#filter_meals').on('click', function() {
        makeAllMealsVisible();

        rawDateInFilter1 = $('#filter_by_date_1').val();
        rawDateInFilter2 = $('#filter_by_date_2').val();
        rawTimeInFilter1 = $('#filter_by_time_1').val();
        rawTimeInFilter2 = $('#filter_by_time_2').val();
        var preparedDateInFilter1 = rawDateInFilter1;
        var preparedDateInFilter2 = rawDateInFilter2;
        var preparedTimeInFilter1 = '2001-01-01 ' + rawTimeInFilter1;
        var preparedTimeInFilter2 = '2001-01-01 ' + rawTimeInFilter2;

        if (isDatesAndTimesInFilterValid()) {
            $('#meal_list .meal').each(function( index ) {
                var datetimeOfThisMeal = $(this).find('.meal-date').html();
                var dateOfThisMeal = datetimeOfThisMeal.substring(0, 10);
                var timeOfThisMeal = '2001-01-01 ' + datetimeOfThisMeal.substring(11,16);

                if (moment(dateOfThisMeal).isAfter(preparedDateInFilter2) || moment(preparedDateInFilter1).isAfter(dateOfThisMeal) || moment(timeOfThisMeal).isAfter(preparedTimeInFilter2) || moment(preparedTimeInFilter1).isAfter(timeOfThisMeal)) {
                    $(this).addClass('invisible');
                }
            });
        } else {
            alert("There was an error in filtering.");
        }

        rawDateInFilter1 = '0';
        rawDateInFilter2 = '0';
        rawTimeInFilter1 = '0';
        rawTimeInFilter2 = '0';
        var preparedDateInFilter1 = '0';
        var preparedDateInFilter2 = '0';
        var preparedTimeInFilter1 = '0';
        var preparedTimeInFilter2 = '0';
        $('#filter_by_date_1').val('');
        $('#filter_by_date_2').val('');
        $('#filter_by_time_1').val('');
        $('#filter_by_time_2').val('');

    });


    $('#show_all_meals').on('click', function() {
        makeAllMealsVisible();
    });


    $('#calculate_daily_cal').on('click', function() {
        canIEatMore();
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


function isDatesAndTimesInFilterValid() {

    if (moment(rawDateInFilter1, 'YYYY-MM-DD', true).isValid() && moment(rawDateInFilter2, 'YYYY-MM-DD', true).isValid() && moment(rawTimeInFilter1, 'HH:mm', true).isValid() && moment(rawTimeInFilter2, 'HH:mm', true).isValid()) {
        return true;
    }

    return false;

}


function seperateToDateAndTime(datetime) {

    date = null;
    time = null;
    return new Array(date, time);

}


function makeAllMealsVisible() {

    $('#meal_list .meal').each(function(index) {
        if ($(this).hasClass('invisible')) {
            $(this).removeClass('invisible');
        }
    });

}


function canIEatMore(){

    var calToday = 0;

    $('#meal_list .meal').each(function( index ) {
        var datetimeOfThisMeal = $(this).find('.meal-date').html();
        var dateOfThisMeal = datetimeOfThisMeal.substring(0, 10);
        var today = moment(new Date()).format('YYYY-MM-DD');

        if (dateOfThisMeal == today && ($(this).attr('style') != 'display: none;')) {
            var calString = $(this).find('.meal-cal').html();
            var lenOfCalString = ($(this).find('.meal-cal').html()).length;
            var calOfThisMeal = parseInt(calString.substring(0, lenOfCalString-4));
            calToday += calOfThisMeal;
        }
    });

    if ($('#cal_limit').val() > calToday) {
        $('#can_i_eat_more').html('You can eat more today.');
        $('#can_i_eat_more').removeClass('red_text');
        $('#can_i_eat_more').addClass('green_text');
        $('#can_i_eat_more').html('You can eat more today.');
    } else {
        $('#can_i_eat_more').removeClass('green_text');
        $('#can_i_eat_more').addClass('red_text');
        $('#can_i_eat_more').html('Your calorie limit for today has been reached.');
    }

}