shared.factory('sharedService', ['$http','$q', '$rootScope', function($http, $q, $rootScope){

    var yql_url = 'https://query.yahooapis.com/v1/public/yql';

    var sharedService = new Object();

    sharedService.apiUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=";

    sharedService.key = "key=" + $rootScope.apiKey;

    sharedService.getGeoCode = function(address){

        var endpoint = sharedService.apiUrl + encodeURI(address) + "&" + sharedService.key;

        var yql = 'http://query.yahooapis.com/v1/public/yql?'
            + 'q=' + encodeURIComponent('select * from json where url=@url')
            + '&url=' + encodeURIComponent(endpoint)
            + '&format=json';

            var deferred = $q.defer();
            $http.get(yql)
                .then(function(response) {

                    if(response.data.query.results.json.status == "OK"){
                        deferred.resolve(response.data.query.results.json.results);
                    }else{
                        deferred.reject();
                    }

                });
            return deferred.promise;
        };

    return sharedService;

}]);
