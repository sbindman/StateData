var express = require('express');
var router = express.Router();
var pg = require('../pg');

//router.post('/all-songs', function(req,res,next){
//    console.log('post to all-songs');
//
//    var sql = "SELECT * FROM vote_song($1,$2)";
//
//    var preparedStatement = {
//        name: "vote",
//        text: sql,
//        values:[req.body.song, req.body.round]
//    };
//
//
//    pg.queryDeferred(preparedStatement)
//        .then(function(result){
//
//            res.send(JSON.stringify(result[0].vote_song));
//        })
//        .catch(function(err){
//            next(err);
//        });
//
//});

/*
 * Get list of all states
 */
router.get('/states', function(req, res, next) {
    console.log('get all states');


    // All columns in table with the exception of the geometry column
    var nonGeomColumns = "id,name";

    var sql = pg.featureCollectionSQL("state", nonGeomColumns);
    var preparedStatement = {
        name: "get_all_states",
        text: sql,
        values:[]};

    pg.queryDeferred(preparedStatement)
        .then(function(result){
            res.send(JSON.stringify(result[0].response));
        })
        .catch(function(err){
            next(err);
        });


});

/*
 * Get all state data
 */
router.get('/state-data', function(req, res, next) {
    console.log('get album votes');


    // All columns in table with the exception of the geometry column
    var nonGeomColumns = "state_id, indicator_id, indicator_value, indicator_title, name";

    var sql = pg.featureCollectionSQL("full_state_data_info", nonGeomColumns);
    var preparedStatement = {
        name: "get_full_state_data_info",
        text: sql,
        values:[]};

    pg.queryDeferred(preparedStatement)
        .then(function(result){
            res.send(JSON.stringify(result[0].response));
        })
        .catch(function(err){
            next(err);
        });

});


/*
 * Get all state data for a particular indicator
 */
router.get('/state-data/:indicator_id', function(req, res, next) {
    console.log('get album votes');


    // All columns in table with the exception of the geometry column
    var nonGeomColumns = "state_id, indicator_id, indicator_value, indicator_title, name";

    var wc = {whereClause :"WHERE indicator_id = " + req.params.indicator_id };
    //var wc = "WHERE indicator_id = " + req.params.indicator_id;

    var sql = pg.featureCollectionSQL("full_state_data_info", nonGeomColumns, wc);
    var preparedStatement = {
        name: "get_full_state_data_info",
        text: sql,
        values:[]};

    pg.queryDeferred(preparedStatement)
        .then(function(result){
            res.send(JSON.stringify(result[0].response));
        })
        .catch(function(err){
            next(err);
        });

});


/*
 * Get all state data for a particular indicator
 */
router.get('/indicator-data/:indicator_id', function(req, res, next) {
    console.log('get album votes');


    // All columns in table with the exception of the geometry column
    var nonGeomColumns = "state_id, indicator_id, indicator_value, indicator_title, name";

    var sql = pg.featureCollectionSQL("full_state_data_info", nonGeomColumns);

    var preparedStatement = {
        name: "get_full_state_data_info",
        text: sql,
        values:[]};

    pg.queryDeferred(preparedStatement)
        .then(function(result){
            res.send(JSON.stringify(result[0].response));
        })
        .catch(function(err){
            next(err);
        });

});



module.exports = router;



