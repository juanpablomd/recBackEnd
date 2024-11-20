//funcion de express para crear rutas y poder exportarlas
import { Router } from "express";
//funcion de node js para leer archivos
import {readFile, writeFile} from 'fs/promises';


//lee y trae el archivo
const fileCotz = await readFile('./data/cotizaciones.json','utf-8')
//Lo convierte en JSON.
const cotzData = JSON.parse(fileCotz)

const router = Router()

//Endpoint lista de todas las cotizaciónes
router.get('/getCotizaciones', (req,res)=>{
    try{
        res.status(200).json(cotzData)
    }catch(error){
        res.status(500).json('Error en el servidor: ' + error.message);
    }
})

//Endpoint lista de nombres todos los dolares
router.get('/getDolares', (req,res)=>{
    try{
        const result = cotzData.map(({ id, nombre }) => ({ id, nombre }));
        if(!result){
            return res.status(404).json({ error: 'Dólar no encontrado' });
        }
        res.status(200).json(result)
    }catch(error){
        res.status(500).json('Error en el servidor: ' + error.message);
    }
})

router.put('/updateCotizacion/:id', async (req,res)=>{
    try{
        const { id } = req.params; // ID del dólar
        const { compra, venta } = req.body; // Nuevos valores
        const dolar = cotzData.find(e => e.id === parseInt(id));

        if (!dolar) {
            return res.status(404).json({ error: 'Dólar no encontrado' });
        }

        if (!compra || !venta || isNaN(compra) || isNaN(venta) || compra <= 0 || venta <= 0) {
            return res.status(400).json({ error: 'Debe proporcionar valores válidos de compra y venta' });
        }
    
        // Agregar valores actuales al historial
        const timestamp = new Date().toISOString();
        dolar.historial.push({
            compra: dolar.compra,
            venta: dolar.venta,
            fecha: timestamp
        });

        dolar.compra = compra;
        dolar.venta = venta;

        // Guardar cambios en el archivo JSON
       await writeFile('./data/cotizaciones.json', JSON.stringify(cotzData, null, 2), 'utf-8');
        res.json({ mensaje: 'Cotización actualizada con éxito', dolar });

    }catch(error){
        res.status(500).json('Error en el servidor: ' + error.message);
    }
})

export default router;
