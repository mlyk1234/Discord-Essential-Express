import { ValidationError } from "class-validator";

export const classValidatorParser = (obj: ValidationError[]) => {
    let map: any;
    obj.forEach((item: ValidationError) => {
        map = {
            ...map,
            [item.property]: Object.values(item.constraints).toString()
        }
    })

    return map;
}