import React, { useEffect, useState, useContext }  from "react";
import { StyleSheet, Dimensions, View, StatusBar, Image} from "react-native";
import { Button, Container, Content, H1, Text, Textarea, Icon  } from "native-base";
import * as Font from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import { ToDosContext } from "../context/ToDosContext"; // Utilizar el contexto de toDo

const { width, height } = Dimensions.get("window"); //Dimensiones del dispositivo

const ToDoModifyScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [modifyToDo, setModifyToDo] = useState("");
  const [errorToDo, setErrorToDo] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [enableSave, setEnableSave] = useState(true);

  const toDosContext = useContext(ToDosContext);
  const { toDo, updateToDoContent, getToDoById, deleteToDo } = toDosContext;
    let value = true;
   // Cargar la fuente de manera asíncrona
   useEffect(() => {
    const loadFontsAsync = async () => {
      await Font.loadAsync({
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      }).then(() => {
        setFontsLoaded(true);
      });
    };
    loadFontsAsync();
    const getToDo = () => {
        getToDoById(id);
      };
      getToDo();
  }, []);

  useEffect(() => {
    // Verificar si el toDo tiene valor, antes de extraer sus valores
    if (toDo.length) {
      setModifyToDo(toDo[0].todo);
    }
  },[id, toDo]);

    // Ejecutar el efecto cuando el valor de toDo cambie para habilitar/deshabilitar boton
    useEffect(() => {
        if (modifyToDo) setEnableSave(false);
        else setEnableSave(true);
      },[modifyToDo]);
    
  const handlerModifyToDo = async () => {
    // Validar que el toDo tiene valor
    if (modifyToDo) {
      await updateToDoContent(id, modifyToDo);

      // Regresar a la pantalla anterior
      navigation.goBack();
    } else {
      setErrorToDo(true);
    }
  };

  const handlerDeleteToDo = async () => {
    // Validar que el toDo tiene valor
      await deleteToDo(id);

      // Regresar a la pantalla anterior
      navigation.goBack();
  };

  

  if (!toDo || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("../../assets/loading.gif")}
          style={styles.loadingImage}
        />
      </View>
    );
  }
 //*************************************************************************************    
  return (
    <Container style={styles.container}>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={['#abd7eb', '#f2c947']}
        style={styles.linearGradient}
      />     
      <Icon 
        name="left"
        type="AntDesign"
        onPress={() => navigation.goBack()}
        style={styles.returnIcon}
      />
      <Image
        source={require("../../assets/logoToDoTransparent.png")}
        style={styles.logo}
      />
      <H1 style={styles.title}>Modificar ToDo</H1>
      <Content >
        <Textarea
          rowSpan={23}
          bordered
          placeholder="Escribe algo..."
          value={modifyToDo}
          onChangeText={setModifyToDo}
          style={errorToDo ? styles.inputError : styles.toDo}
        />
        {errorToDo ? (
          <Text style={styles.error}>¡Debes ingresar una tarea por hacer!</Text>
        ) : null}
      </Content>
      <View style={styles.buttonContainer}>
          <Button rounded iconLeft disabled={enableSave} style={{backgroundColor: "#2c9a8e", marginRight: 20}} onPress={handlerModifyToDo}>
            <Icon name='addfile' type="AntDesign" />
            <Text>MODIFICAR</Text>
          </Button>
          <Button rounded iconLeft disabled={false} style={{backgroundColor: "#2c9a8e"}} onPress={handlerDeleteToDo}>
            <Icon name='delete' type="AntDesign" />
            <Text>  ELIMINAR  </Text>
          </Button>
        </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 10,
    alignItems: "center",
  },
  error: {
    fontSize: 20,
    color: "red"
  },
  inputError: {
    borderColor: "red",
  },
  returnIcon: {
    position: "absolute",
    color: "#01463f",
    top: 20,
    left:20,
  },
  logo: {
    width: width,
    height: height * 0.3,
    resizeMode: "contain",
    position: "absolute",
    top: -50,
  },
  linearGradient: {
    ...StyleSheet.absoluteFill,
    height:height
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff8cd"
  },
  loadingImage: {
    width: width * 0.70,
    height: height * 0.70,
    resizeMode: "contain"
  },
  toDo: {
    width: width * 0.9,
    borderRadius: 30,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.6)"
  },
  title: {
    paddingTop: height * 0.15,
    fontSize: 30,
    color: "#01463f",
    textAlign: "center",
    fontWeight: "bold"
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row'
  }
});

export default ToDoModifyScreen;