// ===== Hamburger menu (vanilla JS, addEventListener + toggle class) =====
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mainNav = document.getElementById("main-nav");

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener("click", function () {
      // Tailwind pakai class "hidden" untuk sembunyikan, "flex" untuk tampilkan
      const isOpen = mainNav.classList.toggle("hidden") === false;
      mainNav.classList.toggle("flex", isOpen);

      hamburgerBtn.classList.toggle("open", isOpen);
      hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Tutup menu otomatis saat salah satu link diklik (khusus mobile)
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.add("hidden");
        mainNav.classList.remove("flex");
        hamburgerBtn.classList.remove("open");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ===== SPRINT 1: Form Tanya AI (tampilan/simulasi lokal saja) =====
  // TODO SPRINT 2: ganti blok ini dengan fetch(POST /api/chat) supaya
  // balasan benar-benar datang dari logika dummy di backend.
  const chatForm = document.getElementById("chat-form");
  const chatWindow = document.getElementById("chat-window");

  if (chatForm && chatWindow) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const input = document.getElementById("pertanyaan");
      const pertanyaan = input.value.trim();

      if (!pertanyaan) {
        return;
      }

      const userBubble = document.createElement("div");
      userBubble.className =
        "chat-bubble max-w-[70%] self-end bg-primary text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm";
      userBubble.innerHTML = "<p></p>";
      userBubble.querySelector("p").textContent = pertanyaan;
      chatWindow.appendChild(userBubble);

      const placeholderBubble = document.createElement("div");
      placeholderBubble.className =
        "chat-bubble max-w-[70%] self-start bg-accent-light text-ink px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm";
      placeholderBubble.innerHTML =
        "<p>Fitur balasan otomatis akan tersedia di Sprint 2 🙂</p>";
      chatWindow.appendChild(placeholderBubble);

      input.value = "";
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
  }
});