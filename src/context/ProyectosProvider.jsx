import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";

import { useNavigate } from "react-router-dom";

import io from "socket.io-client";
import useAuth from "../hooks/useAuth";

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [colaborador, setColaborador] = useState({});
  const [modalEliminarColaborador, setModalEliminarColaborador] =
    useState(false);
  const [buscador, setBuscador] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    obtenerProyectos();
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  const config = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      return config;
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerProyectos = async () => {
    try {
      const confi = config();
      const { data } = await clienteAxios("/proyectos", confi);

      setProyectos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);
    setTimeout(() => {
      setAlerta({});
    }, 5000);
  };

  const submitProyecto = async (proyecto) => {
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await nuevoProyecto(proyecto);
    }
  };

  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const confi = config();
      const { data } = await clienteAxios(`/proyectos/${id}`, confi);

      setProyecto(data);
      setAlerta({});
    } catch (error) {
      navigate("/proyectos");
      setAlerta({ msg: error.response.data.msg, error: true });
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } finally {
      setCargando(false);
    }
  };

  const editarProyecto = async (proyecto) => {
    try {
      const confi = config();
      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        confi
      );
      //Sincronizar el state
      const ProyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      );

      setProyectos(ProyectosActualizados);

      //Monstrar la Alerta
      setAlerta({ msg: "Proyecto Actualizado Correctamente", error: false });

      //Redireccionar
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const nuevoProyecto = async (proyecto) => {
    try {
      const confi = config();
      const { data } = await clienteAxios.post("/proyectos", proyecto, confi);
      setProyectos([...proyectos, data]);
      setAlerta({ msg: "Proyecto Creado Correctamente", error: false });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarProyecto = async (id) => {
    try {
      const confi = config();
      const { data } = await clienteAxios.delete(`/proyectos/${id}`, confi);

      //sincronizar el state
      const proyectoActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );
      setProyectos(proyectoActualizados);
      setAlerta({ msg: data.msg, error: false });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  };

  const submitTarea = async (tarea) => {
    if (tarea?.id) {
      await editarTarea(tarea);
    } else {
      delete tarea.id; // Elimino el id que viene del estado
      await crearTarea(tarea);
    }
  };

  const handleModalEditarTarea = (tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  const crearTarea = async (tarea) => {
    try {
      const confi = config();
      const { data } = await clienteAxios.post("/tareas", tarea, confi);

      setAlerta({});
      setModalFormularioTarea(false);

      //SOCKET.IO
      socket.emit("nueva tarea", data);
    } catch (error) {
      console.log(error);
    }
  };

  const editarTarea = async (tarea) => {
    try {
      const confi = config();

      const { data } = await clienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        confi
      );

      setAlerta({});
      setModalFormularioTarea(false);

      //socket
      socket.emit("actualizar tarea", data);
    } catch (error) {
      console.log(error);
    }
  };

  const EliminarTarea = async () => {
    try {
      const confi = config();

      const { data } = await clienteAxios.delete(
        `/tareas/${tarea._id}`,

        confi
      );
      setAlerta({ msg: data.msg, error: false });

      setModalEliminarTarea(false);

      //socket
      socket.emit("eliminar tarea", tarea);

      setTarea({});

      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalEliminarTarea = (tarea) => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  };

  const submitColaborador = async (email) => {
    setCargando(true);
    try {
      const confi = config();

      const { data } = await clienteAxios.post(
        "/proyectos/colaboradores",
        { email },
        confi
      );

      setColaborador(data);
      setAlerta({});
    } catch (error) {
      setAlerta({ msg: error.response.data.msg, error: true });
    } finally {
      setCargando(false);
    }
  };

  const agregarColaborador = async (email) => {
    try {
      const confi = config();

      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores/${proyecto._id}`,
        email,
        confi
      );
      setAlerta({ msg: data.msg, error: false });
      setColaborador({});
      setTimeout(() => {
        setAlerta({});
      }, 2000);
    } catch (error) {
      setAlerta({ msg: error.response.data.msg, error: true });
      setTimeout(() => {
        setAlerta({});
      }, 1500);
    }
  };

  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
  };

  const eliminarColaborador = async () => {
    try {
      const confi = config();

      const { data } = await clienteAxios.post(
        `/proyectos/eliminar-colaborador/${proyecto._id}`,
        { id: colaborador._id },
        confi
      );

      const proyectoActualizado = { ...proyecto };
      proyectoActualizado.colaboradores =
        proyectoActualizado.colaboradores.filter(
          (colaboradorState) => colaboradorState._id !== colaborador._id
        );
      setProyecto(proyectoActualizado);

      setAlerta({ msg: data.msg, error: false });
      setColaborador({});
      setModalEliminarColaborador(false);
      setTimeout(() => {
        setAlerta({});
      }, 2000);
    } catch (error) {
      console.log(error.response);
    }
  };

  const completarTarea = async (id) => {
    try {
      const confi = config();

      const { data } = await clienteAxios.post(
        `/tareas/estado/${id}`,
        {},
        confi
      );

      //sockets
      socket.emit("cambiar estado", data);

      setTarea({});
      setAlerta({});
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleBuscador = () => {
    setBuscador(!buscador);
  };

  //socket.io
  const submitTareasProyecto = (tarea) => {
    //Agrega la tarea al State
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
    setProyecto(proyectoActualizado);
  };

  const eliminarTareaProyecto = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      (tareaState) => tareaState._id !== tarea._id
    );
    setProyecto(proyectoActualizado);
  };

  const ActualizarTareaProyecto = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyecto(proyectoActualizado);
  };

  const completarTareaProyecto = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );

    setProyecto(proyectoActualizado);
  };

  const cerrarSesionProyectos = () => {
    setProyecto({});
    setProyectos([]);
    setAlerta({});
  };
  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        obtenerProyectos,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        EliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyecto,
        eliminarTareaProyecto,
        ActualizarTareaProyecto,
        completarTareaProyecto,
        cerrarSesionProyectos,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };
export default ProyectosContext;
