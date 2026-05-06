require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

/* SUMMARIZE */

app.post("/summarize", async (req, res) => {

  try {

    const text = req.body.text;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: `Summarize this website content in short bullet points:\n\n${text}`
          }
        ]
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const summary =
      response.data.choices[0].message.content;

    res.json({
      summary: summary
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to summarize"
    });

  }

});

/* ASK AI */

app.post("/ask", async (req, res) => {

  try {

    const text = req.body.text;

    const question = req.body.question;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",

            content: `
Website Content:
${text}

Question:
${question}
            `
          }
        ]
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer =
      response.data.choices[0].message.content;

    res.json({
      answer: answer
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to answer question"
    });

  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});