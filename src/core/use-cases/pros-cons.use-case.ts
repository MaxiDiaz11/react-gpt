import type { ProsConsDiscusserResponse } from "../../interfaces";

export const prosConsDiscusserUseCase = async (prompt: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) throw new Error("No se pudo realizar la comparación.");

    const data = (await response.json()) as ProsConsDiscusserResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "No se pudo realizar la petición.",
    };
  }
};
