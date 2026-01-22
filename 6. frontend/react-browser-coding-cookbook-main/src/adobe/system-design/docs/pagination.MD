### Key Concepts ###

*** Pagination ***
Type of pagination:

1. Offset-based pagination
2. Cursor-based pagination

***🎯 Perfect interview answer (short + impactful)***

“OFFSET pagination doesn’t scale because the database must still read and sort all skipped rows before discarding them. With a huge OFFSET like 1,000,000, it results in scanning 1M+ rows just to get the next 20, which severely degrades performance.

In large systems we use keyset or cursor pagination to avoid this problem.”


### Offset-based pagination ###
Offset-based pagination involves using an offset to specify where to start retrieving data and a limit to specify the number of items to retrieve.

web appliations travel booking websites, e-commerce websites will benefit from using offset-based pagination for their search results.

An offset-based pagination API accepts the following parameters:

Parameter	Type	Description
size	number	Number of items per page
page	number	Page number to fetch

Ex - {size: 5, page: 2}

Response : 

```json
{
  "pagination": {
    "size": 5,
    "page": 2,
    "total_pages": 4,
    "total": 20
  },
  "results": [
    {
      "id": "123",
      "author": {
        "id": "456",
        "name": "John Doe"
      },
      "content": "Hello world",
    }
  ]
}
```

SQL query resembles

SELECT * FROM posts LIMIT 5 OFFSET 0; -- First page
SELECT * FROM posts LIMIT 5 OFFSET 5; -- Second page


*** However, offset-based pagination comes with some issues: ***

Inaccurate page results: For data that updates frequently, the current page window might be inaccurate after some time. Imagine a user has fetched the first 5 posts in their feed. After sometime, 5 more posts were added. If the users scroll to the bottom of the feed and fetches page 2, the same posts in the original page 1 will be fetched, and the user will see duplicate posts.

// Initial posts (newest on the left, oldest on the right)
Posts: A, B, C, D, E, F, G, H, I, J
       ^^^^^^^^^^^^^ Page 1 contains A - E

// New posts added over time
Posts: K, L, M, N, O, A, B, C, D, E, F, G, H, I, J
                      ^^^^^^^^^^^^^ Page 2 also contains A - E


*** Clients can try to be smart and de-duplicate posts by not showing posts that are already visible. However this requires custom logic and the client will have to make a new request to make up for the lack of new posts which costs an extra network roundtrip. For use cases where the number of items can reduce over time, pages can end up missing some items instead.**


**Query performance degrades over time: Lastly, query performance degrades as the table becomes larger. For huge offsets (e.g. OFFSET 1000000) the database still has to read up to those count + offset rows, discard the offset rows and only return the count rows, which results in very poor query performance for large offsets. This is considered back end knowledge but it's useful to know and you might get brownie points for mentioning it.**


### Cursor-based pagination ###
Cursor-based pagination uses a pointer (the cursor) to a specific record in a dataset. Instead of saying "give me items 11 to 15", it says "give me 5 items starting after [specific item].".

The cursor is usually a unique identifier, which can be the item id, timestamp,

 Subsequent requests use the identifier of the last item as the cursor to fetch the next set of items. In SQL, an example is:

 SELECT * FROM table WHERE id > cursor LIMIT 5.

A cursor-based pagination API accepts the following parameters:

Parameter	Type	Description
1. size	number	Number of results per page
2. cursor	string	An identifier for the last item fetched. The database query will make use of this identifier.

response:

```json
{
  "pagination": {
    "size": 10,
    "next_cursor": "=dXNlcjpVMEc5V0ZYTlo"
  },
  "results": [
    {
      "id": "123",
      "author": {
        "id": "456",
        "name": "John Doe"
      },
      "content": "Hello world",
      "image": "https://www.example.com/feed-images.jpg",
      "reactions": {
        "likes": 20,
        "haha": 15
      },
      "created_time": 1620639583
    }
    // ... More posts.
  ]
}
```

***Advantages of cursor-based pagination:***

1. More efficient and faster on large datasets.
2. Avoids the inaccurate page window problem because new posts added over time do not affect the offset, which is determined by a fixed cursor. Great for real-time data.

 ***ursor is a database table's primary key or in some cases, the timestamp.***






 ### ✅ Why query performance degrades for large OFFSET

(e.g., LIMIT 20 OFFSET 1000000)

Even though it looks like the database should “jump” to row 1,000,000 and return the next 20 rows, it cannot.

What actually happens inside DB:

When you run:

```sql
SELECT * FROM posts ORDER BY created_at LIMIT 20 OFFSET 1000000;
```


The database must still scan the first 1,000,000 rows, then throw them away, and finally return the next 20.

Reason:

OFFSET means skip N rows, not start at row N

DB has to read rows in sorted order

You can’t skip before reading → DB reads, sorts, and discards

🔥 Meaning:

More rows = more work

More offset = more discarding

Result → performance degrades linearly or worse

🌡 Example of cost

If a table has 5 million rows:

OFFSET 0 → DB returns instantly

OFFSET 100,000 → starts slowing

OFFSET 1,000,000 → DB scans 1M rows, discards them

OFFSET 4,000,000 → very slow (seconds to tens of seconds)


🧠 Why companies hate OFFSET pagination in production

Because:

❌ Expensive for DB

It forces full scans → massive CPU + IO.

❌ Causes latency spikes

Users on high pages suffer huge delays.

❌ Breaks caching

Every offset number → unique query.

❌ Risk of DB overload

High traffic + high pages → DB meltdown.

This is why many real systems (Facebook, Instagram, Twitter) never use OFFSET pagination.


🏆 Better Alternatives (mention these in interview → brownie points)
1. Keyset Pagination (a.k.a. Seek Pagination)

Use a cursor/ID instead of OFFSET.

```sql
SELECT * FROM posts 
WHERE id < last_seen_id
ORDER BY id DESC
LIMIT 20;
```

**Fast even at page 1,000,000 (because DB uses an index + range scan)**

2. Cursor-based Pagination (used by GraphQL, Instagram)

Return a cursor instead of page number.

```graphql
after: "cursor_string"
limit: 20
```