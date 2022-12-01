const express = require('express');
const app = express();

app.get('/', (_, response) => {
    response.send(`<h1>Hello world</h1>`)
})

app.get('/productos', (_, response) => {
    response.send(allTheProducts());
});

app.get('/productosRandom', (_, response) => {
    response.send(productById());
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening in port ${PORT}`))



const fs = require('fs')

class Contenedor {
    constructor(file) {
        this.file = file
    }

    async save(product) {
        const productos = await this.getAll()
        try {
            let idGen
            productos.length === 0
                ? idGen = 1
                : idGen = productos[productos.length - 1].id + 1

            const prodNuevo = { id: idGen, ...product }
            productos.push(prodNuevo)
            await this.saveFile(this.file, productos)
            return idGen

        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    async saveFile(file, productos) {
        try {
            await fs.promises.writeFile(
                file, JSON.stringify(productos, null, 2)
            )
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    async getById(id) {
        const productos = await this.getAll()
        try {
            const prod = productos.find(item => item.id === id)
            return prod ? prod : null

        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    async getAll() {
        try {
            const productos = await fs.promises.readFile(this.file, 'utf-8')
            return JSON.parse(productos)

        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    async deleteById(id) {
        let productos = await this.getAll()

        try {
            productos = productos.filter(item => item.id != id)
            await this.saveFile(this.file, productos)

        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    async deleteAll() {
        await this.saveFile(this.file, [])
    }

}


const productos = new Contenedor('productos.txt')

const allTheProducts = async () => {
    try {

        let array = await productos.getAll()
        console.log("-----Traer todos los productos-----")
        console.log(array)

    } catch (err) {
        console.log(err)
    }
}

const productById = async () => {
    try {
        let array = await productos.getAll()
        const id = Math.floor(Math.random() * (array.length) + 1)
        let idProd = await productos.getById(id)
        console.log(`-----Traer el producto con id = ${id}-----`)
        console.log(idProd)

    } catch (err) {
        console.log(err)
    }
}


