import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../../config'
import { AuthenticationError } from 'apollo-server'

module.exports = (context) => {
    const authHeader = context.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user
            } catch (err) {
                return new AuthenticationError("El token es inválido o ha expirado.")
            }
        }
        return new Error("El token debe ser 'Bearer [token]'")
    }
    return new Error("Se necesita un token para validar la identidad")
}