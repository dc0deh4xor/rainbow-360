const admin = require("firebase-admin");
const serviceAccount = require("../creds/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dc0deh4xor-rainbow-360.firebaseio.com"
});

const REPO_PREFIX =
  process.env.NODE_ENV === "test"
    ? Math.random()
        .toString()
        .slice(2)
    : "dev";

function getOrgUrl(adminId, orgSlug) {
  const url = `${REPO_PREFIX}/orgs/${adminId}`;

  if (orgSlug) {
    return `${url}/${orgSlug}`;
  }

  return url;
}

function getOrgTeamsUrl(adminId, orgSlug, teamSlug) {
  const url = `${getOrgUrl(adminId, orgSlug)}/teams`;

  if (teamSlug) {
    return `${url}/${teamSlug}`;
  }

  return url;
}

function getOrgMembersUrl(adminId, orgSlug, memberId) {
  const url = `${getOrgUrl(adminId, orgSlug)}/members`;

  if (memberId) {
    return `${url}/${memberId}`;
  }

  return url;
}

async function getOrg(adminId, orgSlug) {
  const org = await admin
    .database()
    .ref(getOrgUrl(adminId, orgSlug))
    .once("value");

  const value = org.val();

  if (!value) {
    throw new Error(`Org "${orgSlug}" is not found.`);
  }

  return value;
}

async function createOrg(adminId, orgSlug) {
  const org = await getOrg(adminId, orgSlug).catch(() => null);

  if (org) {
    throw new Error(`Org "${orgSlug}" already exists.`);
  }

  const value = { slug: orgSlug };

  await admin
    .database()
    .ref(getOrgUrl(adminId, orgSlug))
    .set(value);

  return value;
}

async function removeOrg(adminId, orgSlug) {
  await getOrg(adminId, orgSlug);

  await admin
    .database()
    .ref(getOrgUrl(adminId, orgSlug))
    .set(null);
}

async function listOrgs(adminId) {
  const list = await admin
    .database()
    .ref(getOrgUrl(adminId))
    .once("value");

  return list.val() || {};
}

async function getOrgMember(adminId, orgSlug, memberId) {
  await getOrg(adminId, orgSlug);

  const member = await admin
    .database()
    .ref(getOrgMembersUrl(adminId, orgSlug, memberId))
    .once("value");

  if (!member.exists()) {
    throw new Error(`Member "${memberId}" not found in org "${orgSlug}".`);
  }

  return member.val();
}

async function listOrgTeamMembers(adminId, orgSlug, teamSlug) {
  await getOrg(adminId, orgSlug);

  const list = await admin
    .database()
    .ref(getOrgTeamsUrl(adminId, orgSlug, teamSlug))
    .once("value");

  return list.val() || {};
}

async function addOrgMember(adminId, orgSlug, memberId, teams) {
  await getOrg(adminId, orgSlug);

  const member = await getOrgMember(adminId, orgSlug, memberId).catch(
    () => null
  );

  if (member) {
    throw new Error(`Member "${memberId}" already in org "${orgSlug}".`);
  }

  const value = { id: memberId };

  const updateValues = {};

  if (teams) {
    if (Array.isArray(teams)) {
      teams.forEach(x => {
        updateValues[`${x}/${memberId}`] = true;
      });
    } else {
      throw new Error(`Invalid org member "teams" value.`);
    }
  }

  await admin
    .database()
    .ref(getOrgMembersUrl(adminId, orgSlug, memberId))
    .set(value);

  await admin
    .database()
    .ref(getOrgTeamsUrl(adminId, orgSlug))
    .update(updateValues);

  return value;
}

async function listOrgTeams(adminId, orgSlug) {
  await getOrg(adminId, orgSlug);

  const list = await admin
    .database()
    .ref(getOrgTeamsUrl(adminId, orgSlug))
    .once("value");

  return list.val() || {};
}

async function updateOrgMemberTeams(adminId, orgSlug, memberId, teams) {
  const orgTeams = await listOrgTeams(adminId, orgSlug, memberId);

  await getOrgMember(adminId, orgSlug, memberId);

  const updateValues = {};

  Object.keys(orgTeams).forEach(x => {
    updateValues[`${x}/${memberId}`] = null;
  });

  if (Array.isArray(teams)) {
    teams.forEach(x => {
      updateValues[`${x}/${memberId}`] = true;
    });
  } else {
    throw new Error(`Invalid org member "teams" value.`);
  }

  await admin
    .database()
    .ref(getOrgTeamsUrl(adminId, orgSlug))
    .update(updateValues);
}

async function listOrgMembers(adminId, orgSlug) {
  await getOrg(adminId, orgSlug);

  const result = await admin
    .database()
    .ref(getOrgMembersUrl(adminId, orgSlug))
    .once("value");

  return result.val() || {};
}

async function removeOrgMember(adminId, orgSlug, memberId) {
  await getOrgMember(adminId, orgSlug, memberId);
  const teams = await listOrgTeams(adminId, orgSlug);

  const updateValues = {};

  Object.keys(teams).forEach(x => {
    updateValues[`${x}/${memberId}`] = null;
  });

  await admin
    .database()
    .ref(getOrgTeamsUrl(adminId, orgSlug))
    .update(updateValues);

  await admin
    .database()
    .ref(getOrgMembersUrl(adminId, orgSlug, memberId))
    .set(null);
}

async function flushTestRepo() {
  if (process.env.NODE_ENV === "test") {
    await admin
      .database()
      .ref(REPO_PREFIX)
      .set(null);
  }
}

module.exports = {
  getOrg,
  removeOrg,
  createOrg,
  listOrgs,
  getOrgMember,
  addOrgMember,
  removeOrgMember,
  listOrgTeams,
  listOrgMembers,
  listOrgTeamMembers,
  updateOrgMemberTeams,
  flushTestRepo
};
