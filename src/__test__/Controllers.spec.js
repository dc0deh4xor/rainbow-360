beforeEach(() => {});

describe("Controllers", () => {
  describe("/org", () => {
    describe("POST /org/:adminId", () => {
      it("should create organization", () => {});
    });

    describe("GET /org/:adminId", () => {
      it("should return user organizations", () => {});
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
