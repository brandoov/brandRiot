export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Quando `true`, todas as páginas pulam as chamadas reais à API e renderizam
 * dados fictícios (mock). Usado no build de produção que vai pro GitHub Pages
 * — onde não há backend nem banco — para que a Riot navegue sem ver erros.
 *
 * Defina via `.env.production` ou pela variável de ambiente do CI.
 */
export const demoMode = import.meta.env.VITE_DEMO_MODE === "true";
