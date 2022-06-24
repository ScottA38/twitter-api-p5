import fetch from 'node-fetch';
import _ from 'lodash';
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

const mergeWithCustomizer = (objValue, srcValue) => {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
};

const getData = async (params, keywords, nextToken) => {
  let url = new URL(urlPath, urlBase);
  url.search = "query=" + generateTweetQuery(keywords.split(',')) 
    + '&tweet.fields=entities,geo&expansions=author_id,geo.place_id&user.fields=location,profile_image_url' 
    + '&place.fields=country,full_name,geo,name';

  if(nextToken !== undefined)
    url.search += '&next_token=b26v89c19zqg8o3fpyzniupdzt9rbqm9h8hikdkamwyv1'

  let res = await fetch(url, params);

  return await res.json();
}

export default (keywords) => {
  return new Promise(async (resolve, reject) => {
    let results = {};
    let nextToken = undefined;
    const params = {
      method: 'GET',
      headers: {
        "User-Agent": 'v2TweetLookupJS',
        "Authorization": `Bearer ${process.env.BEARER_TOKEN}`
      },
      mode: 'no-cors'
    };

    while (results.data === undefined || results.data.length < 100) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let json =  await getData(params, keywords, nextToken);
      if (json.status !== undefined && json.status !== 200)
        throw new Error(`Network error: ${json.status} -> ${json.detail}`);
        
      nextToken = json.meta['next_token'];

      results = _.mergeWith(results, json, mergeWithCustomizer);
    }
    
    resolve(results);
  });
}