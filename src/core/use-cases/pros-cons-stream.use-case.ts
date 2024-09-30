export const prosConsDiscusserStreamUseCase = async (prompt: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        //TODO: ADD ABORT SIGNAL
      }
    );

    if (!response.ok) throw new Error("No se pudo realizar la comparación.");

    const reader = response.body?.getReader();
    if (!reader) {
      console.error("No se pudo obtener el reader");
      return null;
    }

    return reader;
  } catch (error) {
    console.error(error);
    return null;
  }
};
