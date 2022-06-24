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
let bg;

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
}, 20000);

setup = () => {
  console.log(`creating canvas with x ${windowWidth} and y ${windowHeight}`)
  createCanvas(windowWidth, windowHeight);
  bg = loadImage('/world-map-coloring-page.png');
  background(bg);
},

windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
}

draw = () => {
  noLoop();
  // set origin as center of canvas
  translate((windowWidth/2), (windowHeight/2));
  let url = new URL('/tweets', window.location.href);
  url.search = "keywords=" + encodeURIComponent(window.location.search.substring(1) || keywords);
  fetch(url, {})
    .then((res) => res.json())
    .catch((err) => { throw new Error(err) } )
    .then((json) => {
      clear();
      background(bg);
      let userMap = json.includes.users.reduce((acc, user) => {
        acc[user.id] = user

        return acc;
      }, {});

      json.data.forEach((tweet) => {
        let authorId = tweet['author_id'];
        let user = userMap[authorId]

        if (user.location !== undefined) {
          let url = new URL('/geoloc', window.location.href);
          url.search = `place=${user.location}`
          fetch(url, {})
          .then((res) => res.json())
          .then((json) => {
            if (
              json.features !== undefined 
              && json.features.length 
              && json.features[0].center
            ) {
              let [lat, long] = json.features[0].center;
              console.log(`authorId ${authorId} located at ${lat}, ${long}`);
              let scaledLat = (lat/180) * (windowHeight/2);
              let scaledLong = (long/85) * (windowWidth/2);
              console.log(`plotting ${authorId} at ${scaledLat}, ${scaledLong}`);
              //let userImg = loadImage(userMap[authorId].profile_image_url);
              //let mask = createGraphics(50, 50);
              //mask.circle(25, 25, 50);
              //userImg.mask(mask);
              //image(userImg, scaledLat, scaledLong, 50, 50);
              circle(scaledLong, scaledLat, 10);
            }
          }, user);
        }
      })
    });
};