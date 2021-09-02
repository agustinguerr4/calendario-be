module.exports.validateRegisterInput = (
    username,
    email,
    password,
    // age,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'El nombre de usuario no puede estar vacío.';
    }
    if (username.length < 4) {
        errors.username = 'El nombre de usuario no puede tener menos de 4 caractéres.';
    }
    if (email.trim() === '') {
        errors.email = 'El email no puede estar vacío.';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'El correo electrónico no es válido.';
        }
    }
    if (password === '') {
        errors.password = 'La contraseña no puede estar vacía.';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Las contraseñas deben coincidir.';
    }
    if (password.length < 6) {
        errors.password = 'La contraseña debe contener al menos 6 caractéres.';
    }
    // if (age < 18) {
    //     errors.age = 'Debes ser mayor de 18 años para registarte.';
    // }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'El usuario no debe estar vacío';
    }
    if (password.trim() === '') {
        errors.password = 'La contraseña no debe estar vacía';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};