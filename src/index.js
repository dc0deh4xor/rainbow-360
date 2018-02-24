const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const server = require("http").Server(app);

const {
  getOrg,
  createOrg,
  removeOrg,
  listOrgs,
  flushTestRepo
} = require("./Services");

app.use(express.static("public"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

if (process.env.NODE_ENV === "test") {
  app.use("/flush", async (req, res, next) => {
    await flushTestRepo();
    res.send("OK !!!!!!!!!");
  });
}

app.get("/org/:adminId/:orgSlug", async (req, res, next) => {
  const id = req.params.adminId;
  const orgSlug = req.params.orgSlug;

  try {
    const list = await getOrg(id, orgSlug);

    res.json(list);
  } catch (e) {
    next(e);
  }
});

app.post("/org/:adminId", async (req, res, next) => {
  const id = req.params.adminId;
  const orgSlug = req.body.name;

  try {
    const list = await createOrg(id, orgSlug);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

app.post("/org/members/:orgId", async (req, res) => {});

app.get("/org/members/:orgId", async (req, res) => {});

app.get("/org/members/:adminId/:orgSlug", async (req, res) => {});

app.post("/org/members/:orgId/:userId", async (req, res) => {});

app.put("/org/members/:orgId/:userId", async (req, res) => {});

app.delete("/org/members/:orgId/:userId", async (req, res) => {});

app.listen(8080, httpServerError => {
  console.error(httpServerError);
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});
