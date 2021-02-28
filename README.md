# ts-node-crud

This is a simple REST API with CRUD functionality.

Made with Typescript, Express and TypeORM

# Features

-   [x] Create Student
-   [x] List Students (paginated with _p_ query parameter)
-   [x] Show Student based on id
-   [x] Update Student
-   [x] Delete Student
-   [x] Model validations

# The student model

```typescript
class Student {
	first_name: string;
	last_name: string;
	year_of_admission: number;
}
```

# Running

First install the dependencies

```bash
npm i
```

Then run the dev server

```bash
npm run dev
```

This should expose our API at http://localhost:5000

-   All endpoints are mounted at http://localhost:5000/student

# Test

You can run the tests using (using Jest)

```bash
npm run test
```
# License

- BSD-3-Clause

