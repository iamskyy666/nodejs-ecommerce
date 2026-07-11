# MongoDB Aggregation Pipeline Cheat Sheet

Let's think of an aggregation pipeline as an **assembly line**. Documents enter one stage at a time, each stage transforms or filters them, and the output of one stage becomes the input of the next.

```text
Collection
    │
    ▼
$match
    │
    ▼
$project
    │
    ▼
$group
    │
    ▼
$sort
    │
    ▼
$limit
    │
    ▼
Result
```

---

# General Syntax

```js
db.collection.aggregate([
  { stage1 },
  { stage2 },
  { stage3 },
]);
```

or with Mongoose:

```js
const result = await Product.aggregate([
  { stage1 },
  { stage2 },
]);
```

---

# Order Matters ⚠️

Each stage only receives the output from the previous stage.

Good:

```js
[
  { $match: { featured: true } },
  { $sort: { price: 1 } }
]
```

Bad:

```js
[
  { $sort: { price: 1 } },
  { $match: { featured: true } }
]
```

Always filter early whenever possible.

---

# `$match` — Filter Documents

Equivalent to `find()`.

```js
{
  $match: {
    category: "office"
  }
}
```

Multiple conditions

```js
{
  $match: {
    category: "office",
    price: { $gt: 500 }
  }
}
```

Logical operators

```js
{
  $match: {
    $or: [
      { featured: true },
      { inventory: { $lt: 5 } }
    ]
  }
}
```

---

# `$project` — Select or Transform Fields

Choose which fields appear.

```js
{
  $project: {
    name: 1,
    price: 1
  }
}
```

Exclude field

```js
{
  $project: {
    __v: 0
  }
}
```

Rename field

```js
{
  $project: {
    productName: "$name",
    productPrice: "$price"
  }
}
```

Computed field

```js
{
  $project: {
    name: 1,
    discountedPrice: {
      $multiply: ["$price", 0.9]
    }
  }
}
```

---

# `$group` — Group Documents

Like SQL `GROUP BY`.

Average price by company

```js
{
  $group: {
    _id: "$company",
    averagePrice: {
      $avg: "$price"
    }
  }
}
```

Count documents

```js
{
  $group: {
    _id: "$company",
    totalProducts: {
      $sum: 1
    }
  }
}
```

Total inventory

```js
{
  $group: {
    _id: "$company",
    inventory: {
      $sum: "$inventory"
    }
  }
}
```

---

# Common Accumulators

| Operator    | Purpose         |
| ----------- | --------------- |
| `$sum`      | Sum values      |
| `$avg`      | Average         |
| `$min`      | Minimum         |
| `$max`      | Maximum         |
| `$first`    | First document  |
| `$last`     | Last document   |
| `$push`     | Push into array |
| `$addToSet` | Unique values   |

---

Example

```js
{
  $group: {
    _id: "$company",
    prices: {
      $push: "$price"
    }
  }
}
```

Output

```json
{
  "_id": "ikea",
  "prices": [100, 250, 400]
}
```

---

# `$sort`

Ascending

```js
{
  $sort: {
    price: 1
  }
}
```

Descending

```js
{
  $sort: {
    price: -1
  }
}
```

Multiple fields

```js
{
  $sort: {
    company: 1,
    price: -1
  }
}
```

---

# `$limit`

```js
{
  $limit: 10
}
```

Returns first 10 documents.

---

# `$skip`

Useful for pagination.

```js
{
  $skip: 20
}
```

Example

```js
[
  { $skip: 20 },
  { $limit: 10 }
]
```

Returns page 3.

---

# `$unwind`

Converts array elements into separate documents.

Before

```json
{
  "colors": ["red", "blue"]
}
```

After

```json
{
  "colors": "red"
}
```

```json
{
  "colors": "blue"
}
```

Syntax

```js
{
  $unwind: "$colors"
}
```

---

# `$lookup`

MongoDB join.

Products

```text
Product

user

67a...
```

Users

```text
_id

67a...

name

Skyy
```

Pipeline

```js
{
  $lookup: {
    from: "users",
    localField: "user",
    foreignField: "_id",
    as: "owner"
  }
}
```

Output

```json
{
  "owner": [
    {
      "name": "Skyy"
    }
  ]
}
```

---

# `$count`

```js
{
  $count: "totalProducts"
}
```

Output

```json
{
  "totalProducts": 245
}
```

---

# `$addFields`

Adds computed fields.

```js
{
  $addFields: {
    totalPrice: {
      $multiply: ["$price", "$inventory"]
    }
  }
}
```

---

# `$unset`

Remove fields.

```js
{
  $unset: "password"
}
```

Multiple

```js
{
  $unset: ["password", "__v"]
}
```

---

# `$sample`

Random documents.

```js
{
  $sample: {
    size: 5
  }
}
```

---

# `$facet`

Run multiple pipelines simultaneously.

```js
{
  $facet: {
    products: [
      { $limit: 10 }
    ],
    total: [
      { $count: "count" }
    ]
  }
}
```

Great for pagination APIs.

---

# `$bucket`

Group into ranges.

```js
{
  $bucket: {
    groupBy: "$price",
    boundaries: [0,100,500,1000],
    default: "Other"
  }
}
```

Output

```text
0-100

100-500

500-1000
```

---

# `$bucketAuto`

Automatically creates buckets.

```js
{
  $bucketAuto: {
    groupBy: "$price",
    buckets: 5
  }
}
```

---

# `$sortByCount`

Shortcut for:

```text
Group

+

Sort
```

```js
{
  $sortByCount: "$company"
}
```

Output

```json
{
  "_id": "ikea",
  "count": 52
}
```

---

# `$replaceRoot`

Replace the document.

```js
{
  $replaceRoot: {
    newRoot: "$user"
  }
}
```

---

# Useful Expressions

Comparison

```js
$eq
$gt
$gte
$lt
$lte
$ne
```

Math

```js
$add
$subtract
$multiply
$divide
$round
$ceil
$floor
```

Strings

```js
$concat
$toUpper
$toLower
$strLenCP
$substr
$trim
```

Arrays

```js
$size
$arrayElemAt
$slice
$filter
$map
```

Condition

```js
$cond
$switch
$ifNull
```

Date

```js
$year
$month
$dayOfMonth
$hour
$minute
$dateToString
```

---

# Typical Pipeline

```js
Product.aggregate([
  {
    $match: {
      featured: true,
    },
  },

  {
    $group: {
      _id: "$company",
      averagePrice: {
        $avg: "$price",
      },
      totalProducts: {
        $sum: 1,
      },
    },
  },

  {
    $sort: {
      averagePrice: -1,
    },
  },

  {
    $limit: 5,
  },
]);
```

---

# Performance Tips

✅ Place `$match` as early as possible to reduce the number of documents processed.

✅ Project only the fields you need with `$project` or `$unset`.

✅ Ensure fields used in `$match`, `$sort`, and `$lookup` are indexed where appropriate.

✅ Avoid unwinding very large arrays unless necessary.

✅ Use `$facet` to combine pagination results and total counts in a single database call.

---

# Common Pipeline Patterns

### 1. Filter → Sort → Paginate

```js
[
  { $match: { featured: true } },
  { $sort: { price: -1 } },
  { $skip: 20 },
  { $limit: 10 }
]
```

### 2. Group → Calculate Statistics

```js
[
  {
    $group: {
      _id: "$company",
      avgPrice: { $avg: "$price" },
      maxPrice: { $max: "$price" },
      minPrice: { $min: "$price" },
      count: { $sum: 1 }
    }
  }
]
```

### 3. Join Related Collections

```js
[
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "product",
      as: "reviews"
    }
  }
]
```

### 4. Dashboard Statistics

```js
[
  {
    $facet: {
      products: [{ $count: "total" }],
      featured: [{ $match: { featured: true } }, { $count: "count" }],
      inventory: [
        {
          $group: {
            _id: null,
            total: { $sum: "$inventory" }
          }
        }
      ]
    }
  }
]
```

This covers the aggregation stages and patterns you'll encounter most often while building REST APIs and analytics features in Node.js/Mongoose applications.
