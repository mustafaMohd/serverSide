module.exports = {
    connectionString: "mongodb://localhost/UniversalTestingPortal",
    JWT_SECRET: "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING"
    ,
    oauth: {
      google: {
        clientID: '947457343161-alh7s7kgt8duj7h2ln5fueio6c1fknts.apps.googleusercontent.com',
        clientSecret: 'N9N3e2NKGJhq7Ad4X9MQskoG',
      },
      facebook: {
        clientID: '402019200568297',
        clientSecret: 'dc6f24a69762d2803b065ee1e03fac54',
      },
    },
  };
