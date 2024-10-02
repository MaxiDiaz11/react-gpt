export async function* translateTextUseCase(
  prompt: string,
  lang: string,
  signal: AbortSignal
) {
  try {
    const response = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, lang }),
      signal,
    });

    if (!response.ok) throw new Error("No se pudo realizar la traducción.");

    const reader = response.body?.getReader();
    if (!reader) {
      console.error("No se pudo obtener el reader");
      return null;
    }

    if (!reader) return alert("No se pudo realizar la traducción");

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
