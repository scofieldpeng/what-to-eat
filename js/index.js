var app = angular.module("app",[]);
app.controller("indexController",["$window","$scope","selectCache","random",function($window,$scope,selectCache,random){
	if ( !selectCache.isSupport() ) {
		return $window.alert("亲，你的浏览器不支持localStorage离线存储技术，换一个牛逼的浏览器吧：）");
	}
	// 用户的选择列表
	$scope.selectFoods = selectCache.fetch();
	if ($scope.selectFoods.length==0){
		$scope.selectFoods = ["牛肉面","炒饭","饺子","馄饨","烧烤","火锅","方便面","肯德基","麦当劳","喝水也能饱","不吃饿死算了-_-"];
	}
	// 用户新选择
	$scope.newSelect = "";
	$scope.selectNum = 1;
	$scope.randomRes = [];

	$scope.add = function(){
		if($scope.newSelect==""){
			return;
		}
		$scope.selectFoods.push($scope.newSelect);
		selectCache.save($scope.selectFoods);
		$scope.newSelect = "";
	}
	$scope.remove = function(index){
		console.log(index);
		$scope.selectFoods.splice(index,1);
		selectCache.save($scope.selectFoods);	
	}

	// 随机出来结果
	$scope.run = function(){
		if ($scope.selectFoods.length==0){
			$window.alert("先填上你纠结的要吃的,不然神仙都帮不了你!!!!");
			return;
		}
		$scope.randomRes = [];
		var index = 0,
		    copyData = $scope.selectFoods.slice();
		for(var i=0;i<$scope.selectNum;i++){
			index = random(0,copyData.length);
			$scope.randomRes.push(copyData[index]);
			copyData.splice(index,1);
		}
	}

	$scope.closeRes = function(){
		$scope.randomRes = [];
	}
}]);

app.factory("random",["$window",function($window){
	return function(min,max){
		return Math.floor( Math.random()*max + min );
	}
}]);

// service 从localstorage中获取用户的选择
app.factory("selectCache",["$window",function($window){
	return {
		/**
		 * 是否支持localStorage
		 */
		isSupport:function(){
			return typeof $window.Storage == "undefind" ? false : true;
		},
		/**
		 * 保存用户当前选择到localstorage
		 */
		save:function(selectFood){
			if(typeof selectFood != "object"){
				console.log(typeof selectFood);
				return false;
			}

			$window.localStorage.setItem("food-selection",$window.JSON.stringify(selectFood));
		},
		/**
		 * 从localstorage中获取用户选择
		 */
		fetch:function(){
			var selectFoodStr = $window.localStorage.getItem("food-selection");
			if( selectFoodStr==null){
				return [];
			}
			return $window.JSON.parse(selectFoodStr);
		}
	}
}]);