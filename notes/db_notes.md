These are two of the most important MongoDB/Mongoose concepts. Understanding them well will make a huge difference when building production APIs.

---

# 1. What is an Index?

Think of an index like the **index at the back of a textbook**.

Suppose we have a 1200-page book.

Without an index:

```
Need "Binary Trees"

Page 1
Page 2
Page 3
...
Page 1200
```

We search every page.

With an index:

```
Binary Trees .......... Page 842
Graphs ............... Page 920
Queues ............... Page 310
```

We jump directly to the page.

MongoDB indexes work the same way.

---

## Without Index

Suppose we have one million users.

```js
{
   _id: ...
   name: "Skyy",
   email: "skyy@gmail.com"
}
```

Searching:

```js
await User.findOne({
    email: "skyy@gmail.com"
});
```

MongoDB must inspect documents until it finds the match.

```
User1 ❌
User2 ❌
User3 ❌
...
User800000 ❌
User800001 ✅
```

This is called a **Collection Scan (COLLSCAN)**.

Time complexity is approximately

```
O(n)
```

---

# With Index

Now create an index.

```js
email: {
    type: String,
    unique: true
}
```

Mongoose creates an index on `email`.

MongoDB stores something conceptually like

```
email                     document pointer

adam@gmail.com   ----> Doc 3
john@gmail.com   ----> Doc 15
mike@gmail.com   ----> Doc 90
skyy@gmail.com   ----> Doc 800001
```

Now searching

```js
User.findOne({
    email: "skyy@gmail.com"
});
```

becomes

```
Look inside index

↓

Found pointer

↓

Jump directly to document
```

Instead of scanning 1 million documents.

---

# Why is it faster?

MongoDB indexes are implemented using **B-trees** (specifically a B-tree/B+ tree–like structure).

Very simplified:

```
               M
           /       \
        G             T
      /   \         /   \
    C      K      P      Z
```

Searching:

```
Find "Skyy"

↓

M

↓

T

↓

P

↓

Skyy
```

Only a handful of comparisons are needed.

Instead of

```
1 million comparisons
```

it becomes roughly

```
log₂(n)
```

which is much faster.

---

# `_id` is Indexed Automatically

Every MongoDB document has

```js
_id
```

MongoDB automatically creates an index on `_id`.

So

```js
User.findById(id)
```

is extremely fast.

---

# Unique Index

```js
email: {
    type: String,
    unique: true
}
```

Many beginners think

```
unique
```

means validation.

It doesn't.

It creates a **unique index**.

That index refuses duplicate values.

Example

```
User A

email:
abc@gmail.com

↓

Insert User B

email:
abc@gmail.com

↓

MongoDB

Duplicate Key Error
```

Error:

```
E11000 duplicate key
```

---

# Compound Index

Suppose products.

```js
{
   category:"Laptop",
   price:90000
}
```

Searching:

```js
Product.find({
   category:"Laptop",
   price:{$lt:100000}
});
```

Instead of two separate indexes

MongoDB can create

```
(category, price)
```

This is called a compound index.

```
Laptop 50000
Laptop 70000
Laptop 90000
Laptop 150000
Phone 20000
Phone 60000
```

Searching becomes much faster.

---

# Create Index

In Mongoose

```js
UserSchema.index({
    email: 1
});
```

Ascending

or

```js
UserSchema.index({
    createdAt: -1
});
```

Descending

---

# Compound

```js
ProductSchema.index({
    category: 1,
    price: 1
});
```

---

# Text Index

Useful for searching.

```js
ProductSchema.index({
    name: "text",
    description: "text"
});
```

Now

```js
Product.find({
    $text: {
        $search: "iphone"
    }
});
```

---

# Too Many Indexes?

Indexes are amazing...

until we have too many.

Every index consumes:

* RAM
* Disk space
* CPU
* Insert/update performance

Suppose five indexes exist.

Insert one document.

MongoDB updates:

```
Collection

↓

Index1

↓

Index2

↓

Index3

↓

Index4

↓

Index5
```

Writes become slower.

Rule:

> Create indexes for fields we frequently query, sort, or join on—not every field.

---

# 2. Populate()

This is a Mongoose feature, **not a MongoDB feature**.

MongoDB has no joins like SQL.

Instead, MongoDB stores references.

---

Suppose Users

```
Users

1

Skyy

2

John
```

Products

```
Macbook

createdBy

1
```

The product stores only

```
ObjectId
```

```
Product

{
    name:"Macbook"

    createdBy:
    ObjectId("...")
}
```

---

Schema

```js
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}
```

Notice

```
ref
```

This tells Mongoose

"This ObjectId belongs to User."

---

Without Populate

```js
const product =
await Product.findOne();
```

Output

```js
{
    name:"Macbook",

    createdBy:
    "687d8a2f..."
}
```

Only ObjectId.

---

With Populate

```js
const product =
await Product.findOne()
.populate("createdBy");
```

Output

```js
{
    name:"Macbook",

    createdBy:{
        _id:"687d8a2f...",
        name:"Skyy",
        email:"skyy@gmail.com",
        role:"admin"
    }
}
```

Mongoose performs another query behind the scenes to fetch the referenced user and replaces the `ObjectId` with the user document.

---

# Populate Selected Fields

Usually

```js
.populate(
    "createdBy",
    "name email"
);
```

Output

```js
createdBy:{
    name:"Skyy",
    email:"skyy@gmail.com"
}
```

Never expose password.

---

Exclude Password

```js
.populate(
    "createdBy",
    "-password"
);
```

---

Populate Multiple Fields

```js
Order.find()
.populate("user")
.populate("products");
```

---

Nested Populate

Imagine

```
Order

↓

User

↓

Company
```

```js
Order.find()
.populate({
    path:"user",
    populate:{
        path:"company"
    }
});
```

---

# Example: E-Commerce

## User

```js
{
   _id:1,
   name:"Skyy"
}
```

---

## Product

```js
{
   _id:101,
   name:"Macbook",
   createdBy:1
}
```

---

## Review

```js
{
   _id:900,
   rating:5,
   user:1,
   product:101
}
```

Now

```js
Review.find()
.populate("user", "name")
.populate("product", "name price");
```

Produces something like:

```js
[
  {
    rating: 5,
    user: {
      name: "Skyy"
    },
    product: {
      name: "MacBook",
      price: 189999
    }
  }
]
```

---

# Is `populate()` fast?

Not always.

Suppose:

* 10,000 reviews
* Each review references a user
* Each user references a company

```
Review

↓

User

↓

Company
```

Mongoose may execute additional queries and assemble the results. For large datasets or deep relationships, this can become expensive in terms of latency and memory.

In high-performance systems, developers sometimes:

* Embed frequently accessed data instead of referencing it.
* Fetch related collections manually with carefully designed queries.
* Use MongoDB's aggregation framework with `$lookup` when appropriate.

---

# When to use each

| Feature      | Purpose                      | Database or Mongoose? | Typical Use                                             |
| ------------ | ---------------------------- | --------------------- | ------------------------------------------------------- |
| **Index**    | Speed up queries and sorting | MongoDB               | Fast lookups on fields like `_id`, `email`, `createdAt` |
| **Populate** | Resolve referenced documents | Mongoose              | Replace `ObjectId` references with full documents       |

---

## Best practices for our E-Commerce API

As we build our API, a few indexes will be especially valuable:

* `email` (unique) in the `User` model for fast login lookups.
* `createdBy` in models like `Product` or `Review` if we frequently query by owner.
* `category` and possibly a compound index on `{ category, price }` if we support filtering products by category and price.
* `createdAt` if we often sort by newest items.

For `populate()`, use it when we need related information in the response—for example, showing the reviewer's name on a product page. Avoid populating large relationships by default; fetch only the fields we need (e.g., `"name email"` or `"-password"`), as this keeps responses smaller and improves performance.

---

Mongoose Virtuals are one of the most elegant features of Mongoose. They're used extensively in real-world applications, especially in e-commerce, social media, and blogging platforms.

Let's understand them from the ground up.


# What is a Virtual?

A **Virtual** is a property that **does not exist in the MongoDB document** but **appears to exist** when we work with our Mongoose model.

Think of it as a **computed field**.

For example, suppose a user document looks like this:

```json
{
  "_id": "687f...",
  "firstName": "Soumadip",
  "lastName": "Banerjee"
}
```

MongoDB stores only these fields.

But in our application, we might want:

```text
fullName

↓

Soumadip Banerjee
```

We don't want to save `fullName` because it's just:

```text
firstName + lastName
```

That's exactly what a Virtual is for.

---

# Without Virtual

Suppose every time we need the full name, we do:

```js
const fullName = `${user.firstName} ${user.lastName}`;
```

Imagine doing this in:

* Login
* Profile
* Orders
* Reviews
* Admin Dashboard

We'll keep repeating ourselves.

---

# With Virtual

```js
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
```

Now:

```js
const user = await User.findById(id);

console.log(user.fullName);
```

Output:

```text
Soumadip Banerjee
```

Notice:

There is **no** `fullName` field inside MongoDB.

---

# Visual Representation

MongoDB

```text
Users Collection

-----------------------------

_id
firstName
lastName

-----------------------------
```

Mongoose

```text
User Document

↓

_id

↓

firstName

↓

lastName

↓

Virtual

↓

fullName
```

The Virtual exists only in memory.

---

# Does it get saved?

No.

MongoDB document:

```json
{
  "firstName": "Soumadip",
  "lastName": "Banerjee"
}
```

Even after:

```js
console.log(user.fullName);
```

Database remains:

```json
{
  "firstName": "Soumadip",
  "lastName": "Banerjee"
}
```

No new field appears.

---

# Why?

Because storing:

```text
fullName
```

would duplicate information.

Suppose:

```text
firstName

↓

John
```

Later:

```text
firstName

↓

Mike
```

Now

```text
fullName
```

would become wrong unless updated too.

Virtuals avoid this inconsistency by computing the value whenever it's accessed.

---

# Getter Virtuals

Most common.

```js
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
```

Whenever:

```js
user.fullName
```

is accessed,

Mongoose executes:

```js
return `${this.firstName} ${this.lastName}`;
```

---

# Another Example

Product

```js
{
   price:1200,
   discount:15
}
```

Virtual

```js
ProductSchema.virtual("discountPrice").get(function () {
  return this.price - (this.price * this.discount) / 100;
});
```

Database

```text
price

↓

1200

discount

↓

15
```

Virtual

```text
discountPrice

↓

1020
```

Never stored.

---

# Virtual Setter

Virtuals can also set values.

Suppose:

```text
fullName

↓

John Doe
```

Instead of manually splitting:

```js
user.firstName = "John";
user.lastName = "Doe";
```

Use:

```js
UserSchema.virtual("fullName").set(function (value) {
  const parts = value.split(" ");

  this.firstName = parts[0];
  this.lastName = parts[1];
});
```

Now:

```js
user.fullName = "John Doe";
```

Automatically becomes:

```text
firstName

↓

John

lastName

↓

Doe
```

---

# Why don't Virtuals appear in JSON?

Suppose:

```js
res.json(user);
```

Output:

```json
{
  "_id": "...",
  "firstName": "John",
  "lastName": "Doe"
}
```

No:

```text
fullName
```

Why?

Because Virtuals are disabled by default when converting documents to JSON or plain objects.

---

Enable them:

```js
const UserSchema = new mongoose.Schema(
  {
    ...
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
```

Now:

```js
res.json(user);
```

becomes:

```json
{
  "_id": "...",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe"
}
```

Still not stored in MongoDB.

---

# The Most Important Use: Reverse Populate

This is where Virtuals become incredibly powerful.

Suppose:

Users

```text
User

↓

_id

1

↓

John
```

Products

```text
Product

↓

createdBy

1
```

One user

↓

Many products

---

Normally:

Product has:

```js
createdBy: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
}
```

Easy:

```js
Product.find().populate("createdBy");
```

But what if we have a **User** and want **all products created by that user**?

The `User` document has no `products` field.

---

Virtual Populate

```js
UserSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "createdBy",
});
```

Now:

```js
const user = await User.findById(id).populate("products");
```

Output:

```json
{
  "name": "John",
  "products": [
    {
      "name": "iPhone"
    },
    {
      "name": "MacBook"
    },
    {
      "name": "iPad"
    }
  ]
}
```

Notice:

MongoDB never stored:

```text
products:[...]
```

Mongoose generated it dynamically.

---

# Example in our E-Commerce API

Review schema:

```js
user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
}

product: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Product"
}
```

Product schema can define:

```js
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});
```

Now:

```js
const product = await Product.findById(id).populate("reviews");
```

Returns:

```json
{
  "name": "MacBook",
  "price": 189999,
  "reviews": [
    {
      "rating": 5
    },
    {
      "rating": 4
    }
  ]
}
```

No `reviews` array is stored inside the product document.

---

# Virtual vs Real Field

| Feature                     | Real Field | Virtual            |
| --------------------------- | ---------- | ------------------ |
| Stored in MongoDB           | ✅          | ❌                  |
| Takes storage space         | ✅          | ❌                  |
| Can be queried with MongoDB | ✅          | ❌                  |
| Can be indexed              | ✅          | ❌                  |
| Computed dynamically        | ❌          | ✅                  |
| Appears in JSON by default  | ✅          | ❌ (unless enabled) |

---

# Virtual vs Populate

This is where many beginners get confused.

### Normal `populate()`

```js
Review.find().populate("user");
```

We already have a `user` field containing an `ObjectId`. Mongoose replaces that ID with the referenced `User` document.

### Virtual Populate

```js
User.findById(id).populate("reviews");
```

There is **no** `reviews` field in the `User` document. The virtual tells Mongoose how to find all `Review` documents whose `user` field matches the current user's `_id`.

---

# Performance considerations

Virtual getters (like `fullName`) are very cheap—they're just JavaScript functions.

Virtual populates, however, involve additional database queries. If a user has thousands of related documents (e.g., reviews or orders), populating them all can become expensive.

A few best practices:

* Use virtual getters for computed values such as `fullName`, `discountPrice`, or `isInStock`.
* Use virtual populate when we need reverse relationships that we don't want to store in MongoDB.
* Populate only when the related data is actually needed.
* Use `select` to limit populated fields, for example:

  ```js
  await User.findById(id).populate({
    path: "products",
    select: "name price image",
  });
  ```
* Consider `count: true` for virtual populate if we only need the number of related documents:

  ```js
  UserSchema.virtual("productCount", {
    ref: "Product",
    localField: "_id",
    foreignField: "createdBy",
    count: true,
  });
  ```

## How we'll use Virtuals in our E-Commerce API

Based on the project we're building, the most practical virtuals are:

* **Product → Reviews**: a virtual populate to fetch all reviews for a product.
* **Product → Number of reviews**: a virtual with `count: true` if we only need the total.
* **User → Products**: if we later build a seller dashboard showing all products created by a user.
* **Computed values** like discounted price or formatted names, if those values don't belong in the database.

These are the kinds of virtuals we'll commonly see in production Mongoose applications.

