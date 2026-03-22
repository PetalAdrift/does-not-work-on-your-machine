const DEJAVU_11P2_WIDTH_MAP = {
  "0": 7.125,
  "1": 7.125,
  "2": 7.125,
  "3": 7.125,
  "4": 7.333,
  "5": 7.125,
  "6": 7.125,
  "7": 7.125,
  "8": 7.125,
  "9": 7.125,
  " ": 3.563,
  "a": 6.865,
  "b": 7.333,
  "c": 6.156,
  "d": 7.115,
  "e": 7.333,
  "f": 4.667,
  "g": 7.115,
  "h": 7.104,
  "i": 3.115,
  "j": 3.781,
  "k": 7.333,
  "l": 3.115,
  "m": 10.906,
  "n": 7.104,
  "o": 7.333,
  "p": 7.333,
  "q": 7.115,
  "r": 5.333,
  "s": 6,
  "t": 4.667,
  "u": 7.104,
  "v": 6.667,
  "w": 10,
  "x": 7.333,
  "y": 6.667,
  "z": 6,
  "A": 8.667,
  "B": 7.688,
  "C": 8,
  "D": 8.667,
  "E": 7.073,
  "F": 6.667,
  "G": 8.677,
  "H": 8.427,
  "I": 3.302,
  "J": 4.635,
  "K": 8,
  "L": 6.667,
  "M": 9.667,
  "N": 8.375,
  "O": 8.813,
  "P": 6.75,
  "Q": 8.813,
  "R": 8,
  "S": 7.333,
  "T": 8,
  "U": 8.198,
  "V": 8.667,
  "W": 11.333,
  "X": 8,
  "Y": 8,
  "Z": 8,
  "-": 4.042,
  "_": 6.667,
  ".": 3.563,
  ":": 3.781,
  "(": 4.375,
  ")": 4.375,
  "[": 4.375,
  "]": 4.375,
  "!": 4.49,
  "@": 11.333,
  "#": 9.385,
  "$": 7.125,
  "%": 10.667,
  "^": 9.385,
  "&": 8.729,
  "*": 6,
  "+": 9.385,
  "=": 9.385,
  "|": 3.781,
  "\\": 5.333,
  "/": 5.333,
  "?": 6,
  "<": 9.385,
  ">": 9.385,
  ",": 3.563,
  "~": 9.385,
  "`": 5.604,
  "'": 3.083,
  "\"": 5.156
}

const MAGIC_KERN = 0.974;  // magic kerning factor computed from some test strings

function measureText(str) {
    // use precomputed width map; fall back to average across "a" to "Z"
    return str.split('').reduce((acc, char) => acc + (DEJAVU_11P2_WIDTH_MAP[char] || 7.2), 0) * MAGIC_KERN;
}

module.exports = function (req, res) {
    const {name: rawName = 'on my machine'} = req.query;
    const name = `on ${rawName}`;
    const nameWidth = measureText(name);
    const nameX = (91.9 + nameWidth/2).toFixed(1);
    const greenWidth = 8.86 + measureText(name);
    const totalWidth = 89 + greenWidth;
    const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <title>Does not Work on my Machine</title>
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3.5" width="99" height="20" fill="#555"/>
  <rect rx="3.5" x="89" width="${greenWidth}" height="20" fill="#4c1"/>
  <path fill="#4c1" d="M89 0h4v20h-4z"/>
  <rect rx="3.5" width="${totalWidth}" height="20" fill="url(#a)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11.2">
      <text x="44.5" y="15" fill="#010101" fill-opacity=".3">does not work</text>
      <text x="44.5" y="14">does not work</text>
      <text x="${nameX}" y="15" fill="#010101" fill-opacity=".3">${name}</text>
      <text x="${nameX}" y="14">${name}</text>
  </g>
</svg>`.trim();
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).send(svgString);
}