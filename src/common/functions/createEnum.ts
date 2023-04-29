import { EnumFrom } from "../types";

export function createEnum<TKeys extends string[]>(...keys: TKeys): EnumFrom<TKeys> {
    const result: any = {};
    for (let i = 0; i < keys.length; i++) {
        result[keys[i]] = keys[i];
    }

    return result;
}
