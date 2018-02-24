const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const {
  getOrg,
  createOrg,
  removeOrg,
  listOrgs,
  getOrgMember,
  addOrgMember,
  removeOrgMember,
  listOrgTeams,
  listOrgMembers,
  listOrgTeamMembers,
  updateOrgMemberTeams,
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

app.get("/org/:adminId", async (req, res, next) => {
  const id = req.params.adminId;

  try {
    const list = await listOrgs(id);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

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

app.delete("/org/:adminId/:orgSlug", async (req, res, next) => {
  const id = req.params.adminId;
  const orgSlug = req.params.orgSlug;

  try {
    const list = await removeOrg(id, orgSlug);

    res.json(list);
  } catch (e) {
    next(e);
  }
});

app.get("/org/:adminId/:orgSlug/teams", async (req, res, next) => {
  const adminId = req.params.adminId;
  const orgSlug = req.params.orgSlug;

  try {
    const list = await listOrgTeams(adminId, orgSlug);

    res.json(list);
  } catch (e) {
    next(e);
  }
});

app.get("/org/:adminId/:orgSlug/teams/:teamSlug", async (req, res, next) => {
  const adminId = req.params.adminId;
  const orgSlug = req.params.orgSlug;
  const teamSlug = req.params.teamSlug;

  try {
    const list = await listOrgTeamMembers(adminId, orgSlug, teamSlug);

    res.json(list);
  } catch (e) {
    next(e);
  }
});

app.post("/org/:adminId/:orgSlug/members", async (req, res, next) => {
  const adminId = req.params.adminId;
  const orgSlug = req.params.orgSlug;
  const memberId = req.body.id;
  const teams = req.body.teams;

  try {
    const member = await addOrgMember(adminId, orgSlug, memberId, teams);

    res.json(member);
  } catch (e) {
    next(e);
  }
});

app.get("/org/:adminId/:orgSlug/members", async (req, res, next) => {
  const adminId = req.params.adminId;
  const orgSlug = req.params.orgSlug;

  try {
    const member = await listOrgMembers(adminId, orgSlug);

    res.json(member);
  } catch (e) {
    next(e);
  }
});

app.get("/org/:adminId/:orgSlug/members/:memberId", async (req, res, next) => {
  const adminId = req.params.adminId;
  const orgSlug = req.params.orgSlug;
  const memberId = req.params.memberId;

  try {
    const member = await getOrgMember(adminId, orgSlug, memberId);

    res.json(member);
  } catch (e) {
    next(e);
  }
});

app.get(
  "/org/:adminId/:orgSlug/members/:memberId/teams",
  async (req, res, next) => {
    const adminId = req.params.adminId;
    const orgSlug = req.params.orgSlug;
    const memberId = req.params.memberId;

    try {
      const member = await listOrgTeamMembers(adminId, orgSlug, memberId);

      res.json(member);
    } catch (e) {
      next(e);
    }
  }
);

app.delete(
  "/org/:adminId/:orgSlug/members/:memberId",
  async (req, res, next) => {
    const adminId = req.params.adminId;
    const orgSlug = req.params.orgSlug;
    const memberId = req.params.memberId;

    try {
      const member = await removeOrgMember(adminId, orgSlug, memberId);

      res.json(member);
    } catch (e) {
      next(e);
    }
  }
);

app.put(
  "/org/:adminId/:orgSlug/members/:memberId/teams",
  async (req, res, next) => {
    const adminId = req.params.adminId;
    const orgSlug = req.params.orgSlug;
    const memberId = req.params.memberId;
    const teams = req.body;
    try {
      const member = await updateOrgMemberTeams(
        adminId,
        orgSlug,
        memberId,
        teams
      );

      res.json(member);
    } catch (e) {
      next(e);
    }
  }
);

app.listen(8080, httpServerError => {
  if (httpServerError) {
    console.error(httpServerError);
  } else {
    console.log("Server Run at port 8080");
  }
});

app.use((error, req, res, next) => {
  console.log(error.stack);

  res.status(500).json({ message: error.message });
});
