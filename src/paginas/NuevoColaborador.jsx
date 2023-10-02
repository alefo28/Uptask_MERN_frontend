import { useEffect } from "react";
import FormularioColaborador from "../components/FormularioColaborador";
import useProyectos from "../hooks/useProyectos";
import { Link, useParams } from "react-router-dom";
import Alerta from "../components/Alerta";

const NuevoColaborador = () => {
  const {
    obtenerProyecto,
    proyecto,
    cargando,
    colaborador,
    agregarColaborador,
    alerta,
  } = useProyectos();

  const params = useParams();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  //TODO: SPINNER EN CARGANDO
  /*  if (cargando) return "Cargando..."; */

  if (!proyecto?._id) return <Alerta alerta={alerta} />;
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black ">
          Añadir Colaborador(a) al Proyecto:{" "}
          <span className=" text-sky-600">{proyecto.nombre}</span>
        </h1>

        <Link
          className="flex items-center font-bold text-gray-500 hover:text-black text-xl"
          to={`/proyectos/${proyecto._id}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
          Volver
        </Link>
      </div>

      <div className=" mt-10 flex justify-center ">
        <FormularioColaborador />
      </div>

      {/* TODO: SPINNER EN CARGANDO */}
      {cargando ? (
        <p className=" text-center">Cargando...</p>
      ) : (
        colaborador?._id && (
          <div className="flex justify-center mt-10">
            <div className=" bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
              <h2 className=" text-center mb-10 text-2xl font-bold">
                Resultado:
              </h2>
              <div className="flex justify-between items-center ">
                <p>{colaborador.nombre}</p>
                <button
                  onClick={() =>
                    agregarColaborador({ email: colaborador.email })
                  }
                  type="button"
                  className=" bg-slate-500 hover:bg-black px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                >
                  Agregar al Proyecto
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default NuevoColaborador;
