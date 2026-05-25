import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { carregarPortfolio, adicionarFotoPortfolio, removerFotoPortfolio } from '../services/storageService';

const { width } = Dimensions.get('window');
const TAMANHO_FOTO = (width - 48) / 2; // 2 colunas com margem

export default function PortfolioScreen({ navigation }) {
  const [fotos, setFotos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarFotos();
    }, [])
  );

  async function carregarFotos() {
    const dados = await carregarPortfolio();
    setFotos(dados);
  }

  async function tirarFoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É preciso autorizar o acesso à câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      await salvarFoto(resultado.assets[0].uri);
    }
  }

  async function escolherDaGaleria() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É preciso autorizar o acesso à galeria.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      await salvarFoto(resultado.assets[0].uri);
    }
  }

  async function salvarFoto(uri) {
    const novaFoto = {
      id: Date.now().toString(),
      uri,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    const novaLista = await adicionarFotoPortfolio(novaFoto);
    setFotos(novaLista);
  }

  function confirmarRemocao(id) {
    Alert.alert('Remover foto', 'Deseja remover esta foto do portfólio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const novaLista = await removerFotoPortfolio(id);
          setFotos(novaLista);
        },
      },
    ]);
  }

  function handleAdicionarFoto() {
    Alert.alert('Adicionar Foto', 'Como deseja adicionar a foto?', [
      { text: 'Câmera 📷', onPress: tirarFoto },
      { text: 'Galeria 🖼️', onPress: escolherDaGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  function renderFoto({ item }) {
    return (
      <TouchableOpacity
        style={styles.fotoContainer}
        onLongPress={() => confirmarRemocao(item.id)}
        testID={`foto-${item.id}`}
      >
        <Image source={{ uri: item.uri }} style={styles.foto} />
        <View style={styles.fotoInfo}>
          <Text style={styles.fotoData}>{item.data}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function renderCabecalho() {
    return (
      <View style={styles.cabecalhoLista}>
        <Text style={styles.dicaRemover}>Segure uma foto para remover</Text>
        <Text style={styles.totalFotos}>{fotos.length} foto(s) no portfólio</Text>
      </View>
    );
  }

  function renderVazio() {
    return (
      <View style={styles.vazio} testID="portfolio-vazio">
        <Text style={styles.vazioEmoji}>📷</Text>
        <Text style={styles.vazioTexto}>Nenhuma foto ainda</Text>
        <Text style={styles.vazioSub}>
          Adicione fotos dos seus trabalhos para montar seu portfólio!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho fixo */}
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Text style={styles.txtVoltar}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Portfólio de Trabalhos</Text>
        <Text style={styles.subtitulo}>Fotos dos trabalhos realizados</Text>
      </View>

      {/* Grid de fotos em 2 colunas */}
      <FlatList
        data={fotos}
        keyExtractor={(item) => item.id}
        renderItem={renderFoto}
        numColumns={2}
        ListHeaderComponent={fotos.length > 0 ? renderCabecalho : null}
        ListEmptyComponent={renderVazio}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        testID="flatlist-portfolio"
        columnWrapperStyle={styles.coluna}
      />

      {/* Botão flutuante para adicionar foto */}
      <TouchableOpacity
        style={styles.btnAdicionar}
        onPress={handleAdicionarFoto}
        testID="btn-adicionar-foto"
      >
        <Text style={styles.txtBtnAdicionar}>+ Adicionar Foto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  cabecalho: {
    backgroundColor: '#C2185B',
    paddingTop: 55,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  btnVoltar: {
    marginBottom: 12,
  },
  txtVoltar: {
    color: '#FFB6C8',
    fontSize: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitulo: {
    color: '#FFB6C8',
    fontSize: 14,
    marginTop: 4,
  },
  cabecalhoLista: {
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  dicaRemover: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  totalFotos: {
    fontSize: 13,
    color: '#C2185B',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  grid: {
    padding: 16,
    paddingBottom: 100,
  },
  coluna: {
    gap: 12,
    marginBottom: 12,
  },
  fotoContainer: {
    width: TAMANHO_FOTO,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#C2185B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  foto: {
    width: TAMANHO_FOTO,
    height: TAMANHO_FOTO,
  },
  fotoInfo: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  fotoData: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 60,
  },
  vazioEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  vazioTexto: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  vazioSub: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  btnAdicionar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#C2185B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#C2185B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  txtBtnAdicionar: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
