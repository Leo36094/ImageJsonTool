const fs = require('fs');
const { promisify } = require('util');

const cdnPath = '/';
const destPath = './';

const imageRegex = /\.(png|jpe?g|gif|svg)(\?.*)?$/;

async function buildTpl() {
  let json = {};
  fs.readdirSync('./img').forEach((fileName) => {
    if (fileName.match(imageRegex)) {
      const cdnUrl = `${cdnPath}img/${fileName}`;
      json = {
        ...json,
        [fileName.replace(imageRegex, '')]: cdnUrl,
      };
    }
  });
  await Promise.all([
    promisify(fs.writeFile)(
      `${destPath}/cdn.json`,
      JSON.stringify(json, null, 2),
    ),
  ]);
}

(async () => {
  try {
    await buildTpl();
    console.log('prepare done!');
  } catch (err) {
    console.log(err);
  }
})();
