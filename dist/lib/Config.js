"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const fs_1 = __importDefault(require("fs"));
class Config {
    path;
    encoding;
    constructor(Path, initialData, encoding = "utf8") {
        this.path = Path;
        this.encoding = encoding;
        if (!fs_1.default.existsSync(this.path))
            fs_1.default.writeFileSync(this.path, JSON.stringify(initialData, null, 2), this.encoding);
    }
    get() {
        return JSON.parse(fs_1.default.readFileSync(this.path, this.encoding));
    }
    ArrayAdd(ArrayToCombine) {
        if (!Array.isArray(ArrayToCombine))
            return false;
        let CURRENT = this.get();
        if (CURRENT == null)
            return false;
        CURRENT = [...CURRENT, ...ArrayToCombine];
        this.set(CURRENT);
        return true;
    }
    ArrayRemove(ItemsToRemove) {
        if (!Array.isArray(ItemsToRemove))
            return false;
        let CURRENT = this.get();
        if (CURRENT == null)
            return false;
        try {
            for (const r_item of ItemsToRemove) {
                CURRENT = CURRENT.filter((item) => item != r_item);
            }
        }
        catch (err) {
            console.log(`
            [CONFIG] Error removing items from array config file ${this.path} error: ${err}
            `);
            return false;
        }
        this.set(CURRENT);
        return true;
    }
    set(obj) {
        try {
            fs_1.default.writeFileSync(this.path, JSON.stringify(obj, null, 2), this.encoding);
            return true;
        }
        catch (err) {
            return false;
        }
    }
}
exports.Config = Config;
