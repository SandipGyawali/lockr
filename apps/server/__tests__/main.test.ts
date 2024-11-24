describe("Base Test", () => {
  beforeEach(() => {
    console.log("Before each running");
  });

  test("should run the /base route", () => {
    expect(true).toBe(true);
  });

  afterEach(() => {
    console.log("After all running");
  });
});
