const express=require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app= express()
const cors = require('cors')
const port= 5000;


app.use(cors())
app.use(express.json())
require('dotenv').config()
console.log(process.env.USER)
console.log(process.env.PASS)


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.hcgdznz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
     const addPostCollection=client.db('webSocialMediaDatabase').collection('addPost')  
     const mydetailsCollection=client.db('webSocialMediaDatabase').collection('myDetails')  
     




     app.post('/addPost', async(req, res)=>{
         const addData=req.body;
         const result=await addPostCollection.insertOne(addData)
         res.send(result)
     })

     app.get('/getPost', async (req, res)=>{
        const filter={}
        const result=await addPostCollection.find(filter).toArray()
        res.send(result)
     })

     app.get('/singlePost/:id', async(req, res)=>{
        const id=req.params.id;
        const filter={_id:ObjectId(id)}
        const result=await addPostCollection.findOne(filter)
        res.send(result)
     })











     

     app.post('/myDetails', async(req, res)=>{
        const myData=req.body
        const result=await mydetailsCollection.insertOne(myData)
        res.send(result)
     })


     app.get('/myDetails', async (req, res)=>{
        const email=req.query.email;
        const filter= {email:email}
        const result=await mydetailsCollection.findOne(filter)
        res.send(result)
     })








     app.patch('/addEdit/:id', async(req, res)=>{
        const id = req.params.id 
        const info = req.body
        console.log(info)
        const filter = {email:id};
       
        const updateDoc = {
          $set:{
            name:info.name,
            university:info.university,
            address:info.address    
          },

        };
        const result = await mydetailsCollection.updateOne(filter, updateDoc)
        res.send(result)
      })


      app.patch('/reactions/:id', async(req, res)=>{
        const id = req.params.id 
        const count = req.body.love
        console.log(count)
        const filter = {_id:ObjectId(id)};
       
        const updateDoc = {
          $set:{
            love:count
             
          },

        };
        const result = await addPostCollection.updateOne(filter, updateDoc)
        res.send(result)
      })













    app.get('/shoting', async (req, res)=>{
      const filter={}
      const result=await addPostCollection.find(filter).sort({love:-1}).limit(3).toArray()
      res.send(result)
    })













    }finally{

    }
}

run().catch(err=>console.log(err))





app.get('/', (req, res)=>{
    res.send(' Brower server is runing brower ')
})
app.listen(port, ()=>{
    console.log(` social server runing ${port} `)
})