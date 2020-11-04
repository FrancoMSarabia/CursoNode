const jwt = require('jsonwebtoken');

//======================
//VERIFICAR TOKEN
//======================
let verificaToken = (req, res,next) =>{

    //Asi obtenemos los headers de la petición
    let token = req.get('token');

    //Verifica el token si es valido
    jwt.verify(token, process.env.SEED, (err, decoded) =>{

        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }


        //Asignamos el usuario que viene del payload del token al request de la petición.
        req.usuario = decoded.usuario;

        //Con este método le decimos que siga ejecutando despues del middleware, si no se le coloca no seguira ejecutando
        next();
    });
};


//======================
//VERIFICA ADMIN ROLE
//======================
let verificaAdminRole = (req,res,next) =>{

    let usuario = req.usuario;
    //let usuario = jwt.decode(req.get('token')); Tambien se puede hacer asi


    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }
    else{

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};

let permisoDeleteCategoria = (req,res,next)=>{

    let usuario = req.usuario;

    if(usuario.email === 'test2@gmail.com'){
        next();
    }
    else{
        return res.json({
            ok: false,
            err: {
                message: 'No cuenta con el permiso para eliminar una categoria'
            }
        });
    }
};


module.exports = {
    verificaToken,
    verificaAdminRole,
    permisoDeleteCategoria
}