module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
//This code exports a function that generates a random hexadecimal string of length 4.
