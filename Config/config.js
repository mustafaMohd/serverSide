module.exports = {
    connectionString: "mongodb://localhost/UniversalTestingPortal",
    JWT_SECRET: "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
    ,
    oauth: {
      google: {
        clientID: '',
        clientSecret: '',
      },
      facebook: {
        clientID: '',
        clientSecret: '',
      },
    },
  };
