import type { OrtographyResponse } from "../../interfaces";

export const ortographyUseCase = async (prompt: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/ortography-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) throw new Error("No se pudo realizar la corrección.");

    const data = (await response.json()) as OrtographyResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: "No se pudo realizar la petición.",
    };
  }
};
