import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const secret = "test";

export const signin = async (req, res) => {
  const { email, password } = req.body; //obtenemos los datos del front end

  try {
    const existingUser = await User.findOne({ email }); //tenemos que buscar en la base de datos si ya existe este usuario y lo encontramos por el email

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" }); //si el usuario no existe mostramos un mensaje

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password); //si el usuario existe en la bse de datos debemos chequear si la contraseñas coniciden

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" }); // si no coicniciden las contraselñas es mostrar un error con un mensaje que es invalida la contraseña

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      {
        // si existe el usuario en la bse de datos y coincide la contraseña podemos obtener el jwt y enviarlo al frontend
        expiresIn: "1h",
      }
    );

    res.status(200).json({ result: existingUser, token }); //y luego enviamos el resultado que es el usuario existente que inicia sesion y el jwt que se creo en el backend
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" }); //si la creacion del token no fue exitosa enviamos un mensaje de error 500 servidor indefinido
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body; //obtenemos estos datos del req.body desestructuramos estos datos que enviamos

  try {
    const existingUser = await User.findOne({ email }); //y hacemos lo mismo que antes buscamos si ya existe el usuario si ya existe no puede crear una nueva cuenta

    if (existingUser)
      //si existe este usuario
      return res.status(400).json({ message: "User already exists" }); //y vamos a mosrar un error 400 con el mensaje de que ese usuario ya existe

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don't match" }); //luego preguntamos si las contraseñas coinciden la principal y la confirmacion y is no es asi mostramos un mensaje
    //si no existe el usuario y las contraseñas conciden estamos listo para crear un nuevo ususario
    //pero antes creamos un hash para guardar la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    //luego podemos crar el usuario nuevo
    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    //luego de crear el usuario creamos el token
    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });
    //luego debemos retornar el usuario nuevo creado con el token
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
