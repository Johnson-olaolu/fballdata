$(document).ready(function () {

    // Validate Username
    $("#fullnamecheck").hide();
    let usernameError = true;
    $("#floatingInput").keyup(function () {
        validateFullName();
    });

    function validateFullName() {
        let fullnameValue = $("#floatingInput").val();
        if (fullnameValue.length === "") {
            $("#fullnamecheck").show();
            usernameError = false;
            return false;
        } else if (fullnameValue.length < 3) {
            $("#fullnamecheck").show();
            $("#fullnamecheck").html("**length of username must be more than 3");
            usernameError = false;
            return false;
        } else {
            $("#fullnamecheck").hide();
            usernameError = true;
        }
    }

    // Validate Email
    const email = document.getElementById("floatingEmail");
    let emailError = true;
    email.addEventListener("blur", () => {
        let regex =
            /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
        let s = email.value()
        if (!regex.test(s)) {
            $("#emailcheck").show();
            $("#emailcheck").html("**please enter valid email");
            emailError = false;
            return false;
        } else {
            $("#emailcheck").hide();
            emailError = true;
        }
    });

    // Validate Password
    $("#passcheck").hide();
    let passwordError = true;
    $("#floatingPassword").keyup(function () {
        validatePassword();
    });
    function validatePassword() {
        let passwordValue = $("#password").val();
        if (passwordValue.length === "") {
            $("#passcheck").show();
            passwordError = false;
            return false;
        }
        if (passwordValue.length < 6) {
            $("#passcheck").show();
            $("#passcheck").html(
                "**length of your password must be more than 6 digits"
            );
            $("#passcheck").css("color", "red");
            passwordError = false;
            return false;
        } else {
            $("#passcheck").hide();
            passwordError = true;
        }
    }

    // Validate Confirm Password
    $("#conpasscheck").hide();
    let confirmPasswordError = true;
    $("#conpassword").keyup(function () {
        validateConfirmPassword();
    });
    function validateConfirmPassword() {
        let confirmPasswordValue = $("#conpassword").val();
        let passwordValue = $("#floatingPassword").val();
        if (passwordValue !== confirmPasswordValue) {
            $("#conpasscheck").show();
            $("#conpasscheck").html("**Password didn't Match");
            $("#conpasscheck").css("color", "red");
            confirmPasswordError = false;
            return false;
        } else {
            $("#conpasscheck").hide();
            confirmPasswordError = true;
        }
    }

    // Submit button
    $("#submitbtn").click(function () {
        validateFullName();
        validatePassword();
        validateConfirmPassword();
        email.dispatchEvent(new Event('blur'));

        return usernameError &&
            passwordError &&
            confirmPasswordError &&
            emailError;
    });
});
