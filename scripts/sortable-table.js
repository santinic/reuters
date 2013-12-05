"use strict";

/**
 * A reusable data table.
 * This module is not really necessary, but it's here to show that
 * more features could be encapsulated in this "generic" appTable directive.
 */
angular.module('components', [])

    .directive('sortableTable', function() {
        return {

            restrict:"E",
            templateUrl: "partials/sortable-table.html",

            controller: function($scope) {

                $scope.sortedBy = null;
                $scope.sortDirection = false;

                $scope.sortByColumn = function(index) {

                    if(index === $scope.sortedBy) {
                        $scope.sortDirection = !$scope.sortDirection;
                    }
                    else {
                        $scope.sortedBy = index;
                    }

                    var sortedRows = _.sortBy($scope.table.rows, function(row) {
                        if(typeof(row[index].number) == 'number'){
                            return row[index].number;
                        }
                        else {
                            return row[index].text;
                        }
                    });
                    if($scope.sortDirection)
                        sortedRows.reverse();
                    $scope.table.rows = sortedRows;
                }
            }
        };
    });