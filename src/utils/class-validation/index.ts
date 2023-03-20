import { classValidatorParser } from './../helpers/class-validator-helper';
import { validate } from 'class-validator';
import { ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ClassType } from "class-transformer/ClassTransformer";

export const expressValidator = async (payload: any, classDTO: ClassType<any>) => {
    try {
        const body = plainToClass(classDTO, payload);
        const err: ValidationError[] = await validate(body);
        if(err.length > 0) {
            const validation = classValidatorParser(err);
            throw validation
        }
    } catch (error) {
        throw {
            statusCode: 400,
            message: "Bad Request",
            reason: error
        }
    }

}