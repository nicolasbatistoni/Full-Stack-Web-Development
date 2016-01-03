'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            menuFactory.getDishes().query(
              function(response) {
                $scope.dishes = response;
                $scope.showMenu = true;
               },
               function(response) {
                 $scope.message = "Error: "+response.status + " " + response.statusText;
            });


            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['$scope', function($scope) {

            $scope.sendFeedback = function() {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

          $scope.showDish = false;
          $scope.message="Loading ...";
          $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
          .$promise.then(
            function(response){
              $scope.dish = response;
              $scope.showDish = true;
            },
            function(response) {
              $scope.message = "Error: "+response.status + " " + response.statusText;
            }
          );

        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

            $scope.newComment = {rating:5, comment:"", author:"", date:""};

            $scope.submitComment = function () {
              $scope.newComment.date = new Date().toISOString();
              console.log($scope.newComment);
              $scope.dish.comments.push($scope.newComment);

              menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
              $scope.dishCommentForm.$setPristine();
              $scope.newComment = {rating:5, comment:"", author:"", date:""};
            };
        }])

        // implement the IndexController and About Controller here
        .controller('IndexController', ['$scope', '$stateParams', 'menuFactory',
        'corporateFactory', function($scope, $stateParams, menuFactory, corporateFactory) {

          $scope.showDish = false;
          $scope.message="Loading ...";
          $scope.dish = menuFactory.getDishes().get({id:0})
          .$promise.then(
            function(response){
              $scope.dish = response;
              $scope.showDish = true;
            },
            function(response) {
              $scope.message = "Error: "+response.status + " " + response.statusText;
            }
          );

          $scope.showPromotion = false;
          $scope.message = "Loading...";
          $scope.promotion = menuFactory.getPromotions().get({id:0})
          .$promise.then(
            function(response){
              $scope.promotion = response;
              $scope.showPromotion = true;
            },
            function(response) {
              $scope.message = "Error: "+response.status + " " + response.statusText;
            }
          );

          var exChef = corporateFactory.getLeader(3);
          $scope.exChef = exChef;

        }])

        .controller('AboutController', ['$scope', '$stateParams', 'menuFactory',
        'corporateFactory', function($scope, $stateParams, menuFactory, corporateFactory) {

          var leaders = corporateFactory.getLeaders();
          $scope.leaders = leaders;

        }])
;
