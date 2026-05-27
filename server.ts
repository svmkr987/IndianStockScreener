import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Check if yahooFinance options need suppression for cache if any, 
  // yahoo-finance2 v2+ handles this fine.

  // API Route
  app.get("/api/analyze", async (req, res) => {
    try {
      const symbolsStr = req.query.symbols as string;
      if (!symbolsStr) return res.status(400).json({ error: "No symbols provided" });

      const symbols = symbolsStr
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter((s) => s);

      const results = [];

      for (let s of symbols) {
        // Automatically add .NS suffix if not provided and it might be an Indian stock without a suffix
        const querySymbol = s.includes(".") ? s : `${s}.NS`;

        try {
          const quote = await yahooFinance.quote(querySymbol);
          const qs = await yahooFinance.quoteSummary(querySymbol, {
            modules: [
              "summaryProfile",
              "financialData",
              "defaultKeyStatistics",
              "summaryDetail",
              "price",
            ],
          });

          // Fetch 1-year historical data for charting
          const period1 = new Date();
          period1.setFullYear(period1.getFullYear() - 1);
          const chartResult = await yahooFinance.chart(querySymbol, {
            period1,
            interval: "1d",
          });
          const history = chartResult.quotes;

          results.push({
            symbol: querySymbol,
            quote,
            quoteSummary: qs,
            history,
          });
        } catch (e: any) {
          console.error(`Error fetching data for ${querySymbol}:`, e);
          results.push({
            symbol: querySymbol,
            error: e.message || "Failed to fetch data",
          });
        }
      }

      res.json(results);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
