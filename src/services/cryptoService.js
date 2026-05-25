import * as Crypto from 'expo-crypto';

/**
 * Criptografa uma senha usando SHA-256
 * @param {string} senha - senha em texto puro
 * @returns {Promise<string>} - hash da senha
 */
export async function criptografarSenha(senha) {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    senha
  );
  return hash;
}

/**
 * Compara uma senha digitada com o hash salvo
 * @param {string} senhaDigitada
 * @param {string} hashSalvo
 * @returns {Promise<boolean>}
 */
export async function verificarSenha(senhaDigitada, hashSalvo) {
  const hashDigitada = await criptografarSenha(senhaDigitada);
  return hashDigitada === hashSalvo;
}
