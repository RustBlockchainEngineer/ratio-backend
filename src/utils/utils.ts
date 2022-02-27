import { PARAM } from "../models/model";

export function isNotSafe(keyList: string[], obj: Object): boolean {

    for (let key of keyList) {
        if (!(key in obj))
            return true;
    }
    return false;
}
