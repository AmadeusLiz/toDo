import React, { useContext, useState, useEffect } from "react";
import { StyleSheet,StatusBar, Dimensions, ScrollView, Image } from "react-native";
import { Container, Content, List, ListItem, Text, Fab, Icon, Body, Right, Button } from "native-base";
import { LinearGradient } from 'expo-linear-gradient';
import CheckBox from '@react-native-community/checkbox';

// Utilizar el contexto de toDos
import { ToDosContext } from "../context/ToDosContext";

const { width, height } = Dimensions.get("window"); //Dimensiones del dispositivo

const ToDosListScreen = ({ navigation }) => {
    const { toDos, updateToDoStatus } = useContext(ToDosContext);

    //manejar estado de fab, y estado del toDo para el checkbox
    const [activeFab, setActiveFab] = useState(false);

    const handlerStatusTodo =  async (id, status) => {
      await updateToDoStatus(id, !status);
    };

   // if (!toDos){
   //   return (<Text>waiting</Text>)
    //}

    return (
      <Container style={styles.container}>
        <StatusBar hidden={true} />
        <LinearGradient
          colors={['#abd7eb', '#f2c947']}
          style={styles.linearGradient}
        />
        <Image
          source={require("../../assets/logoToDoTransparent.png")}
          style={styles.logo}
        />
        <ScrollView style={styles.toDos}>
          <List>
            {toDos
              ? toDos.map((toDo) => (
                  <ListItem
                    key={toDo.id.toString()}
                  >
                    <Body style={{flexDirection: "row"}}>
                      <CheckBox
                        disabled={false}
                        value={toDo.status === 1 ? true : false}
                        onValueChange={()=>(handlerStatusTodo(toDo.id, toDo.status ? 1: 0))}
                        tintColors={{ true: '#01463f', false: '#01463fb' }}
                      />
                      <Text numberOfLines={1}>{toDo.todo}</Text>
                    </Body>
                    <Right>
                      <Icon 
                        name="right"
                        type="AntDesign"
                        style={{color:"#01463f"}}
                        onPress={() =>
                          navigation.navigate("ToDoModify", { id: toDo.id })
                        }
                    />
                    </Right>
                  </ListItem>
                ))
              : null}
          </List>
        </ScrollView> 
        <Fab
          active={activeFab}
          style={{backgroundColor:"#f2c947"}}
          position="bottomRight"
          containerStyle={{ }}
          style={{ backgroundColor: '#01463f' }}
          direction="left"
          onPress={() => setActiveFab(!activeFab)}>
          <Icon name="plus" type="AntDesign" />
          <Button style={{ backgroundColor: '#2c9a8e' }} onPress={() => navigation.navigate("ToDoCreate")}>
            <Icon name="addfile" type="AntDesign" />
          </Button>
          {toDos.length ?
            <Button style={{ backgroundColor: '#2c9a8e' }} onPress={() => navigation.navigate("ToDoProgress")}>
            <Icon name="graph-pie" type="Foundation" />
          </Button>
            : null
          }
        </Fab>
      </Container>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  linearGradient: {
    ...StyleSheet.absoluteFill,
    height:height
  },
  logo: {
    width: width,
    height: height * 0.3,
    resizeMode: "contain",
    position: "absolute",
    top: -70,
  },
  toDos: {
    position:"absolute",
    flex: 1,
    width: width * 0.95,
    height: height * 0.8,
    top: height * 0.12,
    left: 10,
    borderRadius: 50,
    padding:10,
    backgroundColor: "rgba(255,255,255,0.6)"
  },
});

export default ToDosListScreen;
