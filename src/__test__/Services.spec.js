const {
  getOrg,
  createOrg,
  removeOrg,
  listOrgs,
  flushTestRepo
} = require("../Services");

afterEach(async () => {
  await flushTestRepo();
});

describe("Services", () => {
  describe("getOrg", () => {
    it("should throw if org is not found", async () => {
      await expect(getOrg("foo", "bar")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });
  });

  describe("createOrg", () => {
    it("should create organization", async () => {
      await expect(createOrg("foo", "bar")).resolves.toEqual({ slug: "bar" });
      await expect(getOrg("foo", "bar")).resolves.toEqual({ slug: "bar" });
    });

    it("should throw if org already exists", async () => {
      await expect(createOrg("foo", "bar")).resolves.toEqual({ slug: "bar" });
      await expect(createOrg("foo", "bar")).rejects.toThrow(
        'Org "bar" already exists.'
      );
    });
  });

  describe("removeOrg", () => {
    it("should throw if org is not exist", async () => {
      await expect(removeOrg("foo", "bar")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });

    it("should remove org", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(removeOrg("foo", "bar")).resolves.toBeFalsy();
      await expect(getOrg("foo", "bar")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });
  });

  describe("listOrgs", () => {
    it("should return plain object", async () => {
      await expect(listOrgs("foo")).resolves.toEqual({});
    });

    it("should return values", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(createOrg("foo", "baz")).resolves.toBeTruthy();
      await expect(createOrg("foo", "quoz")).resolves.toBeTruthy();
      await expect(createOrg("foo", "noop")).resolves.toBeTruthy();

      await expect(listOrgs("foo")).resolves.toEqual({
        bar: { slug: "bar" },
        baz: { slug: "baz" },
        noop: { slug: "noop" },
        quoz: { slug: "quoz" }
      });
    });
  });

  describe("/org/members/:orgId", () => {
    describe("POST /org/members/:orgId { id, teams: [{ slug }] }", () => {
      it("should add user to organization", () => {});
    });

    describe("GET /org/members/:orgId", () => {
      it("should return users of organization", () => {});
    });

    describe("PUT /org/members/:orgId/:userId { id, teams: [{ slug }] }", () => {
      it("should update user in organization", () => {});
    });

    describe("DELETE /org/members/:orgId/:userId", () => {
      it("should remove user from organization", () => {});
    });
  });
});
