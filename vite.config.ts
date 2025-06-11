import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://research.exc.co.kr/hr_survey
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  if (env.VITE_ENVTYPE === "test") {
    console.log("테스트url 버전 !!!!");
  }
  return {
    plugins: [react()],
    base: "/hr_survey",
    build: {
      outDir: "hr_survey"
      // copyPublicDir: false
    },
    define: {
      "process.env": {
        VITE_ENVTYPE: env.VITE_ENVTYPE,
        VITE_BASEURL: env.VITE_BASEURL
      }
    }
  };
});