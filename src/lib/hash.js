import crypto from 'crypto';

function sftoChar(sf) {
  let code = sf;
  if (sf > 37) {
    code = 59 + sf;
  } else if (sf > 11) {
    code = 54 + sf;
  } else if (code > 9) {
    code = (sf === 10) ? 45 : 95;
  } else {
    return code.toString();
  }
  return String.fromCharCode(code);
}

function decodeBytes(bytes) {
  const view = new Uint8Array(bytes);
  let buffer = 0;
  let string = "";
  for (let byte of view) {
    buffer << 8;
    buffer += byte;
    while (buffer >> 6 > 0) {
      string += sftoChar(buffer % 64);
      buffer = buffer >> 6;
    }
  }
  string += sftoChar(buffer);
  return string;
}

export default async function digest(message) {
  const hash = crypto.createHash('md5').update(message).digest();
  return decodeBytes(hash);
}