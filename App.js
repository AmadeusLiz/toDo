import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import { createStackNavigator} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import useDatabase from "./src/hooks/useDatabase";
import { ToDosContextProvider } from "./src/context/ToDosContext";
import ToDosListScreen from "./src/screens/ToDosListScreen";
import ToDoCreateScreen from "./src/screens/ToDoCreateScreen";
import ToDoModifyScreen from "./src/screens/ToDoModifyScreen";
import ToDosProgressScreen from "./src/screens/ToDosProgressScreen";

const Stack = createStackNavigator();

export default function App() {
  // Prevenir que la pantalla de splash se oculte
  SplashScreen.preventAutoHideAsync();

  const isLoadingComplete = useDatabase();

  // // Ocultar la pantalla de splash
  if (isLoadingComplete) SplashScreen.hideAsync();

  return (
    <View style={{flex:1}}>
      <ToDosContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="ToDosList">
            <Stack.Screen name="ToDosList" component={ToDosListScreen} options={{headerShown:false}}/>
            <Stack.Screen name="ToDoCreate" component={ToDoCreateScreen} options={{headerShown:false}}/>
            <Stack.Screen name="ToDoModify" component={ToDoModifyScreen} options={{headerShown:false}}/>
            <Stack.Screen name="ToDoProgress" component={ToDosProgressScreen} options={{headerShown:false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ToDosContextProvider>
    </View>
  );
}