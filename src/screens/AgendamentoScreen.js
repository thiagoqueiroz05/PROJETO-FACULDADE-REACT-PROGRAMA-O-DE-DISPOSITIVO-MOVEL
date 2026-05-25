import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Vibration,
} from 'react-native';
import { adicionarAgendamento } from '../services/storageService';
import { SERVICOS } from './HomeScreen';

export default function AgendamentoScreen({ navigation }) {
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [salvando, setSalvando] = useState(false);

  function formatarTelefone(texto) {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }

  function formatarData(texto) {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  }

  function formatarHorario(texto) {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    return `${numeros.slice(0, 2)}:${numeros.slice(2, 4)}`;
  }

  function validar() {
    if (!nomeCliente.trim()) { Alert.alert('Atenção', 'Informe o nome da cliente!'); return false; }
    if (!telefone || telefone.length < 14) { Alert.alert('Atenção', 'Informe o telefone completo!'); return false; }
    if (!data || data.length < 10) { Alert.alert('Atenção', 'Informe a data no formato DD/MM/AAAA!'); return false; }
    if (!horario || horario.length < 5) { Alert.alert('Atenção', 'Informe o horário no formato HH:MM!'); return false; }
    if (!servicoSelecionado) { Alert.alert('Atenção', 'Selecione um serviço!'); return false; }
    return true;
  }

async function handleSalvar() {
  if (!validar()) return;

  setSalvando(true);
  Vibration.vibrate([0, 50, 50, 50]);

  try {
    const [dia, mes, ano] = data.split('/');
    const [hora, minuto] = horario.split(':');
    const dataHora = new Date(ano, mes - 1, dia, hora, minuto);

    let notificacaoId = null;

    const novoAgendamento = {
      id: Date.now().toString(),
      nomeCliente: nomeCliente.trim(),
      telefone,
      data,
      horario,
      servicoId: servicoSelecionado,
      notificacaoId,
      criadoEm: new Date().toISOString(),
    };

    await adicionarAgendamento(novoAgendamento);

    Alert.alert(
      '✅ Sucesso!',
      'Agendamento salvo com sucesso!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );

  } catch (error) {
    Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
  } finally {
    setSalvando(false);
  }
}

  function renderServico({ item }) {
    const selecionado = servicoSelecionado === item.id;
    return (
      <TouchableOpacity
        style={[styles.cardServico, selecionado && styles.cardServicoSelecionado]}
        onPress={() => setServicoSelecionado(item.id)}
        testID={`servico-${item.id}`}
      >
        <Text style={styles.servicoIcone}>{item.icone}</Text>
        <Text style={[styles.servicoNome, selecionado && styles.servicoNomeSelecionado]}>
          {item.nome}
        </Text>
        <Text style={[styles.servicoPreco, selecionado && styles.servicoPrecioSelecionado]}>
          {item.preco}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Text style={styles.txtVoltar}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Novo Agendamento</Text>
        <Text style={styles.subtitulo}>Preencha os dados da cliente</Text>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.secaoTitulo}>👤 Dados da Cliente</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da cliente"
          placeholderTextColor="#bbb"
          value={nomeCliente}
          onChangeText={setNomeCliente}
          testID="input-nome"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="(11) 99999-9999"
          placeholderTextColor="#bbb"
          value={telefone}
          onChangeText={(t) => setTelefone(formatarTelefone(t))}
          keyboardType="numeric"
          maxLength={15}
          testID="input-telefone"
        />

        {/* Data e Horário */}
        <Text style={styles.secaoTitulo}>📅 Data e Horário</Text>

        <View style={styles.linhaHorizontal}>
          <View style={styles.metade}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#bbb"
              value={data}
              onChangeText={(t) => setData(formatarData(t))}
              keyboardType="numeric"
              maxLength={10}
              testID="input-data"
            />
          </View>
          <View style={styles.metade}>
            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              placeholderTextColor="#bbb"
              value={horario}
              onChangeText={(t) => setHorario(formatarHorario(t))}
              keyboardType="numeric"
              maxLength={5}
              testID="input-horario"
            />
          </View>
        </View>

        {/* Serviços */}
        <Text style={styles.secaoTitulo}>✨ Escolha o Serviço</Text>
        <FlatList
          data={SERVICOS}
          keyExtractor={(item) => item.id}
          renderItem={renderServico}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.listaServicos}
          testID="flatlist-servicos"
        />

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.btnSalvar, salvando && styles.btnDesabilitado]}
          onPress={handleSalvar}
          disabled={salvando}
          testID="btn-salvar"
        >
          <Text style={styles.txtBtnSalvar}>
            {salvando ? 'Salvando...' : '✅ Salvar Agendamento'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitulo: {
    color: '#FFB6C8',
    fontSize: 14,
    marginTop: 4,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C2185B',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  linhaHorizontal: {
    flexDirection: 'row',
    gap: 12,
  },
  metade: {
    flex: 1,
  },
  listaServicos: {
    marginBottom: 10,
  },
  cardServico: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    width: 130,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardServicoSelecionado: {
    borderColor: '#C2185B',
    backgroundColor: '#FFF0F5',
  },
  servicoIcone: {
    fontSize: 28,
    marginBottom: 6,
  },
  servicoNome: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
  },
  servicoNomeSelecionado: {
    color: '#C2185B',
  },
  servicoPreco: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  servicoPrecioSelecionado: {
    color: '#C2185B',
    fontWeight: '600',
  },
  btnSalvar: {
    backgroundColor: '#C2185B',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  btnDesabilitado: {
    opacity: 0.6,
  },
  txtBtnSalvar: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
