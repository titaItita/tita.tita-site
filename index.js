import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';
import {registerValidation} from './validations/auth.js';
import UserModel from "./models/User.js";

//подключаем бд с логином и паролем к blog - он авытоматически создастся
mongoose
    .connect('mongodb+srv://moriartynosok:ejXUIG3w@cluster0.anzyojj.mongodb.net/blog')
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err));

const app = express();
//чтобы использовать json = получать логин и пароль = читать json запросы
app.use(express.json());



//если придет get запрос на главный путь то мы выполняем команду которая вернет 2 параметра 
//reg - то что прислал пклоиент res - то что мы передаем клиенту
app.get('/',(reg,res) => {
    res.send('Hello word!1!!!!');
} );

//авторизация 
//будем отлавливать пост запрос по адресу '/auth/login'
//когда он придет мы вытаскиваем запрос и ответ и вернем res в формате json


//здесь обязательно пометка async 
app.post('/auth/register',registerValidation,async (req,res)=>{
    try{ const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        //шифрование пароля salt - алгоритм шифрования
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);
        
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,  // Исправлено: было 'req.body,passwordHash', исправлено на 'passwordHash'
        });

        //сохраняем в mongodb   

        const user = await doc.save();
        
        //создаем токен с зашиврованной инйформацией о 1 - id пользователя, 2 - ключ, 3 - срок жизни 
        const token = jwt.sign({
            _id: user._id,
        },'secret123', {
            expiresIn: '30d'});
        const {passwordHash, ... userData} = user._doc;
        
        res.json({
            ... userData,
            token,
        });
    } catch(err) {
        //можно вывести только один ответ
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        });
    }
});


   // console.log(req.body);
//используем jwt для генерации токена 
//шифруем переданные нам данные c ключом secret123
//const token = jwt.sign({
  //  email: req.body.email,
   // fullName: 'Вася Пупкин',
//}, 'secret123');
  //  res.json({
    //    success: true,
      //  token,
    //});
// });
//запускаем вебсервер
//указываем порт приложения и передаем функцию в этой ф объясняем что если наш сервер не смог запуститься то мы вернем сообщение об этом
//иначе - сервер ок


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');

}); 
