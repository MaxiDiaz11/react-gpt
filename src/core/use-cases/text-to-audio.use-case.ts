export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/text-to-audio`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, voice }),
      }
    );

    if (!response.ok)
      throw new Error("No se pudo realizar la conversión de audio.");

    const data = await response.blob();

    const audioUrl = URL.createObjectURL(data);

    return {
      ok: true,
      audioUrl,
      message: prompt,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "No se pudo realizar la conversión de audio.",
    };
  }
};
