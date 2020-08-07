const passport = require('passport');

module.exports = function (app, db){
  
  app.route('/auth/google')
          .get(passport.authenticate('google', { scope: 
      [ 'https://www.googleapis.com/auth/plus.login',
      , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }));  //Google wants an options object with a scope property
      
        app.route('/auth/google/callback')
          .get(passport.authenticate('google', { failureRedirect: '/' }), (req,res) => {
              res.redirect('/profile');
          });
      
      
        app.route('/')
          .get((req, res) => {
            res.render(process.cwd() + '/views/pug/index');
          });

        app.route('/profile')
          .get(ensureAuthenticated, (req, res) => {
               res.render(process.cwd() + '/views/pug/profile', {user: req.user});
          });

        app.route('/logout')
          .get((req, res) => {
              req.logout();
              res.redirect('/');
          });

        app.use((req, res, next) => {
          res.status(404)
            .type('text')
            .send('Not Found');
        });
      
      function ensureAuthenticated(req, res, next) {
          if (req.isAuthenticated()) {
              return next();
          }
          res.redirect('/');
        };
  
}