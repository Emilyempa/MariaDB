import express from 'express';
import router from './routes/user.js';


const PORT = process.env.PORT || 3000;

const app=express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the MariaDB API'
    });
});

app.use('/user', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});