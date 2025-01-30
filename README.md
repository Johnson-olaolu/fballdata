# Readr - Article Publishing Platform

A web application that allows users to create, publish and read articles. Built with Node.js, Express, TypeScript, and PostgreSQL and EJS.

## Features

- User authentication (register, login, email verification) 
- Article creation with rich text editor
- Article management (edit, delete)
- Article viewing with view/like counts
- Article search functionality
- Dashboard with analytics
- Tag support for articles
- Responsive design

## Tech Stack

- Node.js/Express
- TypeScript
- PostgreSQL/Sequelize ORM 
- EJS templating
- Bootstrap 5
- Quill rich text editor
- Cloudinary for image storage

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm/yarn

## Environment Variables

Create a `.env` file with:

```
PORT=5000
NODE_ENV=development
SITE_URL=http://localhost:5000

# Database
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres 
DB_NAME=mydb
DB_HOST=localhost
DB_DIALECT=postgres

# JWT
JWT_ACCESS_TOKEN_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_NAME=your_cloud_name
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/readr.git
cd readr
```

2. Install dependencies
```bash 
npm install
```

3. Run database migrations
```bash
npx sequelize-cli db:migrate
```

4. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Build for Production

```bash
npm run build
npm start
```

## Docker Support

Build and run with Docker:

```bash
docker build -t readr .
docker run -p 5000:5000 readr
```

## License

MIT License
