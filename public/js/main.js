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

  // ===== SPRINT 2: Form Tanya AI -> fetch(POST /api/chat) beneran =====
  const chatForm = document.getElementById("chat-form");
  const chatWindow = document.getElementById("chat-window");

  function tambahBubble(teks, dariUser) {
    const bubble = document.createElement("div");
    bubble.className = dariUser
      ? "chat-bubble max-w-[70%] self-end bg-primary text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm"
      : "chat-bubble max-w-[70%] self-start bg-accent-light text-ink px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm";
    bubble.innerHTML = "<p></p>";
    bubble.querySelector("p").textContent = teks;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return bubble;
  }

  if (chatForm && chatWindow) {
    chatForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const input = document.getElementById("pertanyaan");
      const pertanyaan = input.value.trim();

      // Validasi dasar (FR-17): cegah submit kosong
      if (!pertanyaan) {
        return;
      }

      tambahBubble(pertanyaan, true);
      input.value = "";

      const typingBubble = tambahBubble("Mengetik...", false);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pertanyaan }),
        });
        const result = await res.json();

        typingBubble.querySelector("p").textContent =
          result.status === "success"
            ? result.data.reply
            : result.message || "Maaf, terjadi kesalahan.";
      } catch (err) {
        typingBubble.querySelector("p").textContent =
          "Maaf, gagal terhubung ke server. Coba lagi ya.";
      }

      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
  }
});
