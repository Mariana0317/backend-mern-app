import jwt from "jsonwebtoken";

const secret = "test";

const auth = async (req, res, next) => {
  try {
    //cuando un usuario se loguea o se registra obtiene un token primero debemos controlar sieltoken delusuario es valido
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;//hay dos token uno de google y otro de la cuenta este primero es de google superior a 500

    let decodedData;//esta variable son los datos que queremos conseguir del token

    if (token && isCustomAuth) {//si obtenemso el token y es el nuestro queremos obtener los datos del token
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData.id;//ahora que teneos los datos del usuario almacenamos su id en req.userId que va a ser igual a los datos de este ususrio para nuestro propio usuario no el de google
    } else {
      decodedData = jwt.decode(token);//obteenos los datos del usuario de su cuenta google

      req.userId = decodedData.sub;//para google tambien guardamos los datos sub es el nombre de google para un id especifico para diferenciar a cada usuario
    }

    next();//para pasar al siguiente paso
  } catch (error) {
    console.log(error);
  }
};

export default auth;

//si un usuario quiere dar like lo primero que pasa es que se va al auth middleware este confimra o niega la solicitud, si todo esta correcto puede dar like
//y si confirma la solicitud solo ahi llama al contorlador de like
//y para esto sirve el middleware para controlar si tiene autorizacion el usuario de dat like, delete o editar un post o hacer un post. el middeleware es antes de cada una de estas acciones
//donde usamos el middleware?? pues las routes 