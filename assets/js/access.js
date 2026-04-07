document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pin-form");
    const pinInput = document.getElementById("pin-input");
    const errorBox = document.getElementById("pin-error");
    const accessScreen = document.getElementById("access-screen");
    const privateContent = document.getElementById("private-content");

    if (!form || !pinInput || !errorBox || !accessScreen || !privateContent) {
        return;
    }

    const section = form.dataset.section || "";
    const sessionKey = `private_access_${section}`;

    if (!section) {
        errorBox.textContent = "No se pudo identificar la sección privada.";
        errorBox.style.display = "block";
        return;
    }

    const hasAccess = sessionStorage.getItem(sessionKey) === "granted";

    if (hasAccess) {
        accessScreen.style.display = "none";
        privateContent.style.display = "block";
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const pin = pinInput.value.trim();

        errorBox.style.display = "none";
        errorBox.textContent = "";

        if (!pin) {
            errorBox.textContent = "Ingresa tu PIN para continuar.";
            errorBox.style.display = "block";
            return;
        }

        try {
            const response = await fetch("/validate-pin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pin,
                    section
                })
            });

            const result = await response.json();

            if (result.ok) {
                sessionStorage.setItem(sessionKey, "granted");
                accessScreen.style.display = "none";
                privateContent.style.display = "block";
                pinInput.value = "";
            } else {
                errorBox.textContent = result.message || "PIN incorrecto. Inténtalo nuevamente.";
                errorBox.style.display = "block";
            }
        } catch (error) {
            errorBox.textContent = "Ocurrió un error al validar el acceso. Inténtalo nuevamente.";
            errorBox.style.display = "block";
        }
    });
});