const axios = require("axios");
const { flushTestRepo } = require("../Services");

afterEach(async () => {
  await getRequest("/flush");
});
function getRequest(url) {
  return axios
    .get(`http://localhost:8080${url}`)
    .then(x => x.data)
    .catch(e => {
      throw new Error(e.response.data.message);
    });
}
function postRequest(url, body) {
  return axios
    .post(`http://localhost:8080${url}`, body)
    .then(x => x.data)
    .catch(e => {
      throw new Error(e.response.data.message);
    });
}
function deleteRequest(url) {
  return axios
    .get(`http://localhost:8080${url}`)
    .then(x => x.data)
    .catch(e => {
      throw new Error(e.response.data.message);
    });
}

describe("Controllers", () => {
  describe("/org", () => {
    describe("POST /org/:adminId", () => {
      it("should create organization", async () => {
        await expect(postRequest("/org/foo", { name: "bar" })).resolves.toEqual(
          { slug: "bar" }
        );
        await expect(getRequest("/org/foo/bar")).resolves.toEqual({
          slug: "bar"
        });
      });
      it("should throw if org already exists", async () => {
        await expect(postRequest("/org/foo", { name: "bar" })).resolves.toEqual(
          { slug: "bar" }
        );
        await expect(postRequest("/org/foo", { name: "bar" })).rejects.toThrow(
          'Org "bar" already exists.'
        );
      });
    });

    describe("GET /org/:adminId/:orgSlug", () => {
      it("should throw if org is not found", async () => {
        await expect(getRequest("/org/foo/bar")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });
    });
  });

  describe("/org/members/:orgId", () => {
    describe("POST /org/members/:orgId { id, teams: [{ slug }] }", () => {
      it("should add user to organization", async () => {});
    });

    describe("GET /org/members/:orgId", () => {
      it("should return users of organization", () => {});
    });

    describe("PUT /org/members/:orgId/:userId/teams [{ slug }]", () => {
      it("should update user in organization", () => {});
    });

    describe("DELETE /org/members/:orgId/:userId", () => {
      it("should remove user from organization", () => {});
    });
  });
});
