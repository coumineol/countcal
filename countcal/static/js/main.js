$( document ).ready(function() {

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
                    date : $('#date_new_item').val() },
            success : function(json) {
                console.log('Added.');
                console.log(json);

                $("#meal_list").append('<div id="meal-'+json['id']+'" class="meal"><ul><li>'+json['id']+'</li><li class="meal-cal">'+json['cal']+' cal.</li><li><time class="meal-date">'+json['date']+'</time></li></ul><div class="editdelete"><form method="POST" action="/countcal/meals/'+json['id']+'/update/"><input class="edit_button" type="submit" value="Edit"></form><a id="delete-'+json['id']+'" class="delete_meal">Delete</a></div></div>');

            },
            error : function(xhr,errmsg,err) {
                console.log('Error.');
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
