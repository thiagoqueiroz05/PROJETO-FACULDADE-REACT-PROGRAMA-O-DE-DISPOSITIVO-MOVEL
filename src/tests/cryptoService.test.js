import { criptografarSenha, verificarSenha } from '../services/cryptoService';

describe('cryptoService', () => {

  test('deve criptografar uma senha e retornar uma string', async () => {
    const hash = await criptografarSenha('minhasenha');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  test('deve retornar o mesmo hash para a mesma senha', async () => {
    const hash1 = await criptografarSenha('1234');
    const hash2 = await criptografarSenha('1234');
    expect(hash1).toBe(hash2);
  });

  test('deve retornar hashes diferentes para senhas diferentes', async () => {
    const hash1 = await criptografarSenha('senha1');
    const hash2 = await criptografarSenha('senha2');
    expect(hash1).not.toBe(hash2);
  });

  test('verificarSenha deve retornar true quando a senha está correta', async () => {
    const hash = await criptografarSenha('1234');
    const resultado = await verificarSenha('1234', hash);
    expect(resultado).toBe(true);
  });

  test('verificarSenha deve retornar false quando a senha está errada', async () => {
    const hash = await criptografarSenha('senhaCorreta');
    const resultado = await verificarSenha('senhaErrada', hash);
    expect(resultado).toBe(false);
  });

  test('não deve aceitar senha vazia como válida', async () => {
    const hash = await criptografarSenha('senhaReal');
    const resultado = await verificarSenha('', hash);
    expect(resultado).toBe(false);
  });

});
