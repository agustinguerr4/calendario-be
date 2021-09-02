import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server'
import 'dotenv/config'


module.exports = (context) => {
    const authHeader = context.headers.authorization;

    if (authHeader) {
        const token = authHeader.split('Bearer ')[1].split(', ')[0];
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                return user
            } catch (err) {
                return new AuthenticationError("El token es inválido o ha expirado.")
            }
        }
        return new Error("El token debe ser 'Bearer [token]'")
    }
    return new Error("Se necesita un token para validar la identidad")
}