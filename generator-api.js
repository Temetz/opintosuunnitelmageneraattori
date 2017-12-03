var apikey = 'cPif3P78Po5lpsspL6s6O10MYQLqwMBb6XO9FPPY';
var apiUrl = 'https://vya57s3ehd.execute-api.eu-west-1.amazonaws.com/prod';

define(function () {
  return { 
    setupData: new Promise(function(resolve, reject){
      $.ajax({
        url: `${apiUrl}/fetchBase`,
        type: 'GET',
        dataType: 'json',
        headers: {
          'x-api-key': apikey
        },
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
          resolve(result)
        },
        error: function (error) {
          reject(error)
        }
      });
    }),
    storeData: function(dataToStore) {
      return new Promise(function(resolve, reject){
        $.ajax({
          url: `${apiUrl}/insertAnswer`,
          type: 'POST',
          headers: {
            'x-api-key': apikey
          },
          data: JSON.stringify(dataToStore),
          dataType: 'json',
          contentType: 'application/json; charset=utf-8', 
        })
        .done(function (result) {
          resolve(result)
        })
        .fail(function (error, foo, bar) {
          reject(error)
        });
      });
    },
  };
});

