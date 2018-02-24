const axios = require("axios");

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

    describe("GET /org/:adminId", () => {
      // TODO: Implement with `listOrgs`
    });

    describe("GET /org/:adminId/:orgSlug", () => {
      it("should throw if org is not found", async () => {
        await expect(getRequest("/org/foo/bar")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });
    });

    describe("DELETE /org/:adminId/:orgSlug", () => {
      // TODO: Implement with `removeOrg`
    });
  });

  describe("/org/:adminId/:orgSlug/teams", () => {
    describe("GET /org/:adminId/:orgSlug/teams", () => {
      // TODO: Implement with `listOrgTeams`
    });

    describe("GET /org/:adminId/:orgSlug/teams/:teamSlug", () => {
      // TODO: Implement with `listOrgTeamMembers`
    });
  });

  describe("/org/:adminId/:orgSlug/members", () => {
    describe("POST /org/:adminId/:orgSlug/members", () => {
      // TODO: Implement with `addOrgMember`
    });

    describe("GET /org/:adminId/:orgSlug/members", () => {
      // TODO: Implement with `listOrgMembers`
    });

    describe("GET /org/:adminId/:orgSlug/members/:memberId", () => {
      it("should throw if org not exists", async () => {
        await expect(getRequest("/org/foo/bar/members/baz")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });

      it.only("should throw if org member not exists", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();
        await expect(getRequest("/org/foo/bar/members/baz")).rejects.toThrow(
          'Member "baz" not found in org "bar".'
        );
      });
    });

    describe("DELETE /org/:adminId/:orgSlug/members/:memberId", () => {
      // TODO: Implement with `removeOrgMember`
    });

    describe("GET /org/:adminId/:orgSlug/members/:memberId/teams", () => {
      // TODO: Implement with `listOrgTeamMembers`
    });

    describe("PUT /org/:adminId/:orgSlug/members/:memberId/teams", () => {
      // TODO: Implement with `updateOrgMemberTeams`
    });
  });
});
