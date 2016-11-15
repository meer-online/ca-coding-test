var titlesController = require('../controllers/TitlesController');

module.exports = function(app){
    app.use('/I/want/title', titlesController);
};