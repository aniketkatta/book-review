const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const userRoutes=require('./routes/userRoutes')
const bookRoutes=require('./routes/bookRoutes');
const reviewRoutes=require('./routes/reviewRoutes');
const cookieParser=require('cookie-parser');
dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.get('/', (req, res) => {
    res.send('Book API is running...');
});
  

mongoose.connect(process.env.MONGO_URI).then(()=>console.log('MongoDb connected')
).catch(err=>console.log(err));


app.use('/users',userRoutes);
app.use('/api/books',bookRoutes);
app.use('/api',reviewRoutes)

const PORT= process.env.PORT  || 5000
app.listen(PORT,()=>{
    console.log(`Server running in port 4000`)
})