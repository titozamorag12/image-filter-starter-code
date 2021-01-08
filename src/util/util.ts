import fs from 'fs';
import axios from "axios";
import path from "path";
import Jimp = require('jimp');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
    return new Promise(async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname + outpath, (img) => {
                resolve(__dirname + outpath);
            });
    });
}

export async function isImageValidAndExists(imageUrl: string) {
    let exists;

    try {
        const response = await axios.head(imageUrl);
        exists =
            response.status === 200 &&
            isSupportedImageFormat(response.headers["content-type"]);
    } catch (e) {
        exists = false;
    }

    return exists;
}

function isSupportedImageFormat(format: string) {
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
export async function deleteLocalFiles(files: Array<string>) {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}

export function getTempFiles() {
    return getDirectoryContent(path.join(__dirname, "tmp")).map((file) => {
        return path.join(__dirname, "tmp", file);
    });
}

function getDirectoryContent(directoryPath: string) {
    return fs.readdirSync(directoryPath);
}
