import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { criptografarSenha, verificarSenha } from '../services/cryptoService';
import { salvarUsuario, carregarUsuario } from '../services/storageService';

const LOGIN_PADRAO = 'admin';
const SENHA_PADRAO = '1234';

export default function LoginScreen({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    inicializarUsuario();
  }, []);

  async function inicializarUsuario() {
    const usuario = await carregarUsuario();
    if (!usuario) {
      const hashSenha = await criptografarSenha(SENHA_PADRAO);
      await salvarUsuario({ login: LOGIN_PADRAO, senha: hashSenha });
    }
  }

  async function handleLogin() {
    if (!login.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha login e senha!');
      return;
    }

    setCarregando(true);
    try {
      const usuario = await carregarUsuario();

      if (!usuario || usuario.login !== login.trim()) {
        Alert.alert('Erro', 'Login ou senha incorretos!');
        return;
      }

      const senhaCorreta = await verificarSenha(senha, usuario.senha);
      if (!senhaCorreta) {
        Alert.alert('Erro', 'Login ou senha incorretos!');
        return;
      }

      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Erro', 'Algo deu errado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Text style={styles.emoji}>💅</Text>
        <Text style={styles.titulo}>Salão da Bella</Text>
        <Text style={styles.subtitulo}>Painel da Proprietária</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formulario}>
        <Text style={styles.label}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu login"
          placeholderTextColor="#bbb"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
          testID="input-login"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputSenhaContainer}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Digite sua senha"
            placeholderTextColor="#bbb"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            testID="input-senha"
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.btnOlho}
          >
            <Text style={styles.olhoIcone}>{mostrarSenha ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dica}>Login padrão: admin / Senha: 1234</Text>

        <TouchableOpacity
          style={[styles.btnEntrar, carregando && styles.btnDesabilitado]}
          onPress={handleLogin}
          disabled={carregando}
          testID="btn-entrar"
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.txtBtnEntrar}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#C2185B',
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  formulario: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  inputSenhaContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
  inputSenha: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  btnOlho: {
    paddingHorizontal: 12,
  },
  olhoIcone: {
    fontSize: 18,
  },
  dica: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
  },
  btnEntrar: {
    backgroundColor: '#C2185B',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  btnDesabilitado: {
    opacity: 0.6,
  },
  txtBtnEntrar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
