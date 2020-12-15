import React, {useEffect, useRef, useContext } from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, Animated, TextInput } from 'react-native';
import {
  Text,
  H1,
  View,
  Icon,
} from "native-base";
import Svg, {G, Circle} from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

// Utilizar el contexto de toDos
import { ToDosContext } from "../context/ToDosContext";

const { width, height } = Dimensions.get("window"); //Dimensiones del dispositivo

const ToDosProgressScreen = ({ navigation }) => {
  //Obtener total de tareas
  const { totalToDos, completedToDos } = useContext(ToDosContext);

  const data = {
    completedToDos: completedToDos[0].total, //
    radius: 100,
    strokeWidth: 10,
    duration: 900,
    delay: 500,
    color: "#01463f",
    totalToDos: totalToDos[0].total,
  };

  //Inicializacion de variables a utilizar para la animacion del circulo
    const duration = 1000, delay = 500;
    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const AnimatedInput = Animated.createAnimatedComponent(TextInput);
    const halfCircle = data.radius + data.strokeWidth;
    const circleCircumference = 2 * Math.PI * data.radius;
    const circleRef = useRef();
    const inputRef = useRef();
    const animatedValue = useRef(new Animated.Value(0)).current;

    const animation = (toValue) => {
        return Animated.timing(animatedValue, {
            toValue,
            duration,
            delay,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
      animation(data.completedToDos);
      animatedValue.addListener(v => {
        if (circleRef?.current) {
          const maxPercentage = (100 * v.value) / data.totalToDos;
          const strokeDashoffset = circleCircumference - (circleCircumference * maxPercentage) / 100;
          circleRef.current.setNativeProps({
              strokeDashoffset,
          });
        }
        if (inputRef?.current) {
          inputRef.current.setNativeProps({
              text: `${Math.round(v.value)}`,
          });
        }
      })
      return () => {
        animatedValue.removeAllListeners();
      }
    }, [data.totalToDos, data.completedToDos])

  if (!totalToDos || !completedToDos) {
    return (
    <View style = {styles.loadingContainer}>
      <Image 
        source= {require("../../assets/loading.gif")}
        style= {styles.loadingImage}
      />
    </View>
    );
  }    

  return (
    <View style={styles.container}>
      <StatusBar hidden />
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
      <Svg width={data.radius * 2} height={data.radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
            <Circle
              cx='50%'
              cy='50%'
              stroke={data.color}
              strokeWidth={data.strokeWidth}
              r={data.radius}
              fill="transparent"
              strokeOpacity={0.2}
            />
            <AnimatedCircle
              ref={circleRef}
              cx="50%"
              cy="50%"
              stroke={data.color}
              strokeWidth={data.strokeWidth}
              r={data.radius}
              fill="transparent"
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference}
              strokeLinecap="round"
            />
        </G>
      </Svg>
      <AnimatedInput
          ref={inputRef}
          underlineColorAndroid="transparent"
          editable={false}
          defaultValue='0'
          style={styles.circleText}
      />
      <View style={styles.progressData} >
        <H1 style={styles.title}>ESTADÍSTICAS</H1>
        <View style={styles.information}>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailsValues}>{completedToDos[0].total}</Text> 
            <Text style={styles.details}>Completados</Text> 
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailsValues}>{totalToDos[0].total - completedToDos[0].total}</Text> 
            <Text style={styles.details}>Pendientes</Text> 
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailsValues}>{totalToDos[0].total}</Text> 
            <Text style={styles.details}>Total</Text> 
          </View>
        </View> 
        { //mensaje personalizado al final dependiendo del porcentaje de tareas completado
          (data.totalToDos === 0) 
          ? <Text style={styles.message}>No has agregado ningún ToDo, ¡agregalos desde la pantalla principal!</Text>
          : (data.totalToDos === data.completedToDos)
            ?  <Text style={styles.message}>¡Excelente! Has completado el 100% de tus ToDo's</Text>
            : (data.completedToDos >= (data.totalToDos/2))
              ? <Text style={styles.message}>¡Sigue así! Llevas más del 50% de tus ToDo's</Text>
              : <Text style={styles.message}>¡Esfuerzate un poco más para ir completando tus ToDo's! Llevas un {((data.completedToDos*100) / data.totalToDos).toFixed(0)}% completado</Text>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  svg: {
    width: 200,
    height: 200,
  },
  linearGradient: {
    ...StyleSheet.absoluteFill,
    height:height
  },
  circleText: {
    ...StyleSheet.AbsoluteFillObject,
    fontSize: 80,
    color: "black",
    fontWeight: "900",
    textAlign: "center"
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
  information: {
    padding: 10,
    alignItems: "center",
    width: width * 0.9,
    flexDirection: "row"
  },
  title: {
    paddingTop: 40,
    fontSize: 30,
    color: "#01463f",
    textAlign: "center",
    fontWeight: "bold"
  },
  details: {
    textAlign: "center",
    fontSize: 12,
    color: "#01463f",
  },
  detailsValues: {
    textAlign: "center",
    fontSize: 21,
    fontWeight: "bold",
    color: '#01463f'
  },
  message: {
    paddingTop: 30,
    fontSize: 20,
    textAlign: "center",
    color: "#01463f"
  },
  returnIcon: {
    position: "absolute",
    color: "#01463f",
    top: 30,
    left:20,
  },
  logo: {
    width: width,
    height: height * 0.3,
    resizeMode: "contain",
  },
  progressData: {
    width: width * 0.9,
    height: height * 0.3,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  }
});

export default ToDosProgressScreen;