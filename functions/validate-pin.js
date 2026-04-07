export async function onRequestPost(context) {
    try {
        const request = context.request;
        const env = context.env;

        const body = await request.json();
        const pin = String(body.pin || "").trim();
        const section = String(body.section || "").trim();

        if (!pin || !section) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    message: "Faltan datos para validar el acceso."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        let validPin = "";

        if (section === "boudoir") {
            validPin = env.BOUDOIR_PIN || "";
        } else if (section === "desnudo-artistico") {
            validPin = env.DESNUDO_PIN || "";
        } else {
            return new Response(
                JSON.stringify({
                    ok: false,
                    message: "Sección no válida."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const isValid = pin === validPin;

        return new Response(
            JSON.stringify({
                ok: isValid,
                message: isValid ? "Acceso concedido." : "PIN incorrecto."
            }),
            {
                status: isValid ? 200 : 401,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                ok: false,
                message: "Ocurrió un error al validar el acceso."
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}