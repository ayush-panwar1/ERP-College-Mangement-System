async function logout() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      return data.message || "Logout failed";
    }
    return true;
  } catch (err) {
    return err.message;
  }
}

export default logout;
