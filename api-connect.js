import fetch from 'node-fetch';
import 'dotenv/config';

const urlBase = "https://api.twitter.com/";
const urlPath = "/2/tweets/search/recent";

const generateTweetQuery = (keywords) => {
  let query = keywords.reduce((acc, keyword) => {
    if (!acc.length) {
      return `(${keyword}`;
    }
    acc += ` OR ${keyword}`

    return acc;
  }, "");

  return encodeURIComponent((query + ")"));
};

export default async (keywords) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'GET',
      headers: {
        "User-Agent": 'v2TweetLookupJS',
        "Authorization": `Bearer ${process.env.BEARER_TOKEN}`
      },
      mode: 'no-cors'
    };
    let url = new URL(urlPath, urlBase);
    url.search = "query=" + generateTweetQuery(keywords.split(',')) + '&tweet.fields=entities,geo';
    fetch(url, params)
      .then((res) =>  {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        resolve(json);
      });
  });
}