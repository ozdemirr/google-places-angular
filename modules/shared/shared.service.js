shared.factory('sharedService', ['$http','$q', '$rootScope', function($http, $q, $rootScope){

    var yql_url = 'https://query.yahooapis.com/v1/public/yql';

    var sharedService = new Object();

    sharedService.googlePlacesApiUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=";

    sharedService.googlePlacesApiKey = "key=" + $rootScope.apiKey;

    sharedService.foursquareClientId = "1IJCIDB0EFOFLF3KS1Z2FHJ5PTLSX3NA5JAYWLQALTX4WUWG";

    sharedService.foursquareClientSecret = "INZR3X0LDNX22B02SOQ0TV2V2K1EZVRL4ZQ4A52TAHARMJZZ";

    sharedService.foursquareApiExploreUrl = "https://api.foursquare.com/v2/venues/search?client_id=" + sharedService.foursquareClientId + "&client_secret=" + sharedService.foursquareClientSecret + "&query=";

    sharedService.foursquareVenueUrl = "https://api.foursquare.com/v2/venues/";

    sharedService.getGeoCode = function(address){

        var endpoint = sharedService.googlePlacesApiUrl + encodeURI(address) + "&" + sharedService.googlePlacesApiKey;

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

    sharedService.getGeoCodeFromFoursquare = function(address){

        var endpoint = sharedService.foursquareApiExploreUrl + address + "&v=20150815&intent=global";

        var deferred = $q.defer();

        $http.get(endpoint)
            .then(function(response) {

                if(response.data.meta.code == 200){
                    deferred.resolve(response.data.response.venues);
                }else{
                    deferred.reject();
                }

            });
        return deferred.promise;

    };

    sharedService.getImageLinkByVenueId = function(venueId){

        var endpoint = sharedService.foursquareVenueUrl + venueId + "/photos?client_id=" + sharedService.foursquareClientId + "&client_secret=" + sharedService.foursquareClientSecret + "&v=20150815";

        var deferred = $q.defer();

        $http.get(endpoint)
            .then(function(response) {

                if(response.data.response.photos.count > 0){
                    deferred.resolve(response.data.response.photos.items);
                }else{
                    deferred.reject();
                }

            });
        return deferred.promise;

    };

    return sharedService;

}]);
