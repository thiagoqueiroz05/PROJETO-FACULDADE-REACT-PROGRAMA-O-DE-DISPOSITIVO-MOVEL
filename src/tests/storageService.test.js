import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  salvarAgendamentos,
  carregarAgendamentos,
  adicionarAgendamento,
  removerAgendamento,
  salvarPortfolio,
  carregarPortfolio,
  adicionarFotoPortfolio,
  removerFotoPortfolio,
  salvarUsuario,
  carregarUsuario,
  removerUsuario,
} from '../services/storageService';

beforeEach(() => {
  AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('storageService - Agendamentos', () => {

  test('carregarAgendamentos deve retornar lista vazia se não houver dados', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const resultado = await carregarAgendamentos();
    expect(resultado).toEqual([]);
  });

  test('salvarAgendamentos deve chamar setItem com os dados corretos', async () => {
    const agendamentos = [{ id: '1', nomeCliente: 'Ana', horario: '10:00' }];
    await salvarAgendamentos(agendamentos);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'agendamentos',
      JSON.stringify(agendamentos)
    );
  });

  test('adicionarAgendamento deve adicionar item à lista existente', async () => {
    const listaInicial = [{ id: '1', nomeCliente: 'Ana' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(listaInicial));

    const novoItem = { id: '2', nomeCliente: 'Bia' };
    const resultado = await adicionarAgendamento(novoItem);

    expect(resultado).toHaveLength(2);
    expect(resultado[1].nomeCliente).toBe('Bia');
  });

  test('removerAgendamento deve remover o item pelo id', async () => {
    const lista = [
      { id: '1', nomeCliente: 'Ana' },
      { id: '2', nomeCliente: 'Bia' },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(lista));

    const resultado = await removerAgendamento('1');

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nomeCliente).toBe('Bia');
  });

  test('carregarAgendamentos deve retornar os dados salvos', async () => {
    const agendamentos = [{ id: '1', nomeCliente: 'Carol', horario: '14:00' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(agendamentos));

    const resultado = await carregarAgendamentos();
    expect(resultado).toEqual(agendamentos);
  });

});

describe('storageService - Portfólio', () => {

  test('carregarPortfolio deve retornar lista vazia se não houver dados', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const resultado = await carregarPortfolio();
    expect(resultado).toEqual([]);
  });

  test('adicionarFotoPortfolio deve adicionar foto à lista', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const foto = { id: '1', uri: 'file://foto.jpg', data: '18/05/2025' };
    const resultado = await adicionarFotoPortfolio(foto);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].uri).toBe('file://foto.jpg');
  });

  test('removerFotoPortfolio deve remover foto pelo id', async () => {
    const lista = [
      { id: '1', uri: 'file://foto1.jpg' },
      { id: '2', uri: 'file://foto2.jpg' },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(lista));

    const resultado = await removerFotoPortfolio('1');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('2');
  });

  test('salvarPortfolio deve chamar setItem com chave correta', async () => {
    const fotos = [{ id: '1', uri: 'file://foto.jpg' }];
    await salvarPortfolio(fotos);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('portfolio', JSON.stringify(fotos));
  });

});

describe('storageService - Usuário', () => {

  test('carregarUsuario deve retornar null se não houver dados', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const resultado = await carregarUsuario();
    expect(resultado).toBeNull();
  });

  test('salvarUsuario deve persistir os dados do usuário', async () => {
    const usuario = { login: 'admin', senha: 'hash123' };
    await salvarUsuario(usuario);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('usuario', JSON.stringify(usuario));
  });

  test('carregarUsuario deve retornar os dados salvos', async () => {
    const usuario = { login: 'admin', senha: 'hash123' };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(usuario));

    const resultado = await carregarUsuario();
    expect(resultado).toEqual(usuario);
  });

  test('removerUsuario deve chamar removeItem com a chave correta', async () => {
    await removerUsuario();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('usuario');
  });

});
