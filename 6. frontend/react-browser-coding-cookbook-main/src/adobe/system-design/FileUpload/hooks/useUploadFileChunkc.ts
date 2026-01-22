const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

export const useChunkFileUpload = (file: File) => {
  const size = file.size;
  const total_chunks = Math.floor(size/CHUNK_SIZE);

  for (let i = 0; i < total_chunks; i++) {
    const chunk = file.slice(
      i * CHUNK_SIZE,
      (i+1) * CHUNK_SIZE
    );
    
  }
}

