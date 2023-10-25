const express = require('express');
const app = express();

app.get('/products/:productId', function (
    request,
    response
) {
    response.send(
        'productId: ' + request.params['productId']
    );
});

app.listen(3000);
