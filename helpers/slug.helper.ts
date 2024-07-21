
import {Model} from "mongoose";
export const createUniqueSlug = async (model: Model<any>, initialSlug: string): Promise<string> => {
    let slug = initialSlug;
    let counter = 1;
    while (await model.exists({ slug })) {
        slug = `${initialSlug}-${counter++}`;
    }
    return slug;
}