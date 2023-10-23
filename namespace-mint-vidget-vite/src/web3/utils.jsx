
export const toBytes32HexString = (value) => {
  // Ensure the input value is not longer than 32 bytes
  value = value.slice(0, 32);

  // Convert the string to UTF-8 bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  // Create a Uint8Array of 32 bytes and fill it with 0s
  const paddedBytes = new Uint8Array(32);
  
  // Copy the data into the paddedBytes
  paddedBytes.set(data);

  // Convert the Uint8Array to a hexadecimal string
  const bytes32Value = '0x' + Array.from(paddedBytes, byte => byte.toString(16).padStart(2, '0')).join('');

  return bytes32Value;
}