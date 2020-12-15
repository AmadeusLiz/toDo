import React, { useEffect, useState, useContext }  from "react";
import { StyleSheet, Dimensions, View, StatusBar, Image} from "react-native";
import { Button, Container, Content, H1, Text, Textarea, Spinner, Icon  } from "native-base";
import * as Font from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import { ToDosContext } from "../context/ToDosContext"; // Utilizar el contexto de toDo

const { width, height } = Dimensions.get("window"); //Dimensiones del dispositivo

const ToDoCreateScreen = ({ navigation }) => {
  const [toDo, setToDo] = useState("");
  const [errorToDo, setErrorToDo] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [enableSave, setEnableSave] = useState(true);


  const toDosContext = useContext(ToDosContext);
  const { addNewToDo, refreshToDos } = toDosContext;

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
  }, []);

  // Ejecutar el efecto cuando el valor de toDo cambie
  useEffect(() => {
    if (toDo) setEnableSave(false);
    else setEnableSave(true);
  },[toDo]);

  const handlerNewTodo = async () => {
    // Validar que la tarea tiene valor
    if (toDo) {
      await addNewToDo(toDo, refreshToDos);

      // Regresar a la pantalla anterior
      navigation.goBack();
    } else {
      setErrorToDo(true);
    }
  };

  if (!fontsLoaded)
    return (
      <View style = {styles.loadingContainer}>
        <Image 
          source= {require("../../assets/loading.gif")}
          style= {styles.loadingImage}
        />
      </View>
    );
    
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
      <H1 style={styles.title}>Ingresa un ToDo</H1>
      <Content >
        <Textarea
          rowSpan={23}
          bordered
          placeholder="Escribe algo..."
          value={toDo}
          onChangeText={setToDo}
          style={errorToDo ? styles.inputError : styles.toDo}
        />
        {errorToDo ? (
          <Text style={styles.error}>¡Debes ingresar una tarea por hacer!</Text>
        ) : null}
      </Content>
      <View style={styles.buttonContainer}>
          <Button rounded iconLeft onPress={handlerNewTodo} disabled={enableSave} style={{backgroundColor: "#2c9a8e", }}>
            <Icon name='addfile' type="AntDesign" />
            <Text>    AÑADIR    </Text>
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
    paddingBottom: 40
  }
});

export default ToDoCreateScreen;