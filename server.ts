/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini analysis and reasoning
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { prompt, contextData } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(500).json({
          error: 'GEMINI_API_KEY secret is not configured or holds default values on server. Please add your real key through AI Studio secrets panel.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Construct a highly detailed system guide prompt
      const systemGuide = `You are the executive Hydrological Consultant and Eco-Village Planner for Vijayanagar Eco-Village in Denkanikottai, Krishnagiri district, Tamil Nadu, India.
You understand Arid & Semi-arid zone water harvesting, Deccan plateau fracture hydrology, and closed-loop permaculture layouts. 
Provide extremely crisp, authoritative, friendly, and practical water security advisory. 
Reference their calculated HRU areas and runoff volumes directly. Explain dry period stress limits, and layout action plans clearly using beautiful Markdown with bold headers and bullet points. Do not praise yourself; keep it focused on the village's water security.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `[CONTEXT DATA SUMMARY]
- Location: ${JSON.stringify(contextData.location || {latitude: 12.5278, longitude: 77.9272, name: 'Vijayanagar'})}
- Total Footprint Area: ${contextData.totalAreaM2} m² (${contextData.totalAreaHa} ha)
- HRU Configuration: ${JSON.stringify(contextData.hruSummary)}
- Runoff Coefficient: ${contextData.weightedC}
- Climatic Long-Term Avg Rainfall: 910 mm
- Computed Annual Runoff Volume: ${contextData.annualRunoffMl} Million Liters (ML)
- Sustainable Hydrologic Recharge: ${contextData.annualRechargeMl} ML
- Water Demand standard selected: ${contextData.demandCategory} (${contextData.demandLpcd} lpcd)
- Community total household demand: ${contextData.communityDemandLpd} Liters/day
- Estimated safe water security days: ${contextData.waterSecurityDays} Days
- Active Risk Alerts flags: ${JSON.stringify(contextData.riskFlags)}
- ML Predicted Static Water Table Depth: ${contextData.predictedGwlDepthM} meters
- Borewell Yield capacity group: ${contextData.borewellYield}

[USER QUESTION / INTERPRETATION REQUEST]
${prompt}`,
        config: {
          systemInstruction: systemGuide,
          temperature: 0.7,
        }
      });

      const generatedText = response.text || 'Unable to generate response content from Gemini API.';
      res.json({ text: generatedText });
    } catch (err: any) {
      console.error('Server side Gemini API call failed:', err);
      res.status(500).json({ error: err.message || 'Server failed to call Gemini API' });
    }
  });

  // Hot module development routing or production static routing
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal dev server boot crash:', err);
});
