// src/api/FetchStacks.js

export async function fetchStacks() {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/stacks/list`);

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
      error: error.message || "Something went wrong while fetching stacks",
    };
  }
}
