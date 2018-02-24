const admin = require("firebase-admin");
const serviceAccount = require("../creds/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dc0deh4xor-rainbow-360.firebaseio.com"
});

const REPO_PREFIX = process.env.NODE_ENV === "text" ? Math.random() : "dev";

function getOrgUrl(adminId, orgSlug) {
  const url = `${REPO_PREFIX}/orgs/${adminId}`;

  if (orgSlug) {
    return `${url}/${orgSlug}`;
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

async function flushTestRepo() {
  await admin
    .database()
    .ref(REPO_PREFIX)
    .set(null);
}

module.exports = { getOrg, removeOrg, createOrg, listOrgs, flushTestRepo };
