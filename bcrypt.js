// Import bcryptjs
const bcrypt = require('bcryptjs');

// Function to hash a password
async function hashPassword(plainPassword) {
  try {
    const saltRounds = 10; // You can increase for better security
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const password = 'password';
  const hashed = await hashPassword(password);
  console.log('Plain Password:', password);
  console.log('Hashed Password:', hashed);
}
//hiii
//triger
main();