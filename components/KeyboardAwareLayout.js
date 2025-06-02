import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const KeyboardAwareLayout = ({
  children,
  style,
  contentContainerStyle,
  keyboardPadding = 0,
  keyboardOpen = false,
  numericKeyboard = false,
}) => {
  // Si es teclado numérico, resta más (ajusta el valor según tu prueba)
  const RESTA = numericKeyboard ? 60 : 20;
  const adjustedPadding = keyboardOpen ? Math.max(keyboardPadding - 60, 0) : 0;

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -48} // Ajusta este valor según tu prueba
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingBottom: adjustedPadding,
            },
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAwareLayout;