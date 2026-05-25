import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { carregarAgendamentos, removerAgendamento } from '../services/storageService';
import { cancelarNotificacao } from '../services/notificacaoService';

export const SERVICOS = [
  { id: '1', nome: 'Design de Sobrancelha', preco: 'R$ 35,00', icone: '✏️' },
  { id: '2', nome: 'Sobrancelha + Buço', preco: 'R$ 45,00', icone: '✨' },
  { id: '3', nome: 'Henna na Sobrancelha', preco: 'R$ 50,00', icone: '🎨' },
  { id: '4', nome: 'Laminação de Sobrancelha', preco: 'R$ 80,00', icone: '💫' },
  { id: '5', nome: 'Brow Lifting', preco: 'R$ 90,00', icone: '⬆️' },
  { id: '6', nome: 'Micropigmentação', preco: 'R$ 350,00', icone: '💎' },
];

function CardAgendamento({ item, onRemover }) {
  const servico = SERVICOS.find((s) => s.id === item.servicoId) || {};

  function confirmarRemocao() {
    Vibration.vibrate(50); 
    Alert.alert(
      'Remover Agendamento',
      `Remover agendamento de ${item.nomeCliente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => onRemover(item.id, item.notificacaoId),
        },
      ]
    );
  }

  return (
    <View style={styles.card} testID={`card-${item.id}`}>
      <View style={styles.cardIcone}>
        <Text style={styles.iconeServico}>{servico.icone || '📅'}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome}>{item.nomeCliente}</Text>
        <Text style={styles.cardServico}>{servico.nome || item.servico}</Text>
        <Text style={styles.cardHorario}>🕐 {item.horario} — {item.data}</Text>
        <Text style={styles.cardTelefone}>📱 {item.telefone}</Text>
      </View>
      <TouchableOpacity style={styles.btnRemover} onPress={confirmarRemocao} testID={`btn-remover-${item.id}`}>
        <Text style={styles.txtRemover}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [agendamentos, setAgendamentos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    const dados = await carregarAgendamentos();
    const ordenados = dados.sort((a, b) => {
      const dtA = new Date(`${a.data} ${a.horario}`);
      const dtB = new Date(`${b.data} ${b.horario}`);
      return dtA - dtB;
    });
    setAgendamentos(ordenados);
  }

  async function handleRemover(id, notificacaoId) {
    await cancelarNotificacao(notificacaoId);
    const novaLista = await removerAgendamento(id);
    setAgendamentos(novaLista);
  }

  // Cabeçalho da FlatList
  function renderCabecalho() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const agendamentosHoje = agendamentos.filter((a) => a.data === hoje);

    return (
      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoTop}>
          <View>
            <Text style={styles.titulo}>Olá, Bella! 💅</Text>
            <Text style={styles.subtitulo}>
              {agendamentosHoje.length > 0
                ? `${agendamentosHoje.length} agendamento(s) hoje`
                : 'Nenhum agendamento hoje'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnLogout}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.txtLogout}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Atalhos para as outras telas */}
        <View style={styles.atalhos}>
          <TouchableOpacity
            style={styles.btnAtalho}
            onPress={() => navigation.navigate('Agendamento')}
            testID="btn-novo-agendamento"
          >
            <Text style={styles.atalhoIcone}>➕</Text>
            <Text style={styles.atalhoTexto}>Novo{'\n'}Agendamento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnAtalho}
            onPress={() => navigation.navigate('Portfolio')}
            testID="btn-portfolio"
          >
            <Text style={styles.atalhoIcone}>📷</Text>
            <Text style={styles.atalhoTexto}>Portfólio{'\n'}de Trabalhos</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tituloLista}>Todos os Agendamentos</Text>
      </View>
    );
  }

  function renderVazio() {
    return (
      <View style={styles.vazio} testID="lista-vazia">
        <Text style={styles.vazioemoji}>📋</Text>
        <Text style={styles.vazioTexto}>Nenhum agendamento ainda.</Text>
        <Text style={styles.vazioSub}>Toque em "Novo Agendamento" para adicionar!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardAgendamento item={item} onRemover={handleRemover} />
        )}
        ListHeaderComponent={renderCabecalho}
        ListEmptyComponent={renderVazio}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        testID="flatlist-agendamentos"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  lista: {
    paddingBottom: 30,
  },
  cabecalho: {
    backgroundColor: '#C2185B',
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  cabecalhoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitulo: {
    fontSize: 14,
    color: '#FFB6C8',
    marginTop: 2,
  },
  btnLogout: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  txtLogout: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  atalhos: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  btnAtalho: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  atalhoIcone: {
    fontSize: 28,
    marginBottom: 4,
  },
  atalhoTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tituloLista: {
    color: '#FFB6C8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#C2185B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconeServico: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardServico: {
    fontSize: 13,
    color: '#C2185B',
    marginTop: 2,
  },
  cardHorario: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  cardTelefone: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  btnRemover: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtRemover: {
    color: '#C2185B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 60,
  },
  vazioemoji: {
    fontSize: 50,
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
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
