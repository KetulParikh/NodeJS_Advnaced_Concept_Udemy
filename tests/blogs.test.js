const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When user is logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    const label = await page.getContent("form label");
    expect(label).toEqual("Blog Title");
  });

  describe("and using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form should show an error message", async () => {
      const titleErr = await page.getContent(".title .red-text");
      const contentErr = await page.getContent(".content .red-text");

      expect(titleErr).toEqual("You must provide a value");
      expect(contentErr).toEqual("You must provide a value");
    });
  });

  describe("and using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "Test Title");
      await page.type(".content input", "Test Content");
      await page.click("form button");
    });

    test("submiting takes user to review screen", async () => {
      const text = await page.getContent("h5");
      expect(text).toEqual("Please confirm your entries");
    });

    test("submitting and saving the blog to the index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const title = await page.getContent(".card-title");
      const content = await page.getContent("p");

      expect(title).toEqual("Test Title");
      expect(content).toEqual("Test Content");
    });
  });
});

describe("When user is not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
      status: 401,
      response: { error: "You must log in!" },
    },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "Test Title Error",
        content: "Test Content Error",
      },
      status: 401,
      response: { error: "You must log in!" },
    },
  ];
  // test("user can not create blog posts", async () => {
  //   const data = {
  //     title: "Test Title Error",
  //     content: "Test Content Error",
  //   };
  //   const { result, status } = await page.post("/api/blogs", data);
  //   expect(status).toEqual(401);
  //   expect(result).toEqual({ error: "You must log in!" });
  // });

  // test("user can not get list of blogs", async () => {
  //   const { result, status } = await page.get("/api/blogs");
  //   expect(status).toEqual(401);
  //   expect(result).toEqual({ error: "You must log in!" });
  // });

  test("Blog related actions are prohabited", async () => {
    const results = await page.execRequests(actions);
    results.forEach((result, index) => {
      expect(result["status"]).toEqual(actions[index]["status"]);
      expect(result["response"]).toEqual(actions[index]["response"]);
    });
  });
});
