Understanding **how image uploading works end-to-end** is much more valuable than just memorizing the code. Let's walk through the complete lifecycle of an image in our backend.

---

# Overall Flow

```text
Browser
   │
   │ Select image
   ▼
multipart/form-data request
   │
   ▼
Express
   │
   ▼
express-fileupload middleware
   │
   ▼
req.files.image
   │
   ▼
Validation
   │
   ▼
Move image to public/uploads
   │
   ▼
Return image URL
   │
   ▼
Frontend stores URL
   │
   ▼
Browser requests image later
   │
   ▼
Express serves image from public/
```

Let's examine each step.

---

# Step 1 — User selects an image

Suppose an admin creates a product.

The frontend has something like:

```html
<input type="file" name="image" />
```

The admin chooses:

```text
batman.jpg
```

The browser now has:

* Image bytes
* Filename
* MIME type
* File size

---

# Step 2 — Browser sends the request

Unlike JSON requests:

```json
{
  "name": "iPhone",
  "price": 999
}
```

a file upload uses

```text
multipart/form-data
```

because JSON cannot contain binary file data.

The browser sends something conceptually like:

```text
POST /api/products/uploadImage

Content-Type:
multipart/form-data
```

Inside the request:

```text
--------------------------------

image:
Batman.jpg

name:
Batman.jpg

type:
image/jpeg

binary bytes:
FF D8 FF E0 ...

--------------------------------
```

The important thing is that the image is sent as **binary data**, not Base64 or JSON.

---

# Step 3 — Express receives the request

Without any middleware,

```javascript
req.body
```

works for JSON.

But Express has no idea how to parse:

```text
multipart/form-data
```

That's why we install:

```javascript
import fileUpload from "express-fileupload";

app.use(fileUpload());
```

---

# What does `express-fileupload` do?

It intercepts every request.

If it sees

```text
multipart/form-data
```

it extracts every uploaded file.

Then it creates:

```javascript
req.files
```

Instead of

```javascript
req.body
```

Now:

```javascript
console.log(req.files);
```

prints

```javascript
{
  image: {
    name: "Batman.jpg",
    size: 49151,
    mimetype: "image/jpeg",
    mv: [Function],
    ...
  }
}
```

This is exactly what we saw.

---

# Step 4 — Why `req.files.image`?

Suppose the frontend has:

```html
<input
    type="file"
    name="image"
/>
```

The field name is

```text
image
```

So

```javascript
req.files.image
```

contains that uploaded file.

If the input were

```html
<input
    type="file"
    name="avatar"
/>
```

Then we'd use

```javascript
req.files.avatar
```

---

# Step 5 — Validate

First:

```javascript
if (!req.files || !req.files.image)
```

Prevents:

```text
Cannot read property 'image'
```

---

Then:

```javascript
if (
    !productImage.mimetype.startsWith("image/")
)
```

Suppose someone uploads

```text
virus.exe
```

Its MIME type might be

```text
application/octet-stream
```

It fails.

Only

```text
image/jpeg

image/png

image/webp

image/gif
```

pass.

---

Then size:

```javascript
const maxSize =
1024 * 1024;
```

equals

```text
1,048,576 bytes

=

1 MB
```

So huge images are rejected.

---

# Step 6 — Generate filename

Original filename:

```text
Batman.jpg
```

Generated:

```text
7fd77b6e-2f13...

-Batman.jpg
```

Why?

Imagine:

Admin A uploads

```text
iphone.jpg
```

Later

Admin B uploads

```text
iphone.jpg
```

Without UUID:

```text
iphone.jpg
```

gets overwritten.

With UUID:

```text
4ab2...

-iphone.jpg

e76c...

-iphone.jpg
```

Both exist.

---

# Step 7 — Build absolute path

We wrote

```javascript
const imagePath =
path.join(
    __dirname,
    "../public/uploads",
    fileName
);
```

Suppose

```text
__dirname
=
C:\PrimeShop\controllers
```

Then

```text
../public/uploads
```

becomes

```text
C:\PrimeShop\public\uploads\
```

Finally

```text
C:\PrimeShop\public\uploads\
4ab2...

-iphone.jpg
```

That's where the image will be saved.

---

# Step 8 — `mv()`

This is provided by `express-fileupload`.

```javascript
await productImage.mv(
    imagePath
);
```

means

> Move the uploaded temporary file into this folder.

Before:

```text
Memory

↓

Uploaded file
```

After:

```text
public/uploads/

↓

4ab2...

-iphone.jpg
```

Now it permanently exists on disk.

---

# Step 9 — Why `express.static()`?

We wrote:

```javascript
app.use(
    express.static("./public")
);
```

This is extremely important.

It tells Express:

> Everything inside

```text
public/
```

can be accessed directly.

Example:

Folder:

```text
public

└── uploads

      └── batman.jpg
```

Now opening

```text
http://localhost:5000/uploads/batman.jpg
```

returns

```text
🖼️ Batman image
```

No controller is involved.

Express serves it automatically.

---

# Step 10 — Why return

```javascript
image:
`/uploads/${fileName}`
```

instead of

```text
C:\Users...

```

Because the frontend doesn't care where the file lives on the server.

It only needs:

```text
/uploads/uuid-image.jpg
```

Later React renders:

```jsx
<img
src={product.image}
/>
```

which becomes

```html
<img
src="/uploads/uuid-image.jpg"
/>
```

Browser requests

```text
GET
/uploads/uuid-image.jpg
```

Express sees

```text
express.static("./public")
```

and returns

```text
public/uploads/uuid-image.jpg
```

---

# Final Architecture

```text
User
 │
 ▼
Choose Image
 │
 ▼
Browser
 │
 ▼
multipart/form-data
 │
 ▼
Express
 │
 ▼
express-fileupload
 │
 ▼
req.files.image
 │
 ▼
Validation
 │
 ▼
Generate UUID
 │
 ▼
Move to

public/uploads
 │
 ▼
Return

/uploads/uuid-image.jpg
 │
 ▼
Frontend stores URL
 │
 ▼
React renders

<img src="/uploads/uuid-image.jpg">
 │
 ▼
Browser requests image
 │
 ▼
Express.static()
 │
 ▼
Image returned
```

---

## How this changes in production

What we've built is perfect for small deployments. In production, many teams **don't store images on the backend server's local disk** because:

* If the server crashes or is replaced, local files may be lost.
* Multiple backend servers won't share the same `public/uploads` folder.
* Image delivery is slower than using specialized storage.

Instead, the upload flow becomes:

```text
Browser
    │
    ▼
Express API
    │
    ▼
Cloud storage (e.g., Cloudinary or Amazon S3)
    │
    ▼
Cloud returns a URL
    │
    ▼
Save that URL in MongoDB
    │
    ▼
Frontend uses the cloud URL directly
```

The validation logic (`req.files`, MIME type, size checks) remains very similar; only the storage destination changes from our local `public/uploads` directory to a cloud service.
