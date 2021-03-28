// script para dar resize e comprimir imgs

const sharp = require('sharp');
const compress = require('compress-images');
const fs = require('fs');

let path = process.argv[2];
let width = Number(process.argv[3]);
let height = Number(process.argv[4]);

function resize(path, new_width, new_height){
    sharp(path).resize({ width: new_width , height: new_height})
        .toFile(`./temp/${path}`)
        .then(function(newFileInfo){
            console.log("sucess", newFileInfo);
            compress_img(path, `./compressed/`);
        }).catch(err => {
            console.log("error occurred", err)
        })
}

function compress_img(input_img, out_img){
    compress(`./temp/${input_img}`, out_img.concat("compressed_"), { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (error, completed, statistic) {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
            fs.unlink(`./temp/${input_img}`, err => {
                if(err){ throw err};
                console.log(`./temp/${input_img}, removed`);
            })
        }

    );
}

resize(path, width, height);

