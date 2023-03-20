import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import initAdmin from "../../database/models/admin";


export const login = async (payload: any) => {

    try {
        const result = await initAdmin.findOne({
            email: payload.email
        })
        if(result) {
            await verifyPassword(payload.password, result.password);
            const access_token = await generateToken({email: result.email})
            return {
                email: result.email,
                username: result.username,
                role: result.role,
                access_token: access_token,
                expiresIn: Date.now() + 3600000
            }
        } else throw {
            statusCode: 400,
            message: "Unidentified credentials."
        }
    } catch (error) {
        throw error;
    }

}

const generateToken = async (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })
}

const verifyPassword = async (givenPassword: string, purePassword: string) => {
    const result = await bcrypt.compare(givenPassword, purePassword);
    if(!result) {
        throw {
            statusCode: 400,
            message: "Invalid Credentials."
        }
    } else {
        return result;
    }
}

export const register = async (payload: any) => {
    const saltRounds = 10
    const hash = await bcrypt.hash(payload.password, saltRounds);

    await initAdmin.create({
        email: payload.email,
        username: payload.username,
        password: hash,
        role: 'S'
    })
}