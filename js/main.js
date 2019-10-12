$(document).ready(function () {

    $("#error-div").css("display", "none");
    $("#review-error-div").css("display", "none");
    $("#irrigation-error-div").css("display", "none");
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').focus()
    });
    $('#myModal2').on('shown.bs.modal', function () {
        $('#myInput').focus()
    });
    $("#myModal").on("hidden.bs.modal", function(){
         $(this)
    .find("input,textarea,select")
       .val('')
       .end()
    .find("input[type=checkbox], input[type=radio]")
       .prop("checked", "")
       .end();
    $("label").remove(".custom-error");
    $("#review-error-div").css("display", "none");
    $("#review-error-focus").remove().last();
    // grecaptcha.reset();
});
    $("#myModal2").on("hidden.bs.modal", function(){
         $(this)
    .find("input,textarea,select")
       .val('')
       .end()
    .find("input[type=checkbox], input[type=radio]")
       .prop("checked", "")
       .end();
    $("label").remove(".custom-error");
    $("#irrigation-error-div").css("display", "none");
    $("#irrigation-error-focus").remove().last();
});
       
    $("#zipcode").keyup(function() {

    if (!this.value) {
        $("#state").val("");
        $("#city").val("");
    }

});


$(window).scroll(function(){

    if ($(window).scrollTop() > 970) {
        $('.navbar').addClass('navbar-fixed-top');
    }
    if ($(window).scrollTop() < 971) {
        $('.navbar').removeClass('navbar-fixed-top');
    }

});
    $(".navbar-dark ul li a[href^='#']").on('click', function (e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function () {
            window.location.hash = hash;
        });
    });
    $("#cover .scroll-to-gallery-section a[href^='#']").on('click', function (e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function () {
            window.location.hash = hash;
        });
    });
    $("#cover .scroll-to-services a[href^='#']").on('click', function (e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function () {
            window.location.hash = hash;
        });
    });
    $(".home .section-features a[href^='#']").on('click', function (e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function () {
            window.location.hash = hash;
        });
    });
    $(".footer .scroll-to-top-button a[href^='#']").on('click', function (e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function () {
            window.location.hash = hash;
        });
    });

    $("#generalcontact").validate({
      errorClass: 'custom-error',
       rules: {
           fname: "required",
           email: "required",
           message: {
                required: true,
               maxlength: 500
           },
           phone: {
                required: true,
               phoneUS: true
           }
       },
        messages: {
            email:
            {
                required: "Please enter an email.",
                email: "Please enter a valid email."
            },
            phone: {
              required: "Please enter a phone number."
            },
            fname: {
              required: "Please enter full name."
            },
            message: {
              required: "Please provide a brief message describing your needs."
            }
        },
        submitHandler: function(form) {
             $.ajax({
                 type: "POST",
                 url: "../includes/mail.php",
                 data: $(form).serialize(),
                 success: function () {
                     $(form).html("<div id='success-message'></div>");
                     $('#success-message').html("<h2>Your request is on the way!</h2>")
                         .append("<p class='lead under-heading'>Thank You!</p>")
                         .hide()
                         .fadeIn(1500, function () {
                         $('#success-message').append("<img id='checkmark' style='padding-left:150px;' src='images/ok.png' />");
                     });
                     setTimeout(function(){
                        location.reload();
                    },6000);
                 }, error: function() {
                     // think of something clever to print to user as a friendly error message
                     //advising the user to contact Carter's Lawn Service Company.
                     //$(this).closest('form').find("input[type=text], textarea").val("");
                     $("#error-div").show();
                     $("#error-focus").remove().last();
                     $("#error-div").append("<span style='font-family: 'Nunito-Regular';' id='error-focus'>Your request was not submitted. We apologize for the inconvenience. Please Contact Carter's Quality Lawn Service at "+ "<a href='mailto:geovannie32@gmail.com?Subject=Problem%20with%20Form%20Submission' target='_top'>Email</a>" + " for support"+ ".</span>");
                 }
             });
             return false; // required to block normal submit since you used ajax
        }
    });

    $("#reviewform").validate({
      errorClass: 'custom-error',
       rules: {
           name: "required",
           email: {
               required: true,
               email: true
           },
           message: {
                required: true
           }
       },
        messages: {
            name: {
                required: "Please provide a name.",
            },
            email: {
                required: "Please provide an email.",
                email: "Please provide a valid email."
            }
        },
        submitHandler: function(form) {
          $("#review-error-div").hide();
          $("#review-error-focus").remove().last();
            $(form).submit(function() {

                var formData = new FormData(this);

                $.ajax({
                    url: "../includes/review.php",
                    type: 'POST',
                    data: formData,
                    async: true,
                    success: function (data) {
                               $(form).html("<div id='review-success-message'></div>");
                               $('#review-success-message').html("<h2 style='color:white;'>We appreciate your Feedback!</h2>")
                                   .append("<p style='color:white;' class='lead under-heading'>Thank you</p>")
                                   .hide()
                                   .fadeIn(1500, function () {
                                   $('#review-success-message').append("<img id='checkmark' style='padding-left:150px;' src='images/thankyou.png' />");
                               });
                           setTimeout(function(){
                              location.reload();
                          },6000);
                    }, error: function(resp) {
                        // think of something clever to print to user as a friendly error message
                        //advising the user to contact Carter's Lawn Service Company.
                        //$(this).closest('form').find("input[type=text], textarea").val("");
                        $("#review-error-div").show();
                        $("#review-error-focus").remove().last();
                        $("#review-error-div").append("<span style='font-family: 'Nunito-Regular';' id='irrigation-error-focus'>Your request was not submitted. We apologize for the inconvenience. Please Contact Carter's Quality Lawn Service at "+ "<a href='mailto:geovannie32@gmail.com?Subject=Problem%20with%20Irrigation%20Form%20Submission' target='_top'>Email</a>" + " for support"+ ".</span>");

                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
                return false;
            });
             return false; // required to block normal submit since you used ajax
        }
    });

    $("#irrigation-form").validate({
      errorClass: 'custom-error',
        rules: {
            fname: "required",
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                phoneUS: true
            },
            job: {
                required: true,
                job: true
            },
            zipcode: {
              required: true,
              number: true
            },
            city: {
                required: true
            },
            state: {
                required:true
            },
            address: "required",
            message: "required"
        },
        messages: {
            email: {
                required: "Please provide an email address.",
                email: "Please provide a valid email address."
            }
        },
        submitHandler: function(form) {
            $.ajax({
                 type: "POST",
                 url: "../includes/mail.php",
                 data: $(form).serialize(),
                 success: function () {
                     $(form).html("<div id='irrigation-success-message'></div>");
                     $('#irrigation-success-message').html("<h2>Your request is on the way!</h2>")
                         .append("<p class='lead under-heading'>Thank You!</p>")
                         .hide()
                         .fadeIn(1500, function () {
                         $('#irrigation-success-message').append("<img id='checkmark' style='padding-left:150px;' src='images/ok.png' />");
                     });
                     setTimeout(function(){
                        location.reload();
                    },6000);
                 }, error: function() {
                     // think of something clever to print to user as a friendly error message
                     //advising the user to contact Carter's Lawn Service Company.
                     //$(this).closest('form').find("input[type=text], textarea").val("");
                     $("#irrigation-error-div").show();
                     $("#irrigation-error-focus").remove().last();
                     $("#irrigation-error-div").append("<span style='font-family: 'Nunito-Regular';' id='irrigation-error-focus'>Your request was not submitted. We apologize for the inconvenience. Please Contact Carter's Quality Lawn Service at "+ "<a href='mailto:geovannie32@gmail.com?Subject=Problem%20with%20Irrigation%20Form%20Submission' target='_top'>Email</a>" + " for support"+ ".</span>");
                 }
             });
             return false; // required to block normal submit since you used ajax
        }
    });
});
//work on not refreshing page and removing owl carousel item and then adding new carousel item from db TODO
function submitAjax()
{
 var ourRequest = new XMLHttpRequest();
 ourRequest.open('POST', '../includes/review.php', true);
 ourRequest.onload = function() {
   var data = JSON.parse(ourRequest.responseText);
   customerReview(data);
 };
 ourRequest.send();
}
function customerReview(result) {
if(result.length > 0) {
 for(var key in result) {

     if(result[key].ImageUrl == "")
     {
       result[key].ImageUrl = "images/Carters-Logo.png";
     }
     $("#owl-carousel").empty();
     //$('#drop-owl').append("<div class='owl-carousel owl-theme' id='owl-carousel'></div>");
     $('#owl-carousel').owlCarousel().trigger('add.owl.carousel',
                   [jQuery('<div class="owl-item">' + "<div class='item'> <img src=" + "'" + result[key].ImageUrl + "'" + " class='review-img' max-width='50px'><p> " + result[key].Message + " </p> <span class='name'><i>-" + result[key].Name + "</i></span> </div>" +
                           '</div>')]).trigger('refresh.owl.carousel');
     }
   }
   else {
       $("#owl-carousel").css("display", "inline-block");
     $("#owl-carousel").append("<i style='display:inline-block;text-align:center; font-family: 'Nunito-Regular'; font-size: 5rem;'>No Reviews. Be the first to leave us a review.</i>");
   }
}
function myFunction() {
    document.getElementById("act-on-upload").click(); // Click on the checkbox
}
