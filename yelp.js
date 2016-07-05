var _ = require('underscore');
var Yelp = require('yelp');

var INVALID_QUERY = 'Invalid query! (i.g. food in Chicago)';
var NO_RESULT_TEMPLATE = _.template('0 result found for your query <%= query %>');
var RESULTS_TEMPLATE = _.template('<%= count %> results found for your query <%= query %>')


module.exports = function(ctx, callback) {
  var yelpConfig = {
    consumer_key: ctx.data.CONSUMER_KEY,
    consumer_secret: ctx.data.CONSUMER_SECRET,
    token: ctx.data.TOKEN,
    token_secret: ctx.data.TOKEN_SECRET,
  };

  var yelp = new Yelp(yelpConfig);
  var query = ctx.data.text.split('in');

  if (query.length !== 2) {
    return callback(null, {
      text: INVALID_QUERY
    });
  }

  yelp.search({
    term: query[0].trim(),
    location: query[1].trim()
  })
  .then(function(response) {
    var results = response.businesses.map(function(business) {
      return {
        title: business.name,
        pretext: business.is_closed ? 'Closed' : 'Open',
        title_link: business.url,
        thumb_url: business.image_url,
        fields: [
          {
            title: 'Rating',
            value: business.rating,
            short: true
          },
          {
            title: 'Phone',
            value: business.phone,
            short: true
          },
          {
            title: 'Location',
            value: business.location.display_address.join(' ')
          }
        ] 
      };
    });

    if (results.length) {
      callback(null, {
        text: RESULTS_TEMPLATE({ count: results.length, query: ctx.data.text}),
        attachments: results
      });
    } else {
      callback(null, {
        text: NO_RESULT_TEMPLATE({ query: ctx.data.text })
      });
    }
  })
  .catch(function(response) {
    var error = JSON.parse(response.data).error;
    return callback(null, {
        text: error.text
    });
  });

}
