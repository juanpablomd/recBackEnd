import express from 'express'
import cors from 'cors'
import cotizacionesRouter from './routes/cotizaciones.routes.js'

const app = express()
const port = 3000
app.use(express.json());

app.listen(port, () => {
    console.log(`Servidor levantado en puerto ${port}`)
})

app.use(cors({
    origin: 'http://127.0.0.1:5500'

}))

app.use('/cotz', cotizacionesRouter)