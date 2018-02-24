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
    .delete(`http://localhost:8080${url}`)
    .then(x => x.data)
    .catch(e => {
      throw new Error(e.response.data.message);
    });
}
function putRequest(url, body) {
    return axios
        .put(`http://localhost:8080${url}`, body)
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
        it("should return plain object", async () => {
            await expect(getRequest("/org/foo")).resolves.toEqual({});
        });
        it("should return values", async () => {
            await expect(postRequest("/org/foo", { name: "bar" })).resolves.toBeTruthy();
            await expect(postRequest("/org/foo", { name: "baz" })).resolves.toBeTruthy();
            await expect(postRequest("/org/foo", { name: "noop" })).resolves.toBeTruthy();
            await expect(postRequest("/org/foo", { name: "quoz" })).resolves.toBeTruthy();

            await expect(getRequest("/org/foo")).resolves.toEqual({
                bar: { slug: "bar" },
                baz: { slug: "baz" },
                noop: { slug: "noop" },
                quoz: { slug: "quoz" }
            });
        });
    });

    describe("GET /org/:adminId/:orgSlug", () => {
      it("should throw if org is not found", async () => {
        await expect(getRequest("/org/foo/bar")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });
    });

    describe("DELETE /org/:adminId/:orgSlug", () => {
        it("should throw if org is not exist", async () => {
            await expect(deleteRequest("/org/foo/bar")).rejects.toThrow(
                'Org "bar" is not found.'
            );
        });

        it("should remove org", async () => {
            await expect(postRequest("/org/foo", { name: "bar" })).resolves.toBeTruthy();
            await expect(deleteRequest("/org/foo/bar")).resolves.toBeFalsy();
            await expect(getRequest("/org/foo/bar")).rejects.toThrow(
                'Org "bar" is not found.'
            );
        });
    });
  });

  describe("/org/:adminId/:orgSlug/teams", () => {
    describe("GET /org/:adminId/:orgSlug/teams", () => {
      it("should throw if org not exists", async () => {
        await expect(getRequest("/org/foo/bar/teams")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });

      it("should always return plain object", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();

        await expect(getRequest("/org/foo/bar/teams")).resolves.toEqual({});
      });
    });

    describe("GET /org/:adminId/:orgSlug/teams/:teamSlug", () => {
      it("should throw if org not exists", async () => {
        await expect(getRequest("/org/foo/bar/teams/baz")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });

      it("should always return plain object", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();

        await expect(getRequest("/org/foo/bar/teams/baz")).resolves.toEqual({});
      });
    });
  });

  describe("/org/:adminId/:orgSlug/members", () => {
    describe("POST /org/:adminId/:orgSlug/members", () => {
      it("should throw if org not exists", async () => {
        await expect(
          postRequest("/org/foo/bar/members", { id: "baz" })
        ).rejects.toThrow('Org "bar" is not found.');
      });

      it("should add user to organization", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();

        await expect(
          postRequest("/org/foo/bar/members", { id: "baz" })
        ).resolves.toEqual({
          id: "baz"
        });

        await expect(getRequest("/org/foo/bar/members/baz")).resolves.toEqual({
          id: "baz"
        });
      });

      it("should throw if user already in organization", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();

        await expect(
          postRequest("/org/foo/bar/members", { id: "baz" })
        ).resolves.toEqual({
          id: "baz"
        });

        await expect(
          postRequest("/org/foo/bar/members", { id: "baz" })
        ).rejects.toThrow('Member "baz" already in org "bar".');
      });

      it("should add user to organization with teams", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();

        await expect(
          postRequest("/org/foo/bar/members", {
            id: "baz",
            teams: ["quoz", "noop"]
          })
        ).resolves.toEqual({
          id: "baz"
        });

        await expect(getRequest("/org/foo/bar/teams")).resolves.toEqual({
          noop: { baz: true },
          quoz: { baz: true }
        });

        await expect(getRequest("/org/foo/bar/teams/quoz")).resolves.toEqual({
          baz: true
        });

        await expect(getRequest("/org/foo/bar/teams/noop")).resolves.toEqual({
          baz: true
        });
      });
    });

    describe("GET /org/:adminId/:orgSlug/members", () => {
      it("should throw if org not exists", async () => {
        await expect(getRequest("/org/foo/bar/members")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });

      it("should always return plain object", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();
        await expect(getRequest("/org/foo/bar/members")).resolves.toEqual({});
      });

      it("should return users of organization", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();
        await expect(
          postRequest("/org/foo/bar/members", { id: "baz" })
        ).resolves.toBeTruthy();
        await expect(
          postRequest("/org/foo/bar/members", { id: "quoz" })
        ).resolves.toBeTruthy();
        await expect(
          postRequest("/org/foo/bar/members", { id: "noop" })
        ).resolves.toBeTruthy();
        await expect(getRequest("/org/foo/bar/members")).resolves.toEqual({
          baz: { id: "baz" },
          noop: { id: "noop" },
          quoz: { id: "quoz" }
        });
      });
    });

    describe("GET /org/:adminId/:orgSlug/members/:memberId", () => {
      it("should throw if org not exists", async () => {
        await expect(getRequest("/org/foo/bar/members/baz")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });

      it("should throw if org member not exists", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();
        await expect(getRequest("/org/foo/bar/members/baz")).rejects.toThrow(
          'Member "baz" not found in org "bar".'
        );
      });
    });

    describe("DELETE /org/:adminId/:orgSlug/members/:memberId", () => {
      it("should throw if org not exists", async () => {
        await expect(deleteRequest("/org/foo/bar/members/baz")).rejects.toThrow(
          'Org "bar" is not found.'
        );
      });

      it("should throw if org member not exists", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();
        await expect(deleteRequest("/org/foo/bar/members/baz")).rejects.toThrow(
          'Member "baz" not found in org "bar".'
        );
      });

      it("should remove org member", async () => {
        await expect(
          postRequest("/org/foo", { name: "bar" })
        ).resolves.toBeTruthy();
        await expect(
          postRequest("/org/foo/bar/members", {
            id: "baz",
            teams: ["quoz", "noop"]
          })
        ).resolves.toBeTruthy();

        await expect(getRequest("/org/foo/bar/teams")).resolves.toEqual({
          noop: { baz: true },
          quoz: { baz: true }
        });

        await expect(deleteRequest("/org/foo/bar/members/baz")).resolves.toBe(
          ""
        );

        await expect(getRequest("/org/foo/bar/teams")).resolves.toEqual({});
      });
    });

    describe("GET /org/:adminId/:orgSlug/members/:memberId/teams", () => {
        it("should throw if org not exists", async () => {
            await expect(getRequest("/org/foo/bar/members/baz/teams")).rejects.toThrow(
                'Org "bar" is not found.'
            );
        });

        it("should always return plain object", async () => {
            await expect(postRequest("/org/foo", { name: "bar" })).resolves.toBeTruthy();
            await expect(getRequest("/org/foo/bar/members/baz/teams")).resolves.toEqual(
                {}
            );
        });
    });

    describe("PUT /org/:adminId/:orgSlug/members/:memberId/teams", () => {
        it("should throw if org not exists", async () => {
            await expect(
                putRequest("/org/foo/bar/members/baz/teams", [])
            ).rejects.toThrow('Org "bar" is not found.');
        });

        it("should throw if org member not exists", async () => {
            await expect(postRequest("/org/foo", { name: "bar" })).resolves.toBeTruthy();
            await expect(putRequest("/org/foo/bar/members/baz/teams")).rejects.toThrow(
                'Member "baz" not found in org "bar".'
            );
        });

        it("should throw if teams is invalid object", async () => {
            await expect(postRequest("/org/foo", { name: "bar" })).resolves.toBeTruthy();
            await expect(postRequest("/org/foo/bar/members",{id: "baz"})).resolves.toBeTruthy();

            await expect(putRequest("/org/foo/bar/members/baz/teams")).rejects.toThrow(
                'Invalid org member "teams" value.'
            );
        });

        it("should update member teams", async () => {
            await expect(postRequest("/org/foo", { name: "bar" })).resolves.toBeTruthy();
            await expect(
                postRequest("/org/foo/bar/members", {id: "baz",teams: ["quoz", "noop"]})
            ).resolves.toBeTruthy();

            await expect(getRequest("/org/foo/bar/teams")).resolves.toEqual({
                noop: { baz: true },
                quoz: { baz: true }
            });

            await expect(
                putRequest("/org/foo/bar/members/baz/teams", ["loop", "boop"])
            ).resolves.toBe("");

            await expect(getRequest("/org/foo/bar/teams")).resolves.toEqual({
                loop: { baz: true },
                boop: { baz: true }
            });
        });
    });
  });
});
