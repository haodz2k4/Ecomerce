
interface Category {
    id: string;
    title: string;
    thumbnail: string;
    position: number;
    parent_category: string;
    children?: Category[];
}
// Recursion 
export const buildCategoryTree = (array: any[], parentId: string = ""): Category[] => {
    const newArray: Category[] = [];
    for (const item of array) {
        if (item.parent_category === parentId) {
            const children = buildCategoryTree(array, item.id);
            newArray.push({
                ...item.toObject(),
                children: children.length > 0 ? children : [] 
            });
        }
    }
    return newArray;
}