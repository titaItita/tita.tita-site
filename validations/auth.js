import { body } from 'express-validator';
//в валидаторе прописываем условия для всех хранящихся данных
export const registerValidation = [
    body('email','Invalid email format').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({min: 5}),
    body('fullName','Name must be at least 2 characters long').isLength({min: 2}),
    //если придет информация проверить ссылка ли это
    body('avatarUrl','Invalid avatar URL').optional().isURL(),
];

