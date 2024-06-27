
const ticketsRoutes = require("./tickets")

const constructorMethod = (app) => {
  
  app.use('/tickets',ticketsRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};


module.exports = constructorMethod;