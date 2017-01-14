Project is live at: https://shourl.herokuapp.com/   

An Express API that converts a URL passed as a query string parameter into a shortened version of the address. Using the new, shortened address will redirect the browser to the address originally provided.

The application consists of two GET routes, one of which handles URL-shortening, whilst the other manages browser redirection. The application interfaces with a single MongoDB collection in order to store URLs with their associated shortened version. API responses are in JSON format, and the application will only accept validly-formatted URLs for shortening.

Note: The live application (linked above) is hosted on Heroku. Please allow a few seconds for the hosting server to wake up when attempting to view it.
