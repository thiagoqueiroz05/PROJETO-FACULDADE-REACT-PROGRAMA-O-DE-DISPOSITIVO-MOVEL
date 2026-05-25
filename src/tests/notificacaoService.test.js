import {
  pedirPermissaoNotificacao,
  agendarNotificacaoLembrete,
  enviarNotificacaoImediata,
  cancelarNotificacao,
} from '../services/notificacaoService';

describe('notificacaoService', () => {

  test('pedirPermissaoNotificacao deve retornar true', async () => {
    const resultado = await pedirPermissaoNotificacao();

    expect(resultado).toBe(true);
  });

  test('agendarNotificacaoLembrete deve retornar null', async () => {
    const resultado = await agendarNotificacaoLembrete(
      'Cliente Teste',
      'Corte',
      new Date()
    );

    expect(resultado).toBe(null);
  });

  test('enviarNotificacaoImediata deve retornar null', async () => {
    const resultado = await enviarNotificacaoImediata(
      'Teste',
      'Mensagem'
    );

    expect(resultado).toBe(null);
  });

  test('cancelarNotificacao deve retornar null', async () => {
    const resultado = await cancelarNotificacao('123');

    expect(resultado).toBe(null);
  });

});