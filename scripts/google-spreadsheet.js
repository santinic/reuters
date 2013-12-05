"use strict";

/**
 * GoogleSpreadsheet service, (ideally) simplifies access Google Spreadsheet API via jsonp
 */
angular.module('GoogleSpreadsheet', [])

    .factory('googleSpreadsheet', function($http) {

        // Ideally this URLs would be more parametrized.
        var CELLS_URL = "http://spreadsheets.google.com/feeds/cells/%s/1/public/values?alt=json-in-script&callback=JSON_CALLBACK";

        /**
         * Fetches the specified spreadsheet and translates the feed into a
         * straightforward JSON object.
         * @param spreadsheetId The unique ID of the spreadsheet
         * @param callback An Angular Promise to the $http request
         */
        this.getTable = function(spreadsheetId, callback) {

            var cellsUrl = CELLS_URL.replace('%s', spreadsheetId);

            $http.jsonp(cellsUrl, {})
                .success(function onCellsFetchSuccess(cellsData, status, headers, config) {
                    var table = translateGoogleFeedToSimpleObject(cellsData);
                    callback(null, table);

                })
                .error(function onCellsFetchError(data, status, headers, config) {
                    callback(data);
                });
        };

        /**
         * Translates crazy Google JSON feed into a simple Object that is easy
         * to render as a table in Angular.
         * @return Object A Table Object or null if an error occurred
         */
        function translateGoogleFeedToSimpleObject(data) {
            if(!data.feed || data.feed.entry.length === 0)
                return null;

            var entries = _.groupBy(data.feed.entry, function(entry) {
                return entry.gs$cell.row;
            });

            var textRows = _.values(entries).map(function(row) {
                return _.values(row).map(function(cells) {
                    var text = cells.content.$t;
                    return {
                        text: text,
                        number: extractNumber(text),
                        numeric: getNumericType(text)
                    }
                });
            });

            var headers = textRows[0];
            if(textRows[1]){
                for(var i=0; i < headers.length; i++) {
                    if(textRows[1][i]) {
                        headers[i].numeric = textRows[1][i].numeric;
                    }
                }
            }

            return {
                headers: headers,
                rows: textRows.slice(1, textRows.length)
            };
        }

        /**
         * Tries to extract a number from this text.
         * @param text
         * @returns {Number}
         */
        function extractNumber(text) {
            var match = text.match(/(\+|-)?[0-9]*\.?[0-9]*%?/g);
            var float = parseFloat(match.join(''));
            if(isNaN(float)) {
                return null;
            }
            else {
                return float;
            }
        }

        /**
         * Returns "false" if the specified text is not a numeric type.
         * Otherwise returns the type of numeric
         * ("false", "numeric", "pos-percentage", "neg-percentage").
         * @param text
         * @returns {string}
         */
        function getNumericType(text) {
            var matches = text.match(/\d/g);
            if (matches != null) {
                if(_.contains(text, '%')) {
                    if(text[0] === '-') {
                        return 'neg-percentage';
                    }
                    else {
                        return 'pos-percentage';
                    }
                }
                else {
                    return 'numeric';
                }
            }
            return "false";
        }

        return this;
    });


