const  app = require("./src/app")
require.env.config()

app.listen(3000 , () => {
        console.log('Server is running on port 3000');
    });