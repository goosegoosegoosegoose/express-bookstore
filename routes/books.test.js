process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let testBook;
beforeEach(async() => {
    const result = await Book.create({
        isbn: "test",
        amazon_url: "http://a.co/test",
        author: "test",
        language: "test",
        pages: 100,
        publisher: "test",
        title: "test",
        year: 2000
      });
    testBook = result;
});

afterEach(async() => {
    await db.query("DELETE FROM books");
});

afterAll(async() => {
    await db.end();
});

describe("GET /books", () => {
    test("Get list of books", async () => {
        const res = await request(app).get("/books");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({books: [testBook]})
    });
});

describe("POST /books", () => {
    test("POST new book", async () => {
        const test = {
            isbn: "testtest",
            amazon_url: "http://a.co/testtest",
            author: "testtest",
            language: "testtest",
            pages: 10000,
            publisher: "testtest",
            title: "testtest",
            year: 20000000
        };
        const res = await request(app)
            .post("/books")
            .send(test);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({book: test})
    });

    test("POST invalid schema book", async () => {
        const test = {
            isbn: "testtest",
            amazon_url: "http://a.co/testtest",
            author: 394,
            language: "testtest",
            pages: "10000",
            publisher: "testtest",
            title: "testtest",
            year: "20000000"
        };
        const res = await request(app)
            .post("/books")
            .send(test);

        expect(res.statusCode).toBe(400);
    });
});

describe("GET /books/:isbn", () => {
    test("Get book by id (not sure why its not isbn", async () => {
        const res = await request(app).get(`/books/${testBook.isbn}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({book: testBook});
    });

    test("Get invalid isbn", async () => {
        const res = await request(app).get(`/books/invalid`);

        expect(res.statusCode).toBe(404);
    });
});

describe("PUT /books/:isbn", () => {
    test("PUT edit a book by isbn", async () => {
        const test = {
            isbn: "test",
            amazon_url: "http://a.co/test",
            author: "testtest",
            language: "test",
            pages: 10000,
            publisher: "testtest",
            title: "testtest",
            year: 20000000
        };
        const res = await request(app)
            .put(`/books/${testBook.isbn}`)
            .send(test);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({book: test});
    });

    test("PUT invalid isbn", async () => {
        const test = {
            isbn: "test",
            amazon_url: "http://a.co/test",
            author: "testtest",
            language: "test",
            pages: 10000,
            publisher: "testtest",
            title: "testtest",
            year: 20000000
        };
        const res = await request(app)
        .put(`/books/invalid`)
        .send(test);

        expect(res.statusCode).toBe(404);
    });

    test("PUT invalid schema", async () => {
        const test = {
            isbn: 500,
            amazon_url: "http://a.co/test",
            author: "testtest",
            language: 94473,
            pages: "10000",
            publisher: "testtest",
            title: "testtest",
            year: 20000000
        };
        const res = await request(app)
        .put(`/books/invalid`)
        .send(test);

        expect(res.statusCode).toBe(400);
    });
});

describe("DELETE /books/:isbn", () => {
    test("Delete book", async () => {
        const res = await request(app).delete(`/books/${testBook.isbn}`)

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Book deleted"});
    });

    test("Delete invalid isbn", async () => {
        const res = await request(app).get(`/books/invalid`);

        expect(res.statusCode).toBe(404);
    });
})