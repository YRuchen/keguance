// 加密密钥（与后端保持一致）
const ENCRYPTION_KEY = 'observable-core-2025'

/**
 * 解密URL
 * @param {string} encryptedURL - 加密的URL
 * @returns {string} 解密后的URL
 */
export function decrypt(encryptedURL: string): string {
  try {
    // 1. Base64解码
    const encryptedBytes = atob(encryptedURL)

    // 2. 转换为字节数组
    const encryptedArray = new Uint8Array(encryptedBytes.length)
    for (let i = 0; i < encryptedBytes.length; i++) {
      encryptedArray[i] = encryptedBytes.charCodeAt(i)
    }

    // 3. 异或解密
    const keyBytes = new TextEncoder().encode(ENCRYPTION_KEY)
    const decryptedArray = new Uint8Array(encryptedArray.length)

    for (let i = 0; i < encryptedArray.length; i++) {
      decryptedArray[i] = encryptedArray[i] ^ keyBytes[i % keyBytes.length]
    }

    // 4. 转换为字符串
    const decryptedURL = new TextDecoder().decode(decryptedArray)

    return decryptedURL
  } catch (error) {
    console.error('URL解密失败:', error)
    throw new Error('URL解密失败: ' + (error as Error).message)
  }
}
