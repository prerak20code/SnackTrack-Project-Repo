import fs from 'fs';
import { MAX_FILE_SIZE, ALLOWED_EXT } from '../Constants/index.js';

/**
 * Generic Utility to validate the regular expressions
 * @param {String} name - Key name to validate.
 * @param {String} value - Value/File for the key.
 * @returns {Boolean} Boolean.
 */
export default function verifyExpression(name, value) {
    if (value) {
        switch (name) {
            case 'fullName':
            case 'name': {
                return /^[a-zA-Z ]{1,20}$/.test(value.trim());
            }

            case 'email': {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,100}$/.test(
                    value
                );
            }

            case 'hostelNumber':
            case 'rollNo': {
                console.log('hostelNumber', value);
                console.log(/^\d+$/.test(value));
                return /^\d+$/.test(value);
            }

            case 'hostelType': {
                console.log('hostelType', value);
                return value === 'GH' || value === 'BH' || value === 'IH';
            }

            case 'password': {
                console.log('password', value);
                return value.length >= 8 && value.length <= 12;
            }

            case 'kitchenKey': {
                console.log('kitchenKey', value);
                return /^[A-Z]{2}\d{2}[a-zA-Z0-9]{4,12}$/.test(value);
            }

            case 'phoneNumber': {
                console.log('phoneNumber', value);
                return /^[0-9]{10}$/.test(value);
            }

            case 'file': {
                try {
                    fs.accessSync(value, fs.constants.F_OK); // Check if the file exists
                    const stats = fs.statSync(value);
                    const fileSizeMB = stats.size / (1024 * 1024);
                    const extension = value.split('.').pop().toLowerCase();

                    return (
                        ALLOWED_EXT.includes(extension) &&
                        fileSizeMB <= MAX_FILE_SIZE
                    );
                } catch (err) {
                    console.error('Error accessing file:', err);
                    return false;
                }
            }

            default: {
                console.warn(`No regex defined for field: ${name}`);
                return false; // Return false if no regex is defined for this field
            }
        }
    } else {
        console.log('No value provided to validate for', name);
        return false;
    }
}
