const validate = (val, rules) => {
    let isValid = true
    for (let rule in rules) {
        switch (rule) {
            case 'isEmail':
                isValid = isValid && emailValidator(val)
                return isValid ? null : "Email is not valid"
                break;
            case 'minLength':
                isValid = isValid && minLengthValidator(val, rules[rule])
                return isValid ? null : "Password length must be a minimum of 6"
                break;
            case 'equalTo':
                isValid = isValid && equalToValidator(val, rules[rule])
                return isValid ? null : "Passwords do not match"
                break
            default:
                break;
        }
    }
}

const emailValidator = (val) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(val).toLowerCase());
}

const minLengthValidator = (val, minLength) => {
    return val.length >= minLength
}

const equalToValidator = (val, checkValue) => {
    return val === checkValue
}

export default validate