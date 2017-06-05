function disableSubmitButton() {
    document.getElementById("spinner").style.display = '';
    var submitButton = document.getElementById('submitbtn');
    $('#submitbtn').css('background-color', '#F9BFBB');
    submitButton.disabled = true;
}

function doSubmit() {
    disableSubmitButton();
    var email = $("#email").val();
    var isCustomeUrl = $("#customUrl").attr('value');
    jagg.post("/site/blocks/password-reset/initiate/ajax/initiate.jag", {
            action: "initiatePasswordReset",
            email: email
        },
        function (result) {
            $('#userForm').hide();
            $('#helper_text').hide();
            var response = JSON.parse(result);
            if (!response.error) {
                jagg.message({
                    content: 'Password recovery instructions have been sent to ' + email + '. Please check your email.',
                    type: 'success',
                    cbk: function () {
                        if(isCustomeUrl == "true"){
                            window.location.href = "/site/pages/login.jag";
                        } else {
                            window.location.href = jagg.url("/site/pages/login.jag");
                        }
                    }
                });
            } else if ((response.message.indexOf("invalid user") != -1) || (response.message.indexOf("User does not exist") != -1)) {
                jagg.message({
                    content: 'No account found with the given email. Please try again with a correct email.',
                    type: 'error',
                    cbk: function () {
                        if(isCustomeUrl == "true"){
                            window.location.href = "/site/pages/initiate.jag";
                        } else {
                            window.location.href = jagg.url("/site/pages/initiate.jag");
                        }
                    }
                });
            } else {
                jagg.message({
                    content: 'Error occurred while resetting your password. Please try again after few minutes.' +
                    ' If you still have issues, please contact us <a href="mailto:cloud@wso2.com">(cloud@wso2.com)</a>',
                    type: 'error',
                    cbk: function () {
                        if(isCustomeUrl == "true"){
                            window.location.href = "/site/pages/login.jag";
                        } else {
                            window.location.href = jagg.url("/site/pages/login.jag");
                        }
                    }
                });
            }
        });
}

$(document).ready(function ($) {
    jQuery.validator.setDefaults({
        errorElement: 'span'
    });
    $('#userForm').validate({
        rules: {
            email: {
                required: true
            }
        },
        submitHandler: function (form) {
            doSubmit();
        }
    });
});
