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
    })
  };
});

