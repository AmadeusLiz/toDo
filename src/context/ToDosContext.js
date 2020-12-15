import React, { useEffect, createContext, useState } from "react";
import { database } from "../components/db";

// Crear el contexto de las tareas por hacer
export const ToDosContext = createContext({});

export const ToDosContextProvider = (props) => {
  // Obtener los valores iniciales para el contexto se obtienen desde los props
  const { toDos: initialToDos, children } = props;

  // Almacenar los valores en el estado
  const [toDos, setToDos] = useState(initialToDos);
  const [toDo, setToDo] = useState(""); //Obtener nota por ID
  const [totalToDos, setTotalToDos] = useState(0); //Obtener total de tareas
  const [completedToDos, setCompletedToDos] = useState(0); //Obtener total de tareas realizadas

  // Cargar u obtener las tareas por hacer
  useEffect(() => {
    refreshToDos();
  }, []);

  const refreshToDos = () => {
    database.getTotalToDos(setTotalToDos); //Obtener total de tareas
    database.getCompletedToDos(setCompletedToDos); //Obtener total de tareas completadas
    return database.getToDos(setToDos);
  };

  const addNewToDo = async (toDo) => {
    await database.insertToDos(toDo, refreshToDos);
    return refreshToDos();
  };

  //Obtener tarea por ID
  const getToDoById = (id) => {
    return database.getToDoById(id, setToDo);
  };

  //Modificar status del ToDo
  const updateToDoStatus = async (id, status) => {
     await database.updateToDoStatus(id, status, refreshToDos);
     return refreshToDos();
  };

  //Modificar contenido del ToDo
  const updateToDoContent = async (id, toDo) => {
    await database.updateToDoContent(id, toDo, refreshToDos);
    return refreshToDos();
  };

  //Borrar toDo
  const deleteToDo = async (id) => {
    await database.deleteToDo(id, refreshToDos);
    return refreshToDos();
  };

  // Crear el objeto de contexto
  const toDosContext = {
    toDos,
    toDo,
    totalToDos,
    completedToDos,
    addNewToDo,
    getToDoById,
    updateToDoStatus,
    updateToDoContent,
    deleteToDo
  };

  // Pasar los valores al proveedor y retornarlo
  return (
    <ToDosContext.Provider value={toDosContext}>
      {children}
    </ToDosContext.Provider>
  );
}