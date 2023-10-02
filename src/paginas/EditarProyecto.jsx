import { useParams } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import { useEffect } from "react";
import FormularioProyecto from "../components/FormularioProyecto";

const EditarProyecto = () => {
  const params = useParams();
  const { obtenerProyecto, proyecto, cargando, eliminarProyecto } = useProyectos();

  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);
  const { nombre } = proyecto;

  const handleClick = () => {
    if (confirm("¿Deseas Eliminar este Proyecto?")) {
      eliminarProyecto(params.id)
    } 
  };

  //TODO: SPINNER EN CARGANDO
  if (cargando) return "Cargando ...";

  return (
    <>
      <div className="flex justify-between">
        <h1 className=" font-black text-4xl">
          Editar Proyecto: <span className=" text-sky-600">{nombre}</span>
        </h1>
        <div className="flex items-center  text-red-400 hover:text-red-800">
          <button
            className="flex items-center gap-2 uppercase font-bold"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              />
            </svg>

            <p>Eliminar</p>
          </button>
        </div>
      </div>

      <div className=" mt-10 flex justify-center">
        <FormularioProyecto oProyecto />
      </div>
    </>
  );
};

export default EditarProyecto;
