var admin = require("/MarkLogic/admin.xqy");
var config = admin.getConfiguration();
var dbid = xdmp.database("nodeOpticFunctionalTest");
var modDbId = xdmp.database("nodeOpticFunctionalTestModules");

var cityIndex = admin.databaseRangeElementIndex("string", "", "city", "http://marklogic.com/collation/", fn.false());
var popularityIndex   = admin.databaseRangeElementIndex("int", "", "popularity", "", fn.false());
var distanceIndex   = admin.databaseRangeElementIndex("double", "", "distance", "", fn.false());
var dateIndex = admin.databaseRangeElementIndex("date", "", "date", "", fn.false());
var cityLexicon = admin.databaseElementWordLexicon("", "city", "http://marklogic.com/collation/");
var geoIndex = admin.databaseGeospatialElementIndex("", "latLonPoint", "wgs84", fn.false());
var idIndex   = admin.databaseRangeElementIndex("int", "", "id", "", fn.false());

var cityNameIndex = admin.databaseRangeElementIndex("string", "", "cityName", "http://marklogic.com/collation/", fn.false());
var cityTeamIndex = admin.databaseRangeElementIndex("string", "", "cityTeam", "http://marklogic.com/collation/", fn.false());
var cityPopulationIndex   = admin.databaseRangeElementIndex("long", "", "cityPopulation", "", fn.false());

config = admin.databaseAddRangeElementIndex(config, dbid, cityIndex);
config = admin.databaseAddRangeElementIndex(config, dbid, popularityIndex);
config = admin.databaseAddRangeElementIndex(config, dbid, distanceIndex);
config = admin.databaseAddRangeElementIndex(config, dbid, dateIndex);
config = admin.databaseAddRangeElementIndex(config, dbid, idIndex);

config = admin.databaseAddRangeElementIndex(config, dbid, cityNameIndex);
config = admin.databaseAddRangeElementIndex(config, dbid, cityTeamIndex);
config = admin.databaseAddRangeElementIndex(config, dbid, cityPopulationIndex);

config = admin.databaseAddElementWordLexicon(config, dbid, cityLexicon);
config = admin.databaseAddGeospatialElementIndex(config, dbid, geoIndex);
config = admin.databaseSetTripleIndex(config, dbid, fn.true());
config = admin.databaseSetCollectionLexicon(config, dbid, fn.true());
config = admin.databaseSetUriLexicon(config, dbid, fn.true());

config = admin.databaseSetSchemaDatabase(config, dbid, modDbId);

admin.saveConfiguration(config);
