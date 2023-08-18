import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PercentageSlider = () => {
  const [percentage, setPercentage] = useState(50); // Initial percentage value

  const handlePercentageChange = (value) => {
    setPercentage(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={percentage === 25 ? styles.activeButton : styles.button}
          onPress={() => handlePercentageChange(25)}
        >
          <Text style={styles.buttonText}>25%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={percentage === 50 ? styles.activeButton : styles.button}
          onPress={() => handlePercentageChange(50)}
        >
          <Text style={styles.buttonText}>50%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={percentage === 75 ? styles.activeButton : styles.button}
          onPress={() => handlePercentageChange(75)}
        >
          <Text style={styles.buttonText}>75%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={percentage === 100 ? styles.activeButton : styles.button}
          onPress={() => handlePercentageChange(100)}
        >
          <Text style={styles.buttonText}>100%</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.percentageText}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#00D600', // Change the color of the active button if needed
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PercentageSlider;
