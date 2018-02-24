const admin = require("firebase-admin");
const serviceAccount = require("../creds/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dc0deh4xor-rainbow-360.firebaseio.com"
});

const REPO_PREFIX = process.env.NODE_ENV === "text" ? Math.random() : "dev";

function getOrgUrl(adminId, slug) {
  const url = `${REPO_PREFIX}/orgs/${adminId}`;

  if (slug) {
    return `${url}/${slug}`;
  }

  return url;
}

async function getOrg(adminId, slug) {
  const org = await admin
    .database()
    .ref(getOrgUrl(adminId, slug))
    .once("value");

  const value = org.val();

  if (!value) {
    throw new Error(`Org "${slug}" is not found.`);
  }

  return value;
}

async function createOrg(adminId, slug) {
  const org = await getOrg(adminId, slug).catch(() => null);

  if (org) {
    throw new Error(`Org "${slug}" already exists.`);
  }

  await admin
    .database()
    .ref(getOrgUrl(adminId, slug))
    .set({ slug });
}

async function removeOrg(adminId, slug) {
  await getOrg(adminId, slug);

  await admin
    .database()
    .ref(getOrgUrl(adminId, slug))
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
