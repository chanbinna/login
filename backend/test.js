import bcrypt from 'bcryptjs';

async function testHashingAndComparison() {
    const plainTextPassword = 'new'; // Replace with your desired plain text password

    // Hash the plain text password
    const hashedPassword = '$2a$10$xT3r.2TTyapiiLM.HH7q8uR68DaTbuaIqwh0CMKLJC.0BYYD64XbC'
    // Compare the plain text password with the generated hash
    const isValid = await bcrypt.compare(plainTextPassword, hashedPassword);
    console.log('Password valid:', isValid); // Should print true
}

testHashingAndComparison();