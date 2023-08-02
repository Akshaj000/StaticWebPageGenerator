type RegistrationInput = {
    name: string,
    username: string,
    email: string,
    password: string
}

const RegisterAPI = async ({ name, email, password }: RegistrationInput) => {
    await fetch(`${process.env.API_ENDPOINT}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        }),
    }).then((response) => {
        if (response.ok) {
            return true;
        }
    }).catch((error) => {
        console.error(error);
        return false;
    });
    return false;
}

export default RegisterAPI;
