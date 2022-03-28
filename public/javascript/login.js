async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            // you have to stringify the body when you use fetch
            body: JSON.stringify({
                email,
                password
            }),
            // you also have to tell fetch you will be passing JSON
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            // if the response is sucessful it will take us back to the home page
            // document.location is the URL?
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
};


async function signupFormHandler(event) {
    event.preventDefault();

    // here we grab the values from the signup form once they click the submit button
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // if we have all three then we make the fetch request
    if (username && email && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body:JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        // check the response status
        if (response.ok) {
            console.log('success');
        } else {
            alert(response.statusText);
        }
    }
};




document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
