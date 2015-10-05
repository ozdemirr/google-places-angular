var app = angular.module('geoparser', ['ui.bootstrap',
    'index',
    'shared',
    'cgNotify',
    'angular-loading-bar',
    'ngAnimate',
    'uiGmapgoogle-maps',
    'nemLogging',
    'ngSanitize',
    'ngCsv'
]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.apiKey = "AIzaSyC6iH2OqL_GPAHCbeTEzwBg-NxMtQ_3JFs";
}]);

app.directive('fileChange',['$parse', function($parse){
    return{
        require:'ngModel',
        restrict:'A',
        link:function($scope,element,attrs,ngModel){
            var attrHandler=$parse(attrs['fileChange']);
            var handler=function(e){
                $scope.$apply(function(){
                    attrHandler($scope,{$event:e,files:e.target.files});
                });
            };
            element[0].addEventListener('change',handler,false);
        }
    }
}]);

app.filter('csvToObj',function(){
    return function(input){
        var rows=input.split('\n');
        var obj=[];
        angular.forEach(rows,function(val){
            if(val != "") {
                obj.push({
                    "adres":val
                });
            }

    });
    return obj;
};
});