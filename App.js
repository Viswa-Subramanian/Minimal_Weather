import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, ScrollView, Dimensions } from "react-native";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
// if(daily?.weather[0].main=="coludy")
const backgrounds = ["#00b894", "#00cec9"];

const Container = styled(View)`
  flex: 1;
  background-color: ${backgrounds[Math.floor(Math.random() * backgrounds.length)]};
`;

const TopContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const City = styled(Text)`
  font-size: 25px;
  font-weight: bold;
  color: white;
  margin-top: 7px;
`;

const BottomContainer = styled(ScrollView)`
  flex: 3;
`;

const WeatherContainer = styled(View)`
  justify-content: center;
  align-items: center;
  width: ${width}px;
`;

const WeatherMain = styled(Text)`
  font-size: 50px;
  color: white;
  margin-top: 0px;
  margin-bottom: 2px;
`;

const Temp = styled(Text)`
  font-size: 105px;
  color: white;
  margin-top: 20px;
  font-weight:bold;
`;

export default function App() {
  const key = "ff26d804d0d9d838fc3e57227eed4bcc";
  const [location, setLocation] = useState([]);
  const [daily, setDaily] = useState([]);
  const [error, setError] = useState(null);
  const weatherIcons = {Clear: "day-sunny",Clouds: "cloudy",Rain: "rain",Drizzle: "day-rain",Thunderstorm: "lightning",};

  const handleGetWeather = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return setError("Location access denied");
    } 
    else {
      const {coords: { latitude, longitude },} = await Location.getCurrentPositionAsync({ accuracy: 100});
      const location = await Location.reverseGeocodeAsync({ latitude, longitude });
      const data = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${key}&units=metric`);
      const json = await data.json();
      setLocation(location[0]);
      setDaily(json.daily);
    }
  };

  useEffect(() => {handleGetWeather();}, []);

  return (
    <>
      {error ? (<Text>Allow location access</Text>) : (<>
          <StatusBar/>
          <Container>
            <TopContainer>
              <City>{location?.city}, {location?.district}</City>
            </TopContainer>

            <BottomContainer horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
              {daily?.length === 0 ? (
                <ActivityIndicator size="large" color="white" style={{ width: width, marginBottom: 200 }}></ActivityIndicator>) :
              (
                <>
                  {daily?.length > 0 &&daily?.map((daily, index) => (
                      <WeatherContainer key={index}>
                        <Fontisto name={weatherIcons[daily?.weather[0].main] ? weatherIcons[daily?.weather[0].main] : ""} size={150} color="white"/>
                        <Temp>{Math.ceil(daily?.temp.max)}°C</Temp>
                        <WeatherMain>{daily?.weather[0].main}</WeatherMain>
                      </WeatherContainer>
                    ))}
                </>
              )}
            </BottomContainer>
          </Container>
        </>
      )}
    </>
  );
}
