import config from "../../dbconfig.js";
import sql from 'mssql';

export default class PeliculasService {
    getAll = async () => {
        console.log('GetAll')
        let allPeliculas = null;
        try {
            let pool = await sql.connect(config);
            let result = await pool.request().query('SELECT * FROM Peliculas');
            allPeliculas = result.recordsets[0];
        } catch (error) {
            console.error("Error en PeliculasService getAll:", error);
        }
        return allPeliculas;
    }
    
    getById = async (id)=> {
        let returnEntity = null;
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
            .input('pId' , sql.Int, id)
            .query(`SELECT * FROM Peliculas WHERE id = @pId`)
            returnEntity = result.recordsets[0][0];
            } catch (error) {
            console.log(error)
        }
        return returnEntity;
    }

    getByDuracion = async (DuracionEnMinutos)=> {
        let returnEntity = null;
        console.log('GetByDuracion')
        try {
            let pool = await sql.connect(config);
            let result = await pool.request()
            .input('pDuracionEnMinutos' , sql.Int, DuracionEnMinutos)
            .query(`SELECT * FROM Peliculas WHERE DuracionEnMinutos >= @pDuracionEnMinutos ORDER BY Nombre`)
            returnEntity = result.recordsets[0];
            } catch (error) {
            console.log(error)
        }
        return returnEntity;
    }

    update = async (id, body) => {
        let rowsAffected = 0;
        console.log('UpdatePelicula')
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()            
                .input('id', sql.Int, body.id)    
                .input('nombre', sql.VarChar, body.nombre)
                .query(`UPDATE Peliculas SET Nombre = @nombre WHERE Id = @id`);
            rowsAffected = result.rowsAffected;
        } catch (e){
            //console.log(e);
            CopiaError(e.toString() + " AT PeliculasService/Update");
        }
        return rowsAffected;
    }

    insert = async (data) => {
        let rowsAffected = 0;
        console.log('CreatePelicula')
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()          
                .input('Nombre', sql.VarChar, data.nombre)
                .input('Sinopsis', sql.VarChar, data.sinopsis)
                .input('DuracionEnMinutos', sql.Int, data.duracion)
                .input('Genero', sql.VarChar, data.genero)
                .input('Director', sql.VarChar, data.director)
                .input('FechaEstreno', sql.DateTime, data.fechaEstreno)
                .query(`INSERT INTO Peliculas(Nombre, Sinopsis, DuracionEnMinutos, Genero, Director, FechaEstreno) VALUES (@Nombre,@Sinopsis,@DuracionEnMinutos,@Genero,@Director,@FechaEstreno)`);
            rowsAffected = result.rowsAffected;
        } catch (e){
            CopiaError(e.toString() + " AT PeliculasService/Create");
        }
        return rowsAffected;
    }

    delete = async (id) => {
        let rowsAffected = 0;
        console.log('Delete')
        try{
            let pool = await sql.connect(config);
            let result = await pool.request()            
                .input('id', sql.Int, id)    
                .query(`DELETE FROM Peliculas WHERE Id = @id`);
                rowsAffected = result.rowsAffected;
        } catch (e){
            CopiaError(e.toString() + " AT PeliculasService/Delete");
        }
        return rowsAffected;
    }
}
