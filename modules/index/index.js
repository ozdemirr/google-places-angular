var index = angular.module('index', []);

index.controller('indexController', ['$scope', 'sharedService', 'notify', '$rootScope', '$location', '$anchorScroll', '$timeout', '$filter', function($scope, sharedService, notify, $rootScope, $location, $anchorScroll,$timeout, $filter){

    $scope.address = new Object();

    $rootScope.tabsData = new Object();

    $scope.getSingleAddress = function(){

        $scope.removeMap();

        $scope.singleResults = new Array();

        sharedService.getGeoCode($scope.address.single).then(function(data){

            if(angular.isArray(data)){
                angular.forEach(data, function(value, key) {
                    $scope.singleResults.push(value);
                });
            }else{
                $scope.singleResults.push(data);
            }

        },function(){
            notify('Sonuc Yok');
        });

    };


    $scope.getMultiplyAddress = function(){

        $scope.multiplyResults = new Array();

        $scope.multiplyAddressesArray = $scope.address.multiply.split(/\n/);

        $scope.multiplyAddressesJsonData = new Array();

        angular.forEach($scope.multiplyAddressesArray, function(value, key) {

            sharedService.getGeoCode(value).then(function(data){

                var result = new Array();

                var resultObject = new Object();

                resultObject.placeName = value;

                if(angular.isArray(data)){

                    angular.forEach(data, function(value, key) {
                        result.push(value);
                        resultObject["a" + key] = value.geometry.location.lat + "," + value.geometry.location.lng
                    });

                }else{
                    result.push(data);
                    resultObject.location = data.geometry.location.lat + "," + data.geometry.location.lng
                }

                $scope.multiplyAddressesJsonData.push(resultObject);

                $scope.multiplyResults.push(result);

            },function(){

            });

        });

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
