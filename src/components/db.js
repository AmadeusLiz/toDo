import React from "react";
import * as SQLite from "expo-sqlite";

//Crea y abre la base de datos
const db = SQLite.openDatabase("todolist.db");
/* DATOS
    nombre de la base de datos -> todolist
    nombre de la tabla -> todos
    campos -> todo (tarea por hacer, boolean), status (pendiente, finalizada (0,1))
*/
//Funcionalidades de la base de datos

//Obtener las tareas por hacer del usuario
const getToDos = (setToDosFunction) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select * from todos",
      [],
      (_, { rows: { _array } }) => {
        setToDosFunction(_array);
      },
      (_t, error) => {
        console.log("ERROR al momento de obtener las tareas por hacer");
        console.log(error);
      },
      (_t, _success) => {
        console.log("Tareas por hacer obtenidas!");
      }
    );
  });
};

// Obtener la tarea por el id
const getToDoById = (id, setToDoFunction) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select * from todos where id=?",
      [id],
      (_, { rows: { _array } }) => {
        setToDoFunction(_array);
      },
      (_t, error) => {
        console.log("Error al momento de obtener el ToDo por ID");
        console.log(error);
      },
      (_t, _success) => {
        console.log("ToDo por ID obtenido");
      }
    );
  });
};

//Insertar tareas por hacer
const insertToDos = async (toDo, succesFunction) => {
  db.transaction(
    (tx) => {
      //Aqui se envia 0 por defecto en el status, recordemos que si añadimos una tarea pues es porque está pendiente y no finalizada
      tx.executeSql("insert into todos (todo, status) values (?, 0)", [
        toDo
      ]);
    },
    (_t, error) => {
      console.log("ERROR al momento de insertar las tareas por hacer");
      console.log(error);
    },
    (_t, _success) => {
      succesFunction;
    }
  );
};

//Modificar Status
const updateToDoStatus = async (id, status, succesFunction) => {
  db.transaction(
    (tx) => {
      tx.executeSql("update todos set status=? where id=?", [
        status,
        id
      ]);
    },
    (_t, error) => {
      console.log("ERROR al momento de cambiar el estado del ToDo");
      console.log(error);
    },
    (_t, _success) => {
      succesFunction;
    }
  );
};

//Modificar contenido del ToDo
const updateToDoContent = async (id, toDo, succesFunction) => {
  db.transaction(
    (tx) => {
      tx.executeSql("update todos set todo=? where id=?", [
        toDo,
        id
      ]);
    },
    (_t, error) => {
      console.log("ERROR al momento de cambiar el contenido del ToDo");
      console.log(error);
    },
    (_t, _success) => {
      succesFunction;
    }
  );
};

//Borrar toDo
const deleteToDo = async (id, succesFunction) => {
  db.transaction(
    (tx) => {
      tx.executeSql("delete from todos where id=?", [
        id
      ]);
    },
    (_t, error) => {
      console.log("ERROR al momento de eliminar el ToDo");
      console.log(error);
    },
    (_t, _success) => {
      succesFunction;
    }
  );
};

// Borrar la base de datos
const dropDatabaseTableAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("drop table todos");
      },
      (_t, error) => {
        console.log("Error al eliminar la tabla de tareas por hacer");
        reject(error);
      },
      (_t, result) => {
        resolve(result);
      }
    );
  });
};

// Creación de la tabla de tareas por hacer
const setupDatabaseTableAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists todos (id integer primary key autoincrement, todo text not null, status boolean not null);"
        );
      },
      (_t, error) => {
        console.log("Error al momento de crear la tabla");
        console.log(error);
        reject(error);
      },
      (_t, success) => {
        console.log("Tabla creada!");
        resolve(success);
      }
    );
  });
};

// Agrega una tarea por hacer por defecto
const setupToDosAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into todos (todo, status) values (?, 1)", [
          "Bienvenido a ToDo list!"
        ]);
      },
      (_t, error) => {
        console.log("Error al momento de insertar los valores por defecto");
        console.log(error);
        reject(error);
      },
      (_t, success) => {
        resolve(success);
      }
    );
  });
};

//Contar el total de tareas
const getTotalToDos = (setTotalToDos) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select count(*) total from todos",
      [],
      (_, { rows: { _array } }) => {
        setTotalToDos(_array);
      },
      (_t, error) => {
        console.log("ERROR al momento de obtener el total de tareas");
        console.log(error);
      },
      (_t, _success) => {
        console.log("Total de tareas obtenido!");
      }
    );
  });
};

//Contar el total de tareas realizadas
const getCompletedToDos = (setCompletedToDos) => {
  db.transaction((tx) => {
    tx.executeSql(
      "select count(*) total from todos where status=1",
      [],
      (_, { rows: { _array } }) => {
        setCompletedToDos(_array);
      },
      (_t, error) => {
        console.log("ERROR al momento de obtener el total de tareas realizadas");
        console.log(error);
      },
      (_t, _success) => {
        console.log("Total de tareas realizadas obtenido!");
      }
    );
  });
};

export const database = {
  getToDos,
  getToDoById,
  insertToDos,
  dropDatabaseTableAsync,
  setupDatabaseTableAsync,
  setupToDosAsync,
  getTotalToDos,
  getCompletedToDos,
  updateToDoStatus,
  updateToDoContent,
  deleteToDo
};