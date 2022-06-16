/**
 * Logic to render all data on the canvas lives here
 */

 const keywords = [
  'steam',
  'meadows',
  'maths',
  'science',
  'engineering',
  'robots',
  'shopping'
];
const fr = 3;
const bg = 10;

const generateTweetQuery = (keywords) => {
  let query = keywords.reduce((acc, keyword) => {
    if (!acc.length) {
      return `${keyword}`;
    }
    acc += ` OR ${keyword}`

    return acc;
  }, "");

  return encodeURIComponent((`query=(${query})`));
};

setInterval(() => {
  redraw();
}, 5000);

setup = () => {
  console.log(`creating canvas with x ${windowWidth} and y ${windowHeight}`)
  createCanvas(windowWidth, windowHeight);
  frameRate(fr);
  background(bg);
},

windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
}

draw = () => {
  noLoop();
  let url = new URL('/tweets', window.location.href);
  url.search = "keywords=" + encodeURIComponent(window.location.search.substring(1) || keywords);
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      null;
    });
};