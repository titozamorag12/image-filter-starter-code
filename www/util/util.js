"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const Jimp = require("jimp");
// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
function filterImageFromURL(inputURL) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const photo = yield Jimp.read(inputURL);
            const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            yield photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(__dirname + outpath, (img) => {
                resolve(__dirname + outpath);
            });
        }));
    });
}
exports.filterImageFromURL = filterImageFromURL;
function isImageValidAndExists(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let exists;
        try {
            const response = yield axios_1.default.head(imageUrl);
            exists =
                response.status === 200 &&
                    isSupportedImageFormat(response.headers["content-type"]);
        }
        catch (e) {
            exists = false;
        }
        return exists;
    });
}
exports.isImageValidAndExists = isImageValidAndExists;
function isSupportedImageFormat(format) {
    return [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/tiff",
        "image/bmp",
    ].includes(format);
}
// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
function deleteLocalFiles(files) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let file of files) {
            fs_1.default.unlinkSync(file);
        }
    });
}
exports.deleteLocalFiles = deleteLocalFiles;
function getTempFiles() {
    return getDirectoryContent(path_1.default.join(__dirname, "tmp")).map((file) => {
        return path_1.default.join(__dirname, "tmp", file);
    });
}
exports.getTempFiles = getTempFiles;
function getDirectoryContent(directoryPath) {
    return fs_1.default.readdirSync(directoryPath);
}
//# sourceMappingURL=util.js.map