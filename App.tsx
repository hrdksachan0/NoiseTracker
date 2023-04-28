import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { LineChart } from 'react-native-chart-kit';

const noiseThreshold = 50; // default noise threshold

export default function App() {
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [noiseData, setNoiseData] = useState([]);

  useEffect(() => {
    const recording = new Audio.Recording();
    recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    recording.startAsync();

    const interval = setInterval(() => {
      recording.getAveragePowerAsync().then((power) => {
        const db = 20 * Math.log10(Math.abs(power));
        setNoiseLevel(db);
        setNoiseData((prevData) => [...prevData, db]);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      recording.stopAndUnloadAsync();
    };
  }, []);

  const data = {
    labels: Array.from({ length: noiseData.length }, (_, i) => i + 1),
    datasets: [
      {
        data: noiseData,
        color: () => 'rgba(255, 255, 255, 0.7)',
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noise Tracker</Text>
      <Text style={styles.noiseLevel}>{`Noise Level: ${Math.round(noiseLevel)} dB`}</Text>
      <LineChart data={data} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2126',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  noiseLevel: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2126',
  },
});