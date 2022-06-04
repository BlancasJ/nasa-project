const API_URL = "v1";

// Load the planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  const planets = await response.json();
  return planets;
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const launches = await response.json();
  return launches.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    const response = await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  
    return response;
  } catch (error) {
    return { ok: false };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    const response = await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });

    return response;
  } catch (error) {
    return { ok: false };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};