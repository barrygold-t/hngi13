# Country Currency & Exchange API

A RESTful API that fetches global country data, merges it with live currency exchange rates, computes estimated GDP, and caches everything in a MySQL database.

---

## Features

- Fetches country details from **REST Countries API**
- Fetches exchange rates from **Open Exchange Rate API**
- Calculates `estimated_gdp = population × random(1000–2000) ÷ exchange_rate`
- Caches data in a MySQL database
- Supports filters, sorting, and CRUD operations
- Generates a **summary image** (`cache/summary.png`) showing:
  - Total number of countries
  - Top 5 countries by GDP
  - Timestamp of last refresh

---

## Tech Stack

- **Node.js + Express**
- **Sequelize ORM**
- **MySQL** (Railway)
- **Axios** for external API calls
- **Sharp** + **node-html-to-image** for image generation
- **dotenv** for environment configuration
- **Day.js** for timestamps

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/country-exchange-api.git
cd country-exchange-api
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the project root:

```env
PORT=4000
DB_HOST=<your-railway-host>
DB_USER=<your-username>
DB_PASS=<your-password>
DB_NAME=<your-database>
DB_PORT=3306
```

### 4️⃣ Run the server

```bash
npm start
```

Or with hot reload:

```bash
npm run dev
```

---

## 🗄️ API Endpoints

| Method     | Endpoint             | Description                                         |
| ---------- | -------------------- | --------------------------------------------------- |
| **POST**   | `/countries/refresh` | Fetch and cache all countries and exchange rates    |
| **GET**    | `/countries`         | Get all countries (supports filters and sorting)    |
| **GET**    | `/countries/:name`   | Get a single country by name                        |
| **DELETE** | `/countries/:name`   | Delete a country record                             |
| **GET**    | `/status`            | Get total number of countries and last refresh time |
| **GET**    | `/countries/image`   | Serve the generated summary image                   |

---

## 🔍 Query Parameters for `/countries`

| Parameter  | Example          | Description                         |
| ---------- | ---------------- | ----------------------------------- |
| `region`   | `?region=Africa` | Filter by region                    |
| `currency` | `?currency=USD`  | Filter by currency code             |
| `sort`     | `?sort=gdp_desc` | Sort by GDP ascending or descending |

**Example:**

```
GET /countries?region=Africa&sort=gdp_desc
```

---

## 📦 Sample Responses

### ✅ Refresh

```json
{
  "message": "Countries refreshed successfully",
  "total": 250,
  "last_refreshed_at": "2025-10-26T18:00:00Z"
}
```

### ✅ Country List

```json
[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-26T18:00:00Z"
  }
]
```

### ✅ Status

```json
{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-26T18:00:00Z"
}
```

### ❌ Error Example

```json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from restcountries.com"
}
```

---

## 🧮 Estimated GDP Formula

```
estimated_gdp = population × random(1000–2000) ÷ exchange_rate
```

Each refresh recalculates GDP with a new random multiplier.

---

## 🖼️ Image Generation

After a successful refresh (`POST /countries/refresh`),
a summary image is generated at:

```
cache/summary.png
```

Use this endpoint to view it:

```
GET /countries/image
```

If the image doesn’t exist, returns:

```json
{ "error": "Summary image not found" }
```

---

## 🧠 Validation Rules

* `name`, `population`, and `currency_code` are **required**
* Return `400 Bad Request` if missing or invalid
* Return `404` if country not found
* Always respond in **JSON**

---

## 📄 License

MIT License ©BarryGold 2025
Built with ❤️ for **HNG13 Backend Internship**