var index = angular.module('index', []);

//this controller is awesome, DONT TRY AT HOME !!!

index.controller('indexController', ['$scope', 'sharedService', 'notify', '$rootScope', '$location', '$anchorScroll', '$timeout', '$filter', '$q', function($scope, sharedService, notify, $rootScope, $location, $anchorScroll,$timeout, $filter,$q){

    $scope.address = new Object();

    $rootScope.tabsData = new Object();

    $scope.getSingleAddress = function(){

        $scope.removeMap();

        $scope.singleResults = new Array();

        $scope.foursquareSingleResults = new Array();

        sharedService.getGeoCode($scope.address.single).then(function(data){

            if(angular.isArray(data)){
                angular.forEach(data, function(value, key) {
                    $scope.singleResults.push(value);
                });
            }else{
                $scope.singleResults.push(data);
            }

        },function(){
            notify('no result');
        });


        sharedService.getGeoCodeFromFoursquare($scope.address.single)
            .then(function(data){

                $scope.foursquareSingleResults = data;

                angular.forEach($scope.foursquareSingleResults, function(value, key) {

                    sharedService.getImageLinkByVenueId(value.id)
                        .then(function(images){

                            $scope.foursquareSingleResults[key].imageLink = images[0].prefix + "300x300" + images[0].suffix;


                    }, function(){

                    })

                });



        }, function(){
                notify('no result');
            })

    };


    $scope.getMultiplyAddress = function(){

        $scope.multiplyResults = new Array();

        $scope.foursquareMultiplyResults = new Array();

        $scope.multiplyAddressesArray = $scope.address.multiply.split(/\n/);

        $scope.multiplyAddressesJsonData = new Array();

        //addresses
        angular.forEach($scope.multiplyAddressesArray, function(value, key) {

            //search on google place api
            sharedService.getGeoCode(value).then(function(data){

                var result = new Array();

                var resultObject = new Object();

                resultObject.placeName = value;

                if(angular.isArray(data)){

                    result = data;

                    resultObject["agoogle_place"] = data[0].geometry.location.lat + "," + data[0].geometry.location.lng;

                }else{

                    result.push(data);

                    resultObject["agoogle_place"] = data.geometry.location.lat + "," + data.geometry.location.lng;

                }

                $scope.multiplyAddressesJsonData[value] = resultObject;

                $scope.multiplyResults.push(result);


            },function(){

            })
                .finally(function() {

                    // search also on foursquare

                    sharedService.getGeoCodeFromFoursquare(value)
                        .then(function(data) {

                            var result = new Array();

                            result = data;

                            if(!angular.isUndefined($scope.multiplyAddressesJsonData[value])) {

                                //that means we had found result on google place

                                $scope.multiplyAddressesJsonData[value].bfoursquare_place = data[0].location.lat + "," + data[0].location.lng;


                            }else{

                                //that means we couldn't find any result on google place

                                var resultObject = new Object();

                                resultObject.placeName = value;

                                resultObject["bfoursquare_place"] = data[0].location.lat + "," + data[0].location.lng;

                                $scope.multiplyAddressesJsonData[value] = resultObject;

                            }

                            angular.forEach(result, function(value, key) {

                                sharedService.getImageLinkByVenueId(value.id)
                                    .then(function(images){

                                        result[key].imageLink = images[0].prefix + "300x300" + images[0].suffix;


                                    }, function(){

                                    })

                            });

                            $scope.foursquareMultiplyResults.push(result);

                        })

            });

        });



    };

    $scope.makeCSV = function(){
        $scope.multiplyDataReady = new Array();

        for (var key in $scope.multiplyAddressesJsonData) {
            $scope.multiplyDataReady.push($scope.multiplyAddressesJsonData[key]);
        }
    };

    $scope.handler=function(e,files){

        $scope.csvAddressesJsonData = new Array();

        $scope.csvResults = new Array();

        var reader=new FileReader();

        reader.onload=function(e){

            var string=reader.result;

            var objArray = $filter('csvToObj')(string);

            angular.forEach(objArray, function(value, key) {

                sharedService.getGeoCode(value.adres).then(function(data){

                    var result = new Array();

                    var resultObject = new Object();

                    resultObject.placeName = value.adres;

                    if(angular.isArray(data)){

                        angular.forEach(data, function(value, key) {

                            result.push(value);

                            resultObject["a" + key] = value.geometry.location.lat + "," + value.geometry.location.lng

                        });

                    }else{

                        result.push(data);

                        resultObject.location = data.geometry.location.lat + "," + data.geometry.location.lng

                    }

                    $scope.csvAddressesJsonData.push(resultObject);

                    $scope.csvResults.push(result);

                },function(){

                });


            });

        };

        reader.readAsText(files[0]);
    };

    $scope.showOnMap = function(lat,lng){
        $scope.removeMap();
        $rootScope.showMap = true;
        $rootScope.map = {
            center: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng)
            },
            zoom: 14
        };
        $rootScope.options = {scrollwheel: false};
        $rootScope.marker = {
            id: 0,
            coords: {
                latitude:parseFloat(lat),
                longitude: parseFloat(lng)
            },
            options: { draggable: false }
        };

        $timeout(function() {
            $location.hash('map_canvas');
            $anchorScroll();
        });

    };

    $scope.removeMap = function(){
        $rootScope.map = null;
        $rootScope.marker = null;
        $rootScope.showMap = false;
    };



}]);
