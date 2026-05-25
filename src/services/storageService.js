import AsyncStorage from '@react-native-async-storage/async-storage';

export async function salvarAgendamentos(agendamentos) {
  await AsyncStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

export async function carregarAgendamentos() {
  const dados = await AsyncStorage.getItem('agendamentos');
  return dados ? JSON.parse(dados) : [];
}

export async function adicionarAgendamento(agendamento) {
  const lista = await carregarAgendamentos();
  const novaLista = [...lista, agendamento];
  await salvarAgendamentos(novaLista);
  return novaLista;
}

export async function removerAgendamento(id) {
  const lista = await carregarAgendamentos();
  const novaLista = lista.filter((a) => a.id !== id);
  await salvarAgendamentos(novaLista);
  return novaLista;
}

export async function salvarPortfolio(fotos) {
  await AsyncStorage.setItem('portfolio', JSON.stringify(fotos));
}

export async function carregarPortfolio() {
  const dados = await AsyncStorage.getItem('portfolio');
  return dados ? JSON.parse(dados) : [];
}

export async function adicionarFotoPortfolio(foto) {
  const lista = await carregarPortfolio();
  const novaLista = [...lista, foto];
  await salvarPortfolio(novaLista);
  return novaLista;
}

export async function removerFotoPortfolio(id) {
  const lista = await carregarPortfolio();
  const novaLista = lista.filter((f) => f.id !== id);
  await salvarPortfolio(novaLista);
  return novaLista;
}

export async function salvarUsuario(usuario) {
  await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
}

export async function carregarUsuario() {
  const dados = await AsyncStorage.getItem('usuario');
  return dados ? JSON.parse(dados) : null;
}

export async function removerUsuario() {
  await AsyncStorage.removeItem('usuario');
}
