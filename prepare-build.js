const fs = require('fs');
const { promisify } = require('util');
const sizeOf = promisify(require('image-size'));

const cdnPath = 'cdn';
const destPath = './backend';

const imageRegex = /\.(png|jpe?g|gif|svg)(\?.*)?$/;

async function buildTpl() {
  const json = [];
  const tasks = [];
  fs.readdirSync('./img').forEach((fileName) => {
    if (fileName.match(imageRegex)) {
      const cdnUrl = `${cdnPath}/img/${fileName}`;
      json.push({
        name: fileName.replace(imageRegex, ''),
        localUrl: cdnUrl,
        cdnUrl,
      });
      tasks.push(sizeOf(`./img/${fileName}`));
    }
  });
  const sizes = await Promise.all(tasks);
  sizes.forEach(({ width, height }, index) => {
    json[index].size = `${width}x${height}`;
  });
  await Promise.all([
    promisify(fs.writeFile)(
      `${destPath}/images.json`,
      JSON.stringify(json, null, 2),
    ),
  ]);
}

(async () => {
  try {
    // await Promise.all([del('dist/**/*'), buildTpl()]);
    await buildTpl();
    console.log('prepare done!');
  } catch (err) {
    console.log(err);
  }
})();
