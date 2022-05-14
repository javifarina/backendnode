const express = require('express')
const colors = require('colors')
const Joi = require('@hapi/joi')

const app = express()
app.use(express.json())
//definicion  de Usuarios en Duro Mok de Prueba 
const usuarios =[
    {id:1, nombre:'javier'},
    {id:2, nombre:'keyla'},
    {id:3, nombre:'Veronica'},
    {id:4, nombre:'Izan'},
    {id:5, nombre:'Keren'},
    {id:6, nombre:'Roko'}

]
// Acceso  a HOME de Api-Res Express
app.get('/', (req,res)=>{
    res.send('javier desde Express')
}) //Pedir Datos 
app.get('/api/usuarios', (req, res)=>{
    res.send(usuarios)
})
//http://localhost:5000/api/usuarios/id
app.get('/api/usuarios/:id', (req, res)=>{
    let usuario =  exixteUsuario(req.params.id)
    if (!usuario) res.status(404).send('usuario no fue encontrado')
    res.send(usuario)
})
/*
Envia un usuario para agregar al Arreglo
Validaciones 
    nombre sea distinto de blanco -> !req.body.nombre
    nombre tenga una extención de mas de 2 Caracter -> req.body.nombre.length <= 2
    Peticiones POST
*/ 
app.post('/api/usuarios',(req,res)=>{

   
    const {error, value} = validarUsuario(req.body.nombre)
    if (!error){
        const usuario ={
            id:usuarios.length + 1,
            nombre:value.nombre
        }
        usuarios.push(usuario)
        res.send(usuario)
    }else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
    }
    
   
})

// Metodo de Actualización 
app.put('/api/usuarios/:id', (req, res) =>{
    //encontrar si existe el usuario 
    let usuario = exixteUsuario(req.params.id)
    if (!usuario) {
        res.status(404).send('usuario no fue encontrado')
        return
    }
   //aca 
    const {error,value} =validarUsuario(req.body.nombre)
    if (error){
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
        return
    }
    usuario.nombre=value.nombre
    res.send(usuario)
 })
//delete
app.delete('/api/usuarios/:id', (req, res) =>{
   let usuario = exixteUsuario(req.params.id)
   if (!usuario) {
    res.status(404).send('usuario no fue encontrado')
    return
   
    }
    let index = usuarios.indexOf(usuario)
    usuarios.splice(index,1)
    res.send(usuario)

})
//Constante Puerto
const port = process.env.PORT || 5000
//FUncion para Servidor 
app.listen(port,()=>{
    console.log(`Escuchandoen el Puerto: ${port}..`.bgYellow)
})

// validaciones 

function exixteUsuario (id) {
    return  usuarios.find(u => u.id ===parseInt(id) )
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre:Joi.string().min(3).required()
    })
    return( schema.validate({nombre: nom}))
}