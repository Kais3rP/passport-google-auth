const session     = require('express-session');
const passport    = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

module.exports = function (app, db){
  
    app.use(session({
          secret: process.env.SESSION_SECRET,
          resave: true,
          saveUninitialized: true,
        }));
        app.use(passport.initialize());
        app.use(passport.session());
      
      

        passport.serializeUser((user, done) => {
          done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            db.collection('socialusers').findOne(
                {id: id},
                (err, doc) => {
                    done(null, doc);
                }
            );
        });

      
      
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            passReqToCallback   : true
          },
                                        
          function(request, accessToken, refreshToken, profile, cb) {  //passport-google wants request parameter
            db.collection('socialusers').findAndModify(
                  {id: profile.id},
                  {},
                  {$setOnInsert:{
                      id: profile.id,
                      name: profile.displayName || 'John Doe',
                      photo: profile.photos[0].value || '',
                      created_on: new Date(),
                      provider: profile.provider || ''
                  },$set:{
                      last_login: new Date()
                  },$inc:{
                      login_count: 1
                  }},
                  {upsert:true, new: true}, //Insert object if not found, Return new object after modify
                  function (err, doc) {
                      console.log(doc);
                      return cb(null, doc.value);
                  }
              );
            }
        ));
  
}