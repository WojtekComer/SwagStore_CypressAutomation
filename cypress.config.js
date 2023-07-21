const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://172.16.2.153:8080/SwagLabs/#/',
    setupNodeEvents(on, config) {
      // implement node event listeners here

      

    },

    hideXHRInCommandLog: true,

    env: {

      swagTesting: {
        username: "standard_user",
        password: "secret_sauce"
      },

    }

  },

});
