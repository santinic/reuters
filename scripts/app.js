"use strict";


angular.module("app", ["GoogleSpreadsheet", "components"])

    /**
     * Main Controller for the app. It just injects GoogleSpreadsheet service as dependency
     * and changes the $scope when the data is available, ala Angular.
     */
    .controller('MainCtrl', function ($scope, googleSpreadsheet) {

        // This would ideally come from the $scope, just mocked here.
        var spreadsheetId = '0AigpENKnUAh7dDEzVDFpSExHcVFOSWY2aUxIWXh4YXc';

        googleSpreadsheet.getTable(spreadsheetId, function(err, table) {
            if(err) {
                alert("Can't fetch Google Spreadsheet API, something is wrong" + err);
                console.error(err);
                return;
            }
            $scope.table = table;
        });
    });