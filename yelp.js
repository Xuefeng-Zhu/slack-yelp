var _ = require('underscore');
var Yelp = require('yelp');

var INVALID_QUERY = 'Invalid query! (i.g. food in Chicago)';
var NO_RESULT_TEMPLATE = _.template('0 result found for your query <%= query %>');
var RESULTS_TEMPLATE = _.template('<%= count %> results found for your query <%= query %>')
var RESULT_TEMPLATE = _.template('<%= name %> at <%= location.display_address %>');

var yelpConfig = {
  consumer_key: 'zrkDj9IweiTg5exgec8BQg',
  consumer_secret: '2aAxxcLoanvcu-kM0bxIRXcJMTw',
  token: 'QWPoFTQfNOQWu-CqP5X8jCOJ7W2njuFq',
  token_secret: 'DupDQ_5lWQ_gPTUytVG5Gucxus0',
};

var yelp = new Yelp(yelpConfig);

module.exports = function(ctx, callback) {
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
            text: RESULT_TEMPLATE(business)
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
