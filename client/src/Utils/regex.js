/**
 * Generic Utility to validate the regular expressions
 * @param {String} name - Key name to validate.
 * @param {String} value - Value for the key.
 * @param {Function} setError - State function to set the corresponding error or an empty string "".
 */

export default function verifyExpression(name, value, setError) {
    if (value) {
        switch (name) {
            case 'email': {
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$/.test(
                    value
                )
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: 'please enter a valid email.',
                      }));
                break;
            }

            case 'fullName':
            case 'name': {
                /^[a-zA-Z]{1,15}$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `only letters are allowed and should not exceed 15 characters.`,
                      }));
                break;
            }

            case 'rollNo': {
                /^[1-9]{1,3}$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `only numbers are allowed and should not exceed 3 characters.`,
                      }));
                break;
            }

            case 'phoneNumber': {
                /^[1-9]{1,10}$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `only numbers are allowed and should not exceed 10 characters.`,
                      }));
                break;
            }

            case 'password':
            case 'newPassword': {
                value.length >= 8 && value.length <= 12
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `${name.toLowerCase()} must be 8-12 characters.`,
                      }));
                break;
            }

            default: {
                console.log("Doesn't have a defined regex.");
                return;
            }
        }
    }
}
