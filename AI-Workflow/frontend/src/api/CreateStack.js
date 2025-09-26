// src/api/CreateStack.js

export async function createStack({ name, description }) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/stacks/create_stack`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, description })
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Server responded with status ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Something went wrong while creating stack",
    };
  }
}
