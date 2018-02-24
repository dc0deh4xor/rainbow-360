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
} = require("../Services");

jest.setTimeout(10 * 60 * 1000);

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

  describe("getOrgMember", () => {
    it("should throw if org not exists", async () => {
      await expect(getOrgMember("foo", "bar", "baz")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });

    it("should throw if org member not exists", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(getOrgMember("foo", "bar", "baz")).rejects.toThrow(
        'Member "baz" not found in org "bar".'
      );
    });
  });

  describe("listOrgTeams", () => {
    it("should throw if org not exists", async () => {
      await expect(listOrgTeams("foo", "bar")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });

    it("should always return plain object", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(listOrgTeams("foo", "bar")).resolves.toEqual({});
    });
  });

  describe("listOrgTeamMembers", () => {
    it("should throw if org not exists", async () => {
      await expect(listOrgTeamMembers("foo", "bar", "baz")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });

    it("should always return plain object", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(listOrgTeamMembers("foo", "bar", "baz")).resolves.toEqual(
        {}
      );
    });
  });

  describe("addOrgMember", () => {
    it("should throw if org not exists", async () => {
      await expect(addOrgMember("foo", "bar", "baz")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });

    it("should add user to organization", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();

      await expect(addOrgMember("foo", "bar", "baz")).resolves.toEqual({
        id: "baz"
      });

      await expect(getOrgMember("foo", "bar", "baz")).resolves.toEqual({
        id: "baz"
      });
    });

    it("should throw if user already in organization", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();

      await expect(addOrgMember("foo", "bar", "baz")).resolves.toEqual({
        id: "baz"
      });

      await expect(addOrgMember("foo", "bar", "baz")).rejects.toThrow(
        'Member "baz" already in org "bar".'
      );
    });

    it("should add user to organization with teams", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();

      await expect(
        addOrgMember("foo", "bar", "baz", ["quoz", "noop"])
      ).resolves.toEqual({
        id: "baz"
      });

      await expect(listOrgTeams("foo", "bar")).resolves.toEqual({
        noop: { baz: true },
        quoz: { baz: true }
      });

      await expect(listOrgTeamMembers("foo", "bar", "quoz")).resolves.toEqual({
        baz: true
      });

      await expect(listOrgTeamMembers("foo", "bar", "noop")).resolves.toEqual({
        baz: true
      });
    });
  });

  describe("listOrgMembers", () => {
    it("should throw if org not exists", async () => {
      await expect(listOrgMembers("foo", "bar")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });

    it("should always return plain object", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(listOrgMembers("foo", "bar")).resolves.toEqual({});
    });

    it("should return users of organization", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(addOrgMember("foo", "bar", "baz")).resolves.toBeTruthy();
      await expect(addOrgMember("foo", "bar", "quoz")).resolves.toBeTruthy();
      await expect(addOrgMember("foo", "bar", "noop")).resolves.toBeTruthy();
      await expect(listOrgMembers("foo", "bar")).resolves.toEqual({
        baz: { id: "baz" },
        noop: { id: "noop" },
        quoz: { id: "quoz" }
      });
    });
  });

  describe("updateOrgMemberTeams", () => {
    it("should throw if org not exists", async () => {
      await expect(
        updateOrgMemberTeams("foo", "bar", "baz", [])
      ).rejects.toThrow('Org "bar" is not found.');
    });

    it("should throw if org member not exists", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(updateOrgMemberTeams("foo", "bar", "baz")).rejects.toThrow(
        'Member "baz" not found in org "bar".'
      );
    });

    it("should throw if teams is invalid object", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(addOrgMember("foo", "bar", "baz")).resolves.toBeTruthy();

      await expect(updateOrgMemberTeams("foo", "bar", "baz")).rejects.toThrow(
        'Invalid org member "teams" value.'
      );
    });

    it("should update member teams", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(
        addOrgMember("foo", "bar", "baz", ["quoz", "noop"])
      ).resolves.toBeTruthy();

      await expect(listOrgTeams("foo", "bar")).resolves.toEqual({
        noop: { baz: true },
        quoz: { baz: true }
      });

      await expect(
        updateOrgMemberTeams("foo", "bar", "baz", ["loop", "boop"])
      ).resolves.toBeUndefined();

      await expect(listOrgTeams("foo", "bar")).resolves.toEqual({
        loop: { baz: true },
        boop: { baz: true }
      });
    });
  });

  describe("removeOrgMember", () => {
    it("should throw if org not exists", async () => {
      await expect(removeOrgMember("foo", "bar", "baz")).rejects.toThrow(
        'Org "bar" is not found.'
      );
    });

    it("should throw if org member not exists", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(removeOrgMember("foo", "bar", "baz")).rejects.toThrow(
        'Member "baz" not found in org "bar".'
      );
    });

    it("should remove org member", async () => {
      await expect(createOrg("foo", "bar")).resolves.toBeTruthy();
      await expect(
        addOrgMember("foo", "bar", "baz", ["quoz", "noop"])
      ).resolves.toBeTruthy();

      await expect(listOrgTeams("foo", "bar")).resolves.toEqual({
        noop: { baz: true },
        quoz: { baz: true }
      });

      await expect(
        removeOrgMember("foo", "bar", "baz")
      ).resolves.toBeUndefined();

      await expect(listOrgTeams("foo", "bar")).resolves.toEqual({});
    });
  });
});
