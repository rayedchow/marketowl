export async function getListings() {
  const response = await fetch("http://localhost:8000/api/listings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
}
