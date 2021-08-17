import fs from "fs"

export class Config<T> {
    path: string
    encoding: BufferEncoding;

    constructor(Path: string, initialData: T, encoding: BufferEncoding = "utf8") {
        this.path = Path;
        this.encoding = encoding;
        if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, JSON.stringify(initialData, null, 2), this.encoding);
    }

    get(): T { // Could add try catch but will require to add additional if null check and that just messy
        return JSON.parse(fs.readFileSync(this.path, this.encoding));
    }

    ArrayAdd(ArrayToCombine: T) {
        if (!Array.isArray(ArrayToCombine)) return false;

        let CURRENT: any = this.get(); if (CURRENT == null) return false;

        CURRENT = [...CURRENT, ...ArrayToCombine];

        this.set(CURRENT);
        return true;
    }

    ArrayRemove(ItemsToRemove: T) {
        if (!Array.isArray(ItemsToRemove)) return false;

        let CURRENT: any = this.get(); if (CURRENT == null) return false;


        try {
            for (const r_item of ItemsToRemove) {
                CURRENT = CURRENT.filter((item: any) => item != r_item);
            }
        } catch (err) {
            console.log(`
            [CONFIG] Error removing items from array config file ${this.path} error: ${err}
            `)
            return false;
        }


        this.set(CURRENT);
        return true;
    }

    set(obj: T) {
        try {
            fs.writeFileSync(this.path, JSON.stringify(obj, null, 2), this.encoding);
            return true;
        } catch (err) { return false; }
    }
}