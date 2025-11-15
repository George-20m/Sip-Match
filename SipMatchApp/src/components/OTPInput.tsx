import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface OTPInputProps {
  code: string;
  onChangeCode: (code: string) => void;
  editable?: boolean;
}

export default function OTPInput({ code, onChangeCode, editable = true }: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Create 6 individual digits from the code
  const digits = code.split('');
  while (digits.length < 6) {
    digits.push('');
  }

  const handleChangeText = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length === 0) {
      // Handle backspace
      const newCode = digits.map((d, i) => (i === index ? '' : d)).join('');
      onChangeCode(newCode);
      
      // Move to previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (numericText.length === 1) {
      // Handle single digit input
      const newDigits = [...digits];
      newDigits[index] = numericText;
      onChangeCode(newDigits.join(''));
      
      // Move to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // Last digit - blur to hide keyboard
        inputRefs.current[index]?.blur();
      }
    } else if (numericText.length > 1) {
      // Handle paste - fill all boxes
      const pastedDigits = numericText.slice(0, 6).split('');
      const newDigits = [...digits];
      
      for (let i = 0; i < pastedDigits.length && index + i < 6; i++) {
        newDigits[index + i] = pastedDigits[i];
      }
      
      onChangeCode(newDigits.join(''));
      
      // Focus the next empty box or the last box
      const nextEmptyIndex = newDigits.findIndex((d, i) => i > index && !d);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.blur();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      // If current box is empty and backspace is pressed, move to previous box
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.boxContainer,
            focusedIndex === index && editable && styles.boxContainerFocused,
            digit !== '' && styles.boxContainerFilled,
          ]}
        >
          <TextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.input,
              digit !== '' && styles.inputFilled,
            ]}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            editable={editable}
            textAlign="center"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 7,
    marginVertical: 20,
  },
  boxContainer: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  boxContainerFocused: {
    borderColor: '#8B4513',
    backgroundColor: '#FFF8E7',
  },
  boxContainerFilled: {
    backgroundColor: '#FFF8E7',
    borderColor: '#8B4513',
  },
  input: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3E2723',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    includeFontPadding: false,
  },
  inputFilled: {
    color: '#8B4513',
  },
});