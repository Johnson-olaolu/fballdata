$(document).ready(function () {

    $("#login-button-loader").hide()
    $("#login-button-text").show()

    // Validate Username
    $("#usercheck").hide();
    let usernameError = true;
    $("#floatingInput").keyup(function () {
        validateUsername();
    });

    function validateUsername() {
        let usernameValue = $("#floatingInput").val();
        let regex =
            /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
        if (!regex.test(usernameValue)) {
            $("#usercheck").show();
            $("#usercheck").html("**please enter valid email");
            usernameError = false;
            return false;
        } else {
            $("#usercheck").hide();
            usernameError = true;
        }
    }

    //toggle password
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#floatingPassword');

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Validate Password
    $("#passcheck").hide();
    let passwordError = true;
    $("#floatingPassword").keyup(function () {
        validatePassword();
    });
    function validatePassword() {
        let passwordValue = $("#floatingPassword").val();
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

    // Submit button
    $("#submitbtn").click(function () {
        validateUsername();
        validatePassword();

        const isvalid = usernameError &&
            passwordError;
        if (isvalid) {
            $("#login-button-loader").show()
            $("#login-button-text").hide()
        }
    });
});
