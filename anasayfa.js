document.addEventListener("DOMContentLoaded", () => {
  const userBtn = document.getElementById("userBtn");
  const side = document.getElementById("sidePanel");
  const usernameEl = document.getElementById("username");
  const logoutBtn = document.getElementById("logoutBtn");
  const pageContent = document.querySelector(".page-content");

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  usernameEl.textContent = role === "admin" ? "Yetkili: " + name : name || "Kullanıcı";

  const adminButtons = document.getElementById("adminButtons");
  const konumEkleBtn = document.getElementById("konumEkleBtn");
  if(role === "admin") adminButtons.style.display = "block";

  userBtn.addEventListener("click", () => side.classList.toggle("open"));
  pageContent.addEventListener("click", () => {
    if(side.classList.contains("open")) side.classList.remove("open");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  const map = L.map('map', { zoomControl: false, attributionControl: false })
    .setView([41.0082, 28.9784], 13);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 19
  }).addTo(map);

  const konumBulBtn = document.getElementById("konumBulBtn");
  const konumKutu = document.getElementById("konumKutu");
  const konumHakkindaBtn = document.getElementById("konumHakkindaBtn");
  const iptalBtn = document.getElementById("iptalBtn");
  const loadingOverlay = document.getElementById("loadingOverlay");

  let marker = null;
  let currentCoords = null;

  konumEkleBtn?.addEventListener("click", () => {
    const input = prompt("Koordinatı girin (yoksa ben size götten ahahahaha):");
    if(input){
      localStorage.setItem("kordinatStr", input);
      alert("Konum kaydedildi!");
    }
  });

  konumBulBtn.addEventListener("click", () => {
    loadingOverlay.style.display = "flex";
    const iconContainer = loadingOverlay.querySelector(".icon-container");
    if(iconContainer){
      iconContainer.innerHTML = `<img src="image/skull.svg" class="skull-icon">`;
    }

    setTimeout(() => {
      loadingOverlay.style.display = "none";

      const coordsStr = localStorage.getItem("kordinatStr");
      if(!coordsStr){
        konumKutu.style.display = "block";
        konumKutu.textContent = "Konum yok!";
        return;
      }

      currentCoords = coordsStr;
      konumKutu.style.display = "block";
      konumKutu.textContent = coordsStr;

      const regex = /(\d+)°(\d+)'([\d.]+)"([NS]) (\d+)°(\d+)'([\d.]+)"([EW])/;
      const match = coordsStr.match(regex);
      if(match){
        let lat = parseInt(match[1]) + parseInt(match[2])/60 + parseFloat(match[3])/3600;
        if(match[4] === 'S') lat = -lat;
        let lng = parseInt(match[5]) + parseInt(match[6])/60 + parseFloat(match[7])/3600;
        if(match[8] === 'W') lng = -lng;

        if(marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);
        map.flyTo([lat, lng], 16);
      }

      konumHakkindaBtn.style.display = "block";
      iptalBtn.style.display = "block";
    }, 3000);
  });

  konumHakkindaBtn.addEventListener("click", () => {
    const infoBox = document.createElement("div");
    infoBox.id = "infoBox";

    const skullImg = `<img src="image/skull.svg" class="skull-icon2">`;

    infoBox.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;">
        ${skullImg}
        <div>
          No information found about location!<br>
          Views: <b>0</b><br>
          Visits: <b>0</b>
        </div>
      </div>
    `;

    document.body.appendChild(infoBox);
  });

  iptalBtn.addEventListener("click", () => {
    if(marker) map.removeLayer(marker);
    marker = null;
    currentCoords = null;
    konumKutu.style.display = "none";
    konumHakkindaBtn.style.display = "none";
    iptalBtn.style.display = "none";
  });
});
