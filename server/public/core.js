var app = angular.module('PictureSaver', []);

app.factory('apiService', function($http, $q) {
	return {
		getAllPictures:function(){
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: '/pictures/'
			}).success(function (response) {
				deferred.resolve(response);
			}).error(function (response) {
				deferred.reject(response);
			});
			return deferred.promise;
		},
		deletePicture:function(id){
			var deferred = $q.defer();
			$http({
				method: 'DELETE',
				url: `/picture/${id}`
			}).success(function (response) {
				deferred.resolve(response);
			}).error(function (response) {
				deferred.reject(response);
			});
			return deferred.promise;
		},
		getPictureByCategory:function(category){
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: `/pictures/${category}`,
			}).success(function (response) {
				deferred.resolve(response);
			}).error(function (response) {
				deferred.reject(response);
			});
			return deferred.promise;
		},
		getAllCategories:function(){
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: '/categories/'
			}).success(function (response) {
				deferred.resolve(response);
			}).error(function (response) {
				deferred.reject(response);
			});
			return deferred.promise;
		},
		postPicture:function(data){
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: '/picture/',
				data
			}).success(function (response) {
				deferred.resolve(response);
			}).error(function (response) {
				deferred.reject(response);
			});
			return deferred.promise;
		}
	};
})

app.controller('mainController', function($scope, $http, apiService) {
	$scope.newPicture = function(){
		apiService.postPicture({
			URL:$scope.pictureURL,
			category:$scope.pictureCategory,
			description:$scope.pictureDescription
		})
		.then(function(response){
			$scope.$broadcast ('getPictures', $scope.pictureCategory);
		},function(error){
			console.log(error);
		});
	};
	$scope.$on('getPictures', function(e, category) {  
		$scope.pictureCategory = category;
    });
});

app.controller('categorySelector', function($scope, $rootScope, $http, apiService) {
	$scope.retrieveCategories = function(){
		apiService.getAllCategories()
		.then(function(response){
			console.log(response.results)
			$scope.categories = response.results;
		},function(error){
			console.log(error);
		});
	};
	$scope.clickedCategory = function(category){
		$rootScope.$broadcast ('getPictures', category);
	};
	$scope.$on('getPictures', function(e) {  
		$scope.retrieveCategories();
    });
});

app.controller('pictureViewer', function($scope, $rootScope, $http, apiService) {
	$scope.retrievePictures = function(category){
		if(category == null){
			apiService.getAllPictures()
			.then(function(response){
				$scope.pictures = response.pictures;
			},function(error){
				console.log(error);
			});
		}else{
			console.log("BY CATEGORY")
			apiService.getPictureByCategory(category)
			.then(function(response){
				console.log(response);
				$scope.pictures = response.pictures;
			},function(error){
				console.log(error);
			});
		}
	}
	$scope.deleteThePicture = function(id){
		console.log("Deleting picture")
		apiService.deletePicture(id)
		.then(function(response){
			$rootScope.$broadcast ('getPictures', response.picture.category);
		},function(error){
			console.log(error);
		});
	};
    $scope.$on('getPictures', function(e, category) {  
		$scope.retrievePictures(category);
    });
});