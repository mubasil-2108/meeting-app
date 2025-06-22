import { StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import { useAuth } from '../context/AuthContext'
import Spinner from 'react-native-loading-spinner-overlay'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { onLogin, onRegister } = useAuth();

  const onSignInPress = async () => {
    setLoading(true);
    try {
      const response = await onLogin(email, password);
      console.log('Login response:', response);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }

  const onSignUpPress = async () => {
    setLoading(true);
    try {
      const response = await onRegister(email, password);
      console.log('Login response:', response);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* <Spinner visible={loading} /> */}
      <Text variant='headlineMedium' style={styles.header}>Meet Me</Text>
      <Text variant='titleMedium' style={styles.subHeader}>The Fastest way to meet</Text>

      <TextInput
        mode='outlined'
        label='Email'
        placeholder='example@gmail.com'
        value={email}
        onChangeText={(text) => setEmail(text)} />
      <TextInput
        mode='outlined'
        label='Password'
        placeholder='********'
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={(text) => setPassword(text)}
        right={<TextInput.Icon icon="eye" color="#000" onPress={() => setShowPassword(!showPassword)} />}
        style={{ marginTop: 20 }} />

      <Button mode='outlined'
        onPress={() => onSignInPress()}
        loading={loading}
        disabled={loading}
        style={{ marginTop: 20 }}>Sign In</Button>
      <Button mode='contained' onPress={() => onSignUpPress()} style={{ marginTop: 20 }}>Create New Account</Button>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingHorizontal: WIDTH > HEIGHT ? '30%' : 20,
    justifyContent: 'center',
    // alignItems: 'center',

  },
  header: {
    // fontSize: 30,
    // fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    // fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  }
})

export default Page