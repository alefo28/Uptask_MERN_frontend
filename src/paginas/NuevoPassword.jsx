import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const NuevoPassword = () => {
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({});
  const [tokenValido, setTokenValido] = useState(false);
  const [passwordModificado, setPasswordModificado] = useState(false);

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`);
        setTokenValido(true);
      } catch (error) {
        setAlerta({ msg: error.response.data.msg, error: true });
      }
    };
    return () => {
      comprobarToken();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setAlerta({
        msg: "La constraseña debe ser minimo de 6 caracteres",
        error: true,
      });
      return;
    }

    try {
      const url = `/usuarios/olvide-password/${token}`;

      const { data } = await clienteAxios.post(url, { password });
      setAlerta({ msg: data.msg, error: false });
      setPasswordModificado(true);
      setTokenValido(false);
    } catch (error) {
      setAlerta({ msg: error.response.data.msg, error: true });
    }
  };
  const { msg } = alerta;
  return (
    <>
      <h1 className=" text-sky-600 font-black text-6xl capitalize">
        Restablece tu contraseña y no pierdas acceso a tus{" "}
        <span className=" text-slate-700">proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form
          onSubmit={handleSubmit}
          className="my-10 bg-white shadow rounded-lg p-10 "
        >
          <div className="my-5 ">
            <label
              className=" uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu nueva Contraseña "
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value={"Guardar Nueva Contraseña"}
            className=" mb-5 bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}
      {passwordModificado && (
        <>
          <label
            className=" uppercase text-gray-600 text-center block text-xl font-bold"
            htmlFor="password"
          >
            Tu Contraseña ha sido actualizada
          </label>
          <Link
            className="block text-center mt-5 text-slate-500 uppercase text-sm shadow-lg p-3"
            to="/"
          >
            Inicia Sesion
          </Link>
        </>
      )}
    </>
  );
};

export default NuevoPassword;
