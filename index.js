import 'dotenv/config'
import PeliculasService from './src/services/peliculas-services.js';
import express from "express";

const app  = express(); 
const port = 3000; 
app.use(express.json());

let svc = new PeliculasService();

app.get("/api/peliculas", async (req, res) => {
    try {
        let duracion = req.query.min;
        console.log("La duracion es: ",duracion)
        let peliculas = await svc.getByDuracion(duracion);
        if (peliculas != null && peliculas != undefined) {
            res.status(200).send(peliculas);
        } else {
            res.status(404).send("No se encontraron peliculas con esa duracion");
        }
    } catch (error) {
        res.send("error");
    }
});

app.put('/api/peliculas/', async (req,res) =>{
    let body = req.body;
    let id = body.id;
    let pelicula = await svc.getById(id);
    if (pelicula != null && pelicula != undefined) {
        const rowsAffected = await svc.update(id,body);
        res.status(200).send('Todo OK (200)!: ' + rowsAffected);
    } else {
        res.status(404).send("No se encontro la pelicula");
    }   
})

app.post("/api/peliculas/", async (req, res) => {
    try {
        let data = req.body;
        let rowsAffected = await svc.insert(data);
        if(rowsAffected){
            res.send('Todo OK (200)!: ' + rowsAffected);
        }else{
            res.status(400).send("Error");
        }        
    } catch (error) {
        res.send("error");
    }
});

app.delete("/api/peliculas/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let rowsAffected = await svc.delete(id);
        if(rowsAffected != 0){
            res.send('Peliculas borradas: ' + rowsAffected);
        }else{
            res.status(400).send("No se borraron peliculas");
        }        
    } catch (error) {
        res.send("error");
    }
});

app.listen(port,()=>{
    console.log('listening on port:',port);
})
