const list = document.getElementById("matches");
const message = document.getElementById("message");

async function loadMatches() {
  const response = await fetch("/matches");
  const matches = await response.json();

  list.innerHTML = "";
  matches.forEach(match => {
    const item = document.createElement("div");
    item.className = "match";
    item.textContent =
      `ID: ${match.id} | ${match.team1} vs ${match.team2} | ` +
      `${match.runs}/${match.wickets} in ${match.overs} overs`;
    list.appendChild(item);
  });
}

document.getElementById("addForm").addEventListener("submit", async e => {
  e.preventDefault();
  const response = await fetch("/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      team1: document.getElementById("team1").value,
      team2: document.getElementById("team2").value
    })
  });
  const data = await response.json();
  message.textContent = data.message;
  if (response.ok) e.target.reset();
  loadMatches();
});

document.getElementById("scoreForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("id").value;
  const response = await fetch(`/matches/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      runs: Number(document.getElementById("runs").value),
      wickets: Number(document.getElementById("wickets").value),
      overs: Number(document.getElementById("overs").value)
    })
  });
  const data = await response.json();
  message.textContent = data.message;
  if (response.ok) e.target.reset();
  loadMatches();
});

loadMatches();
