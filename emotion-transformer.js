const fsP = require('fs').promises;
const MagicString = require('magic-string');

const emotionMapping = {
  happy: '😃',
  sad: '😢',
  angry: '😠'
};

const runTransformation = async () => {
  try {
    const code = await fsP.readFile('input.js', 'utf8');
    const s = new MagicString(code);
  
    const pattern = /\b(happy|sad|angry)\b/g;

    while ((match = pattern.exec(code))) {
      const emotion = match[0];
      const start = match.index;
      const end = start + emotion.length;
      s.overwrite(start, end, emotionMapping[emotion]);
    }

    const outputSourceMap = 'output.js.map';

    const map = s.generateMap({
      source: 'input.js',
      file: outputSourceMap,
      includeContent: true,
    });

    const sourceMapURL = '\n//# sourceMappingURL=' + outputSourceMap;

    await fsP.writeFile('output.js', s.toString() + sourceMapURL);
    await fsP.writeFile('output.js.map', map.toString());

  } catch (err) {
    throw err;
  }
}

runTransformation();
