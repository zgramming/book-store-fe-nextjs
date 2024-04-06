# Frontend for Library Apps

The project builds using Next JS, Tailwind CSS, Mantine

## Manual Installation

```bash
git clone https://github.com/zgramming/book-store-fe-nextjs.git
cd book-store-fe-nextjs
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env
# open .env and modify the environment variables
```


## Table of Contents

- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Pages](#pages)

## Commands

Running in development:

```bash
npm run dev
```

Running in production:

```bash
# build
npm run build
# start
npm run start
```

## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash
# API Url
NEXT_PUBLIC_BASE_URL=http://localhost:4000/api/v1
```

### Pages
List of available pages:

**Master Book**\
![alt text](screenshots/master-book-page.png)

**Master Student**\
![alt text](screenshots/master-student.png)

**Inventory**\
![alt text](screenshots/inventory.png)

**Transaction**\
![alt text](screenshots/transaction.png)

**History Transaction**
![alt text](screenshots/history.png)

