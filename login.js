document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const adminResponse = await fetch("admin.json");
      const admins = await adminResponse.json();
      const admin = admins.find(a => a.name === name && a.password === password);

      if (admin) {
        localStorage.setItem("role", "admin");
        localStorage.setItem("name", admin.name);
        return window.location.href = "anasayfa.html";
      }

      const userResponse = await fetch("kullanici.json");
      const users = await userResponse.json();
      const user = users.find(u => u.name === name && u.password === password);

      if (user) {
        localStorage.setItem("role", "user");
        localStorage.setItem("name", user.name);
        return window.location.href = "anasayfa.html";
      }

      alert("Kullanıcı adı veya şifre yanlış!");
    } catch (err) {
      console.error("Veriler yüklenemedi:", err);
    }
  });
});
