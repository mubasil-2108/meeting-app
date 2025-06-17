interface User {
    id: string;
    email: string;
    hashedPassword: string;
}
const USERS: User[] = [];

module.exports = USERS;