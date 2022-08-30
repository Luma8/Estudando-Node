const express = require("express");
const { randomUUID  } = require("crypto")
const fs = require("fs");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionSuccessStatus: 200
}

app.use(express.json());

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "http://localhost:3000");
    app.use(cors());
    next();
})

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err) {
        console.log(err);
    } else {
        products = JSON.parse(data);
    }
});

app.get("/", (request, response) => {
    return response.json({message: 'bem vindo'});
})

app.post("/products", cors(corsOptions), (request, response) => {
    const { name, price } =  request.body;

    const product = {
        name,
        price,
        id: randomUUID(),
    }

    products.push(product)

    productFile();

    return response.json(products);
});

app.get("/products", (request, response) => {
    return response.json(products);
});

app.get("/products/:id", (request, response) => {
    const { id } = request.params;

    const product = products.find(products => products.id === id);
    
    return response.json(product);
})

app.put("/products/:id", (request, response) => {
    const { id } = request.params;
    const { name, price } = request.body;
    
    const productIndex = products.findIndex(products => products.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }

    productFile();
    
    return response.json({message: "produto atualizado"});
})

app.delete("/products/:id", (request, response) => {
    const { id } = request.params;
    
    const productIndex = products.findIndex(products => products.id === id);

    products.splice(productIndex, 1);
    
    productFile()

    return response.json({message: "produto removido"})
})

function productFile() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if(err) console.log(err);
        else console.log("nenhum error, produto inserido");
    });
}

app.listen(3030, () => console.log("servidor na porta 3030"))