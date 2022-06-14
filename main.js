import { consumerKey, consumerSecret, token, tokenSecret } from process.env;
import p5 from 'p5';


function setup() {
  createCanvas(1000, 600);
  cb.setConsumerKey(consumerKey, consumerSecret);
  cb.setToken(token, tokenSecret);

  const params = {
    q: "power",
    result_type: 'recent',
    count: 100
  };

  cb.__call(
    "search_tweets",
    params,
    function(reply) {
      background(255, 0, 0);
      var statuses = reply.statuses;
      for (var i = 0; i < statuses.length; i++) {
        var tweet = statuses[i];
        if (!tweet.retweeted_status) {
          print(tweet.text);
          //fill('#' + tweet.user.profile_background_color);
          fill(random(255), random(255), random(255));
          noStroke();
          rect(0, i * 20, width, 20);
          fill(0);
          text(tweet.text, 0, i * 20);
        }
      }
      // print the max_id which helps if you want to grab pages of data
      print('max_id: ' + reply.search_metadata.max_id);

    }
  );

}

function draw() {

}