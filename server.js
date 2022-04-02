const express = require("express");
const { google } = require("googleapis");

const app = express();

app.use(express.json());

require("dotenv").config();

app.get("/sheet", async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",

      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    // client instance for auth
    const client = await auth.getClient();
    // instance of google sheet api
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1PijkbGM0eP2s4azFn02ibTJp6s6t9WOf21a8rbh4exc";
    // get metadta about spreadsheet

    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    // read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1!A:B",
    });

    res.send(getRows.data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  try {
    const { request, name } = req.body;
    console.log(req.body, "req.body");
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",

      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    // client instance for auth
    const client = await auth.getClient();
    // instance of google sheet api
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1PijkbGM0eP2s4azFn02ibTJp6s6t9WOf21a8rbh4exc";

    //   write rows for spreadsheet

    const data = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!A:B",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[request, name]],
      },
    });
    console.log(data, "data");
    res.send("success");
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
