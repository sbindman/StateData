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
 * optional parameter to search for a single state
 * /data?state=State_Name
 */
router.get('/data', function(req, res, next) {

    wc = {};
    params = {};

    if (req.query.state) {
        wc = {whereClause :"WHERE name = $1" };
        params = {sqlParams: [req.query.state]}
    }

    // All columns in table with the exception of the geometry column
    var nonGeomColumns = "state_id, indicator_id, indicator_value, indicator_title, name";

    var sql = pg.featureCollectionSQL("full_state_data_info", nonGeomColumns, wc);
    var preparedStatement = {
        name: "get_full_state_data_info",
        text: sql,
        values:[req.query]};

    pg.queryDeferred(preparedStatement, params)
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
router.get('/data/indicator/:indicator_id', function(req, res, next) {
    console.log('get album votes');


    // All columns in table with the exception of the geometry column
    var nonGeomColumns = "state_id, indicator_id, indicator_value, indicator_title, name";

    var wc = {whereClause :"WHERE indicator_id = $1" };

    var sql = pg.featureCollectionSQL("full_state_data_info", nonGeomColumns, wc);
    var preparedStatement = {
        name: "get_full_state_data_info",
        text: sql,
        values:[]};

    pg.queryDeferred(preparedStatement, {sqlParams: [req.params.indicator_id]})
        .then(function(result){
            res.send(JSON.stringify(result[0].response));
        })
        .catch(function(err){
            next(err);
        });

});


/*
 * Get all data for a particular state
 */
router.get('/data/state/:state_id', function(req, res, next) {
    console.log('get album votes');


    // All columns in table with the exception of the geometry column
    var nonGeomColumns = "state_id, indicator_id, indicator_value, indicator_title, name";

    var wc = {whereClause :"WHERE state_id = $1" };


    var sql = pg.featureCollectionSQL("full_state_data_info", nonGeomColumns, wc);
    var preparedStatement = {
        name: "get_one_state_data_info",
        text: sql
    };

    pg.queryDeferred(preparedStatement, {sqlParams: [1]} )
        .then(function(result){
            res.send(JSON.stringify(result[0].response));
        })
        .catch(function(err){
            next(err);
        });

});



///*
// * Get all states data for a particular indicator
// */
//router.get('/indicator-data/:indicator_id', function(req, res, next) {
//    console.log('get album votes');
//
//
//    // All columns in table with the exception of the geometry column
//    var nonGeomColumns = "state_id, indicator_id, indicator_value, indicator_title, name";
//
//    var sql = pg.featureCollectionSQL("full_state_data_info", nonGeomColumns);
//
//    var preparedStatement = {
//        name: "get_full_state_data_info",
//        text: sql,
//        values:[]};
//
//    pg.queryDeferred(preparedStatement)
//        .then(function(result){
//            res.send(JSON.stringify(result[0].response));
//        })
//        .catch(function(err){
//            next(err);
//        });
//
//});



module.exports = router;



