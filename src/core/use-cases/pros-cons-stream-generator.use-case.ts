export async function* prosConsDiscusserStreamGeneratorUseCase(
  prompt: string,
  signal: AbortSignal
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal,
      }
    );

    if (!response.ok) throw new Error("No se pudo realizar la comparación.");

    const reader = response.body?.getReader();
    if (!reader) {
      console.error("No se pudo obtener el reader");
      return null;
    }

    if (!reader) return alert("No se pudo realizar la comparación");

    const decoder = new TextDecoder();
    let message = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });

      message += decodedChunk;
      yield message;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
