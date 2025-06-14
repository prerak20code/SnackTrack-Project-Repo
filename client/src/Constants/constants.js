const LIMIT = 20;

import LOGO from '../Assets/images/logo.png';
import SNACK_PLACEHOLDER_IMAGE from '../Assets/images/snack.png';
import USER_PLACEHOLDER_IMAGE from '../Assets/images/user.png';
const EMAIL = 'snacktrack@gmail.com';
const CONTACTNUMBER = 'xxxxxxxxxx';
const MAX_FILE_SIZE = 5;
const ALLOWED_EXT = ['png', 'jpg', 'jpeg'];
const SERVER_ERROR = 500;
const BAD_REQUEST = 400;

const CONTRIBUTORS = [
    {
        image: USER_PLACEHOLDER_IMAGE,
        role: 'Full Stack Developer',
        bio: 'Full-stack developer passionate about creating beautiful, scalable applications',
        name: 'Kartik',
        socials: {
            linkedIn: '',
            gitHub: 'https://github.com/mrkartik00',
            instagram: '',
        },
    },
    {
        image: USER_PLACEHOLDER_IMAGE,
        role: 'Full Stack Developer',
        bio: 'Full-stack developer passionate about creating beautiful, scalable applications',
        name: 'Karan',
        socials: {
            linkedIn: '',
            gitHub: 'https://github.com/Karan20991',
            instagram: '',
        },
    },
    {
        image: USER_PLACEHOLDER_IMAGE,
        role: 'Full Stack Developer',
        bio: 'Full-stack developer passionate about creating beautiful, scalable applications',
        name: 'Prerak ji',
        socials: {
            linkedIn: '',
            gitHub: '',
            instagram: '',
        },
    },
];

export {
    LIMIT,
    LOGO,
    SNACK_PLACEHOLDER_IMAGE,
    USER_PLACEHOLDER_IMAGE,
    MAX_FILE_SIZE,
    ALLOWED_EXT,
    CONTRIBUTORS,
    EMAIL,
    CONTACTNUMBER,
    SERVER_ERROR,
    BAD_REQUEST,
};
