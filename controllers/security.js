import bcrypt from 'bcrypt'

export async function hashPassword(password) {
    const rounds = 10;
    try {
        const hash = await bcrypt.hash(password, rounds);
        return hash;
    } catch(error) {
        console.error("Error while hashing password.", error)
    }
}

export async function checkPassword(inputPassword, hash) {
    try {
        const match = await bcrypt.compare(inputPassword, hash);
        return match;
    } catch(error) {
        console.error("Error while checking password.", error)
        return false;
    }
}